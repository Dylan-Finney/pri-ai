import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      const { threadID, prompt, response, userID, title, isNew } =
        await req.json();
      var baseObject = {
        PriAIMessages3: [
          {
            PutRequest: {
              Item: {
                threadID: {
                  S: threadID,
                },
                time: {
                  N: prompt.time,
                },
                message: {
                  S: prompt.message,
                },
                speaker: {
                  S: "User",
                },
              },
            },
          },
          {
            PutRequest: {
              Item: {
                threadID: {
                  S: threadID,
                },
                time: {
                  N: response.time,
                },
                message: {
                  S: response.message,
                },
                speaker: {
                  S: "PriAI",
                },
              },
            },
          },
        ],
      };
      if (isNew && isNew === true) {
        baseObject = {
          ...baseObject,
          PriAIThreads3: [
            {
              PutRequest: {
                Item: {
                  threadID: {
                    S: threadID,
                  },
                  userID: {
                    S: userID,
                  },
                  time: {
                    N: response.time,
                  },
                  title: {
                    S: title,
                  },
                },
              },
            },
          ],
        };
      }

      const fetchPromises = [];
      fetchPromises[0] = new Promise((resolve, reject) => {
        ddb.batchWriteItem(
          {
            RequestItems: {
              ...baseObject,
            },
          },
          function (err, data) {
            if (err) {
              console.error(err);
              resolve(400);
            }
            // an error occurred
            else {
              // console.log(data);
              resolve(200);
            }
            /*
   data = {
   }
   */
          }
        );
      });
      fetchPromises[1] = new Promise((resolve, reject) => {
        if (isNew && isNew === true) {
          ddb.updateItem(
            {
              ExpressionAttributeNames: {
                "#Y": "time",
              },
              ExpressionAttributeValues: {
                ":y": {
                  N: response.time,
                },
              },
              Key: {
                userID: {
                  S: userID,
                },
                threadID: {
                  S: threadID,
                },
              },
              ReturnValues: "ALL_NEW",
              TableName: process.env.AWS_THREADS_TABLE_NAME,
              UpdateExpression: "SET #Y = :y",
            },
            function (err, data) {
              if (err) {
                console.error(err);
                resolve(400);
              }
              // an error occurred
              else {
                // console.log(data);
                resolve(200);
              }
            }
          );
        } else {
          resolve(200);
        }
      });
      const [statusPut, statusUpdate] = await Promise.all(fetchPromises);

      const success = statusPut === 200 && statusUpdate === 200;

      return NextResponse.json(
        {
          statusText: success ? "Save Success" : "Save Fail",
        },
        { status: success ? 200 : 400 }
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
