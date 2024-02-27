import { getCurrentUser } from "aws-amplify/auth";

var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
export async function saveMessage({
  threadID,
  prompt,
  response,
  userID,
  title,
  isNew,
  speaker = "assistant",
}) {
  try {
    const user = await getCurrentUser();
    if (user.userId) {
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
                  speakers: {
                    SS: [speaker],
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
              TableName: process.env.REACT_APP_AWS_THREADS_TABLE_NAME,
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

      return success;
    } else {
      console.error("Auth Fail");
    }
  } catch (e) {
    console.error("Auth Fail or Error");
  }
}
