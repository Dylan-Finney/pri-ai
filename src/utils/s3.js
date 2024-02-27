import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateUniqueId, encode } from ".";
// import { encode, generateUniqueId } from "@/utils";
//import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import

//import dotenv from "dotenv";

//dotenv.config()
//import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate"; // ES Modules import

//process.env.REACT_APP_AWS_ACCESS_KEY_ID = process.env.REACT_APP_MY_ACCESS_KEY;
//process.env.REACT_APP_AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_MY_SECRET_KEY;
/* 
  const accessKeyId: string | undefined = process.env[ENV_KEY];
  const secretAccessKey: string | undefined = process.env[ENV_SECRET];
  const sessionToken: string | undefined = process.env[ENV_SESSION];
  const expiry: string | undefined = process.env[ENV_EXPIRATION];
 */
const config = {
  credentials: {
    accessKeyId: process.env.REACT_APP_MY_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_MY_SECRET_KEY,
  },
  region: process.env.REACT_APP_MY_REGION,
};

console.log(config);
const s3Client = new S3Client(config);
//console.log("S3 config ", config);

const uploadFile = async (files, id, source) => {
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(files ? (files.length > 0) : null);
  /* 
    const params = {
      Bucket: process.env.REACT_APP_AI_BUCKET,
      Key: `${file.name}`,
      Body: file,
      Metadata: {
        id,
        source,
      },
    };
    console.log("S3 PARAMS ", params); */
  const params = {
    Bucket: process.env.REACT_APP_AI_BUCKET,
  };
  console.log("S3 PARAMS ", params);
  // console.log("S3  ", s3Client);
  console.log("FILES ", files);
  //const input = undefined;
  //const command = new ListBucketsCommand(input);
  //const response = await s3Client.send(new ListObjectsV2Command(params));
  //console.log("S3 RESPONSE ", response);
  /*
  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `File uploaded successfully: ${params.Key}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
  */

  //return { isLoading, };
};

//export default uploadFile;

export const DeleteS3Object = (key) => {
  const params = { Bucket: process.env.REACT_APP_AI_BUCKET, Key: key };
  console.log("S3 PARAMS ", params);
  return s3Client.send(new DeleteObjectCommand(params));
};

export const useUploadSummaryFile = () => {
  // create state variables
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [summaryFiles, setSummaryFiles] = useState([]);
  const metaData = useRef({});

  const addSummary = useCallback((obj) => {
    console.log("summary added ", obj);
    metaData.current = { id: obj.id, content: obj.content };
    setSummaryFiles([{ ...obj }]);
  }, []);

  useEffect(() => {
    if (!summaryFiles || summaryFiles.length === 0) return;
    console.log("EFFECT ", summaryFiles, metaData.current);
    setIsLoading(true);
    setError(null);
    const uploaded = summaryFiles.map((f) => {
      let params = {
        Bucket: process.env.REACT_APP_AI_BUCKET,
        Metadata: {
          id: metaData.current.id,
        },
      };
      params.Key = `${f.id}/summary.txt`;
      params.Body = f.content;

      const command = new PutObjectCommand(params);
      return s3Client.send(command);
    });

    Promise.all(uploaded).then(
      (res) => {
        console.log("S3 RESPONSE ", res);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
      }
    );
  }, [summaryFiles]);

  return { error, isLoading, addSummary };
};

