//import { S3Client, PutObjectCommand, ListBucketsCommand, ListObjectsV2Command, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { useState, useEffect, useRef, useCallback } from "react";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  // * This allows for the safe round-trip transport of numbers of arbitrary size.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const credentials = {
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY,
    secretAccessKey: process.env.MY_SECRET_KEY,
  },
  region: process.env.MY_REGION,
};

const dbclient = new DynamoDBClient(credentials);
// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(dbclient, translateConfig);

const s3Client = new S3Client(credentials);

export const scanTable = async ({ table, tags, texts }) => {
  const params = { TableName: table.name };
  params.FilterExpression = "begins_with (id,:id)";
  params.ExpressionAttributeValues = { ":id": table.index };

  if (texts.length > 0) {
    for (let i = 0; i < texts.length; i++) {
      params.FilterExpression += ` and contains(chunk, :text${i})`;
      params.ExpressionAttributeValues[`:text${i}`] = texts[i];
    }
  }
  //params.FilterExpression = "contains(chunk, :text) and contains(chunk,:text2)";
  //params.ExpressionAttributeValues = { ":text": "merikarvia", ":text2": "weather" };
  //params.FilterExpression = "(not attribute_exists(#metadata.#metatags)) or (attribute_exists(#metadata.#metatags) and not contains(#metadata.#metatags,:tag))";
  //params.FilterExpression = "attribute_exists(#metadata.#metatags) and not contains(#metadata.#metatags,:tag)";

  /*
  params.FilterExpression = "attribute_exists(#metadata.#metatags) and not (contains(#metadata.#metatags,:tag) or contains(#metadata.#metatags,:tag1)) ";
  params.ExpressionAttributeNames = { "#metadata": "metadata", "#metatags": "metatags" };
  params.ExpressionAttributeValues = { ":tag": "testx", ":tag1": "validated" };
*/
  console.log("PARAMS ", params);
  const scanResults = [];
  //let scanResults = 0;

  let lastKey;
  do {
    const data = await ddbDocClient.send(new ScanCommand(params));
    // data.Items.forEach(item => scanResults.push(item));
    scanResults.push(...data.Items);
    //scanResults += data.Count;
    lastKey = data.LastEvaluatedKey;
    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }
  } while (lastKey);

  return scanResults;
};
/* 
export const scanTable = async (tableName) => {

  const params = { TableName: tableName };
  
  const scanResults = [];

  let lastKey;
  do {
    const data = await documentClient.scan(params).promise();
   // data.Items.forEach(item => scanResults.push(item));
   scanResults.push(...items.Items);
    lastKey = data.LastEvaluatedKey;
    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }
  } while(lastKey);

  return scanResults;

};
 */

async function deleteIndexContent(id) {
  //default#en#id-1700729474281-0.2d6d07827b509.txt
  //"file": "id-1700725833124-0.0067058078616.txt",
  try {
    const parts = id.split("#");
    const file = parts[2];
    const params = {
      Bucket: process.env.AI_BUCKET,
      Key: [parts[0], `${parts[0]}-index.json`].join("/"),
    };
    console.log(params);
    const { Body } = await s3Client.send(new GetObjectCommand(params));

    //console.log(await Body.transformToString());
    let bodyJSON = JSON.parse(await Body.transformToString());
    console.log(bodyJSON.items.length);
    const filteredItems = bodyJSON.items.filter((m) => {
      return m.metadata.file !== file;
    });
    console.log(filteredItems.length);
    bodyJSON.items = filteredItems;

    params.Body = JSON.stringify(bodyJSON);

    await s3Client.send(new PutObjectCommand(params));
  } catch (e) {
    console.log("ERROR ", JSON.stringify(e, true, 1));
    return `Something went wrong....`;
  }

  return `Successfully processed index update`;
}

export const deleteDocFile = async (id) => {
  const params = {
    TableName: "core-service-docfiles",
    Key: {
      id: id,
    },
  };

  console.log(params);
  console.log(await deleteIndexContent(id));

  const command = new DeleteCommand(params);
  //return Promise.resolve(true);
  return ddbDocClient.send(command);
};

export const updateDocFile = (id, meta) => {
  const params = {
    TableName: "core-service-docfiles",
    Key: {
      id: id,
    },
    UpdateExpression: "set  metadata = :metadata",
    ExpressionAttributeValues: { ":metadata": meta },
  };

  params.UpdateExpression += `, modifiedAt = :modifiedAt`;
  params.ExpressionAttributeValues[":modifiedAt"] = new Date().toISOString();

  console.log(params);

  const command = new UpdateCommand(params);
  //return Promise.resolve(true);
  return ddbDocClient.send(command);
};

export const useListDocFiles = (prefix) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docPrefix, setDocPrefix] = useState(prefix);
  const effectCalled = useRef(false);

  const getFiles = () => {
    if (docPrefix !== "") {
      //!effectCalled.current || s3KeyPrefix !== process.env.NEXT_PUBLIC_USER_ID
      effectCalled.current = true;
      setIsLoading(true);
      setError(null);
      const params = {
        TableName: "core-service-docfiles",
        FilterExpression: "begins_with (id,:id)",
        ExpressionAttributeValues: {
          ":id": docPrefix,
        },
      };

      console.log("DB PARAMS ", params);
      const command = new ScanCommand(params);

      ddbDocClient.send(command).then(
        (res) => {
          console.log("DB RESPONSE ", res);
          const objInfo = [];
          res.Items.forEach((obj) => {
            objInfo.push({
              id: obj.id.split("#").pop(),
              createdAt: obj.createdAt,
              metadata: obj.metadata,
              source: obj.docSource,
              key: obj.id,
            });
          });

          setDocs(objInfo);
          setIsLoading(false);
          // });
        },
        (err) => {
          console.error(err);
          setError(err);
        }
      );
    }
  };

  useEffect(() => {
    getFiles();
  }, [docPrefix]);

  return { error, isLoading, docs, setDocPrefix, getFiles };
};

export const updateUploadPayload = (id, meta) => {
  const params = {
    TableName: "core-service-upload-payload",
    Key: {
      id: id,
    },
    UpdateExpression: "set  metadata = :metadata",
    ExpressionAttributeValues: { ":metadata": meta },
  };

  const expires = Math.ceil((Date.now() + 1 * 60 * 60 * 1000) / 1000);

  params.UpdateExpression += `, modifiedAt = :modifiedAt,expire = :expires`;
  params.ExpressionAttributeValues[":modifiedAt"] = new Date().toISOString();
  params.ExpressionAttributeValues[":expires"] = expires;
  console.log(params);

  const command = new UpdateCommand(params);
  //return Promise.resolve(true);
  return ddbDocClient.send(command);
};
