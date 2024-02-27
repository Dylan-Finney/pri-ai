import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var s3 = new AWS.S3({ apiVersion: "2012-08-10" });

const getMessagesParams = (userID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: userID },
    },
    KeyConditionExpression: "userID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.REACT_APP_AWS_AGENTS_TABLE_NAME,
  };
};
export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      const { agentID, imageEncoded, type, contentType, name } =
        await req.json();

      // const command = new PutObjectCommand(params);
      if (imageEncoded === undefined) {
        const statusPutName = await new Promise(async (resolve, reject) => {
          try {
            var params = {
              TableName: process.env.REACT_APP_AWS_THREADS_TABLE_NAME,
              Item: {
                userID: { S: user.userId },
                agentID: { S: agentID.toString() },

                name: { S: name },
              },
            };
            ddb.putItem(params, function (err, data) {
              if (err) {
                console.log("Error", err);
                resolve(2001);
              } else {
                console.log("Success", data);
                resolve(200);
              }
            });
          } catch (e) {
            resolve(2001);
          }
        });

        const success = statusPutName === 200;
        return NextResponse.json(
          {
            statusText: success
              ? "Change Agent Name Success"
              : "Change Agent Name Fail",
            signedUrl,
          },
          { status: success ? 200 : 400 }
        );
      } else {
        const base64Data = imageEncoded.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Buffer.from(base64Data, "base64");
        console.log({ agentID, binaryData, type, contentType });
        var signedUrl = "";

        const statusPutImage = await new Promise(async (resolve, reject) => {
          try {
            s3.putObject(
              {
                Bucket: process.env.REACT_APP_AWS_IMAGES_BUCKET,
                Key: `${user.userId}/${agentID}`,
                Body: binaryData,
                //   ContentEncoding: "base64",
                ContentType: contentType,
              },
              (err, data) => {
                console.log(err, data);
                if (err) {
                  console.error(e);
                  resolve(2001);
                } else {
                  signedUrl = s3.getSignedUrl("getObject", {
                    Bucket: process.env.REACT_APP_AWS_IMAGES_BUCKET,
                    Key: `${user.userId}/${agentID}`,
                    Expires: 3600, // Link expires in 1 hour
                  });
                  resolve(200);
                }
              }
            );
          } catch (e) {
            resolve(2001);
          }
        });

        const success = statusPutImage === 200;

        return NextResponse.json(
          {
            statusText: success
              ? "Change Agent Image Success"
              : "Change Agent Image Fail",
            signedUrl,
          },
          { status: success ? 200 : 400 }
        );
      }
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