export const useListS3Files = (prefix) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [s3Files, setS3Files] = useState([]);
  const [s3KeyPrefix, setS3KeyPrefix] = useState(prefix);
  const effectCalled = useRef(false);

  useEffect(() => {
    //console.log("USELIST ", s3KeyPrefix);
    if (s3KeyPrefix !== "") {
      //!effectCalled.current || s3KeyPrefix !== process.env.REACT_APP_USER_ID
      effectCalled.current = true;
      setIsLoading(true);
      setError(null);
      const params = {
        Bucket: process.env.REACT_APP_AI_BUCKET,
        Prefix: `${s3KeyPrefix}/doc-data`,
      };

      console.log("S3 PARAMS ", params);

      const command = new ListObjectsV2Command(params);
      s3Client.send(command).then(
        (res) => {
          console.log("S3 RESPONSE ", res);
          let objInfo = [];
          const objs = res.Contents.map((obj) => {
            objInfo.push({ Key: obj.Key });
            return s3Client.send(
              new HeadObjectCommand({
                Bucket: process.env.REACT_APP_AI_BUCKET,
                Key: obj.Key,
              })
            );
          });
          Promise.all(objs).then((res) => {
            res.forEach((obj, i) => {
              objInfo[i].LastModified = obj.LastModified;
              objInfo[i].Size = obj.ContentLength;
              objInfo[i].Metadata = obj.Metadata;
            });
            setS3Files(objInfo);
            setIsLoading(false);
          });
        },
        (err) => {
          console.error(err);
          setError(err);
        }
      );
    }
  }, [s3KeyPrefix]);

  return { error, isLoading, s3Files, setS3KeyPrefix };
};

const useUploadFile = (files) => {
  // create state variables
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [uploadFiles, setUploadFiles] = useState(files);
  const metaData = useRef({});

  const addFiles = useCallback((obj) => {
    console.log("files added ", obj);
    metaData.current = {
      id: obj.id,
      uuid: obj.uuid || generateUniqueId(),
      source: obj.source,
      content: obj.content,
      language: obj.language,
      targetLanguage: obj.targetLanguage,
      metaTags: obj.metaTags,
      plans: obj.plans,
    };
    if (obj?.files === undefined) {
      setUploadFiles([{ ...obj }]);
    } else {
      setUploadFiles(obj.files);
    }
  }, []);

  useEffect(() => {
    if (!uploadFiles || uploadFiles.length === 0) return;
    console.log("EFFECT ", uploadFiles, metaData.current);
    setIsLoading(true);
    setError(null);
    const uploaded = uploadFiles.map((f) => {
      let params = {
        Bucket: process.env.REACT_APP_AI_BUCKET,
        ContentType: f?.type || "text/plain",
        Metadata: {
          id: metaData.current.id,
          source: encode(metaData.current.source),
          uuid: metaData.current.uuid,
          language: metaData.current.language,
        },
      };
      if (
        metaData.current?.targetLanguage !== undefined &&
        metaData.current.targetLanguage.length > 0
      ) {
        params.Metadata.targetlanguage =
          metaData.current.targetLanguage.join(",");
      }
      if (
        metaData.current?.metaTags !== undefined &&
        metaData.current.metaTags.length > 0
      ) {
        params.Metadata.metatags = metaData.current.metaTags.join(",");
      }
      if (
        metaData.current?.plans !== undefined &&
        metaData.current.plans.length > 0
      ) {
        params.Metadata.plans = metaData.current.plans.join(",");
      }

      console.log({ f });
      if (f?.name === undefined) {
        params.Key = `uploads/${generateUniqueId()}.txt`;
        params.Body = f.content;
      } else {
        params.Key = `uploads/${f.name}`;
        params.Body = f.file;
      }
      console.log("S3 PARAMS ", params);
      //return Promise.resolve(true);
      const command = new PutObjectCommand(params);
      return s3Client.send(command);
    });

    Promise.all(uploaded).then(
      (res) => {
        console.log("S3 RESPONSE ", res);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
      }
    );
    /* 
    if (uploadFiles && uploadFiles.length > 0) {
      const params = {
        Bucket: process.env.REACT_APP_AI_BUCKET,
        Key: `${generateUniqueId()}.txt`,
        Body: uploadFiles[0].content,
        Metadata: {
          id,
          source,
        },
      };
      console.log("S3 PARAMS ", params);
      const command = new PutObjectCommand(params);
      s3Client.send(command).then(res => {
        console.log("S3 RESPONSE ", res);
        setIsLoading(false);
      })
      
    } */

    /*
        fetch(url)
          .then(response => response.json())
          .then(data => {
            //console.log("FETCH ", data);
            setIsLoading(false);
            setData(data);
          })
          .catch(error => {
            setIsLoading(false);
            setError(error);
          });
          */
  }, [uploadFiles]);

  return { error, isLoading, addFiles };
};

export default useUploadFile;
