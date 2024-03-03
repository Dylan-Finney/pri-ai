import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import {
  DynamoDBClient,
  QueryCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";
var AWS = require("aws-sdk");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  //   endpoint: "http://localhost:8001", // for local
});
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const tableName = process.env.AWS_MESSAGES_TABLE_NAME;
const partitionKeyName = "threadID";
const sortKeyName = "time";

async function getSortKeyValues(partitionKeyValue) {
  console.log(
    `${tableName}-dynamodb -- Retrieving sortKeys with partitionKey: ${partitionKeyValue}`
  );
  const params = {
    TableName: tableName,
    ProjectionExpression: "#T",
    KeyConditionExpression: `${partitionKeyName} = :value`,
    ExpressionAttributeNames: {
      "#T": sortKeyName,
    },
    ExpressionAttributeValues: {
      ":value": { S: partitionKeyValue },
    },
  };

  const command = new QueryCommand(params);
  const response = await client.send(command);

  const sortKeyValues = response.Items.map((item) => item[sortKeyName].N);

  return sortKeyValues;
}

async function deleteRecords(partitionKeyValues) {
  let totalDeletedRecords = 0;

  for (let i = 0; i < partitionKeyValues.length; i++) {
    const partitionKeyValue = partitionKeyValues[i];

    const sortKeyValues = await getSortKeyValues(partitionKeyValue);

    for (const sortKeyValue of sortKeyValues) {
      console.log(
        `${tableName}-dynamodb -- Deleting record with partitionKey: ${partitionKeyValue}, sortKey: ${sortKeyValue}`
      );

      const params = {
        TableName: tableName,
        Key: {
          [partitionKeyName]: { S: partitionKeyValue },
          [sortKeyName]: { N: sortKeyValue },
        },
      };

      const command = new DeleteItemCommand(params);
      await client.send(command);

      totalDeletedRecords++;
      console.log(
        `${tableName}-dynamodb -- Deleted record with partitionKey: ${partitionKeyValue}, sortKey: ${sortKeyValue}`
      );
    }
  }

  console.log(
    `${tableName}-dynamodb -- Total deleted records: ${totalDeletedRecords}`
  );
  return totalDeletedRecords;
}

async function executeDynamoDBDeletionWithPartitionList(partitionKeyList) {
  let totalDeletedRecords = 0;
  try {
    totalDeletedRecords = await deleteRecords(partitionKeyList);
  } catch (error) {
    console.log(tableName + "-dynamodb -- An error occurred: " + error);
    // console.error("DELETE ERROR", error);
  }

  return [
    {
      table: tableName,
      deletedRecords: totalDeletedRecords,
    },
  ];
}

export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      const { threadID } = await req.json();

      await executeDynamoDBDeletionWithPartitionList([threadID]);
      const params = {
        TableName: process.env.AWS_THREADS_TABLE_NAME,
        Key: {
          userID: { S: user.userId },
          threadID: { S: threadID },
        },
      };

      const command = new DeleteItemCommand(params);
      await client.send(command);
      return NextResponse.json(
        { statusText: "Delete Thread Success" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ statusText: "Auth Fail" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { statusText: "Auth Fail or Error" },
      { status: 400 }
    );
  }
}
