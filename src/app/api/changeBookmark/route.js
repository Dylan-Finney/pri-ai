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
      const { threadID, time, add } = await req.json();

      const messageID = `${threadID}-${time}`;

      var paramsGet = {
        TableName: "PriAIBookmarks4",
        Key: {
          userID: {
            S: user.userId,
          },
          threadID: {
            S: threadID,
          },
        },
      };

      var paramsUpdate = {
        TableName: "PriAIBookmarks4",
        Key: {
          userID: {
            S: user.userId,
          },
          threadID: {
            S: threadID,
          },
        },
        UpdateExpression: "ADD messageTimes :time",
        ExpressionAttributeValues: {
          ":time": { NS: [time.toString()] },
        },
        ReturnValues: "UPDATED_NEW",
        ConditionExpression:
          "attribute_exists(userID) AND attribute_exists(threadID)",
      };

      var baseObject = {
        PriAIBookmarks3: [
          {
            PutRequest: {
              Item: {
                userID: {
                  S: user.userId,
                },
                messageID: {
                  S: messageID,
                },
              },
            },
          },
        ],
      };

      try {
        const deleteBookmarkPromises = [];
        if (add === false)
          paramsUpdate.UpdateExpression = "DELETE messageTimes :time";

        deleteBookmarkPromises[0] = new Promise((resolve, reject) => {
          ddb.updateItem(paramsUpdate, (err, data) => {
            if (err) {
              if (err.code === "ConditionalCheckFailedException") {
                // If item doesn't exist, create it using putItem
                const paramsPut = {
                  TableName: "PriAIBookmarks4",
                  Item: {
                    userID: { S: user.userId },
                    threadID: { S: threadID },

                    messageTimes: { NS: [time.toString()] },
                  },
                };

                ddb.putItem(paramsPut, (putErr, putData) => {
                  if (putErr) {
                    console.error(
                      "Unable to put item. Error:",
                      JSON.stringify(putErr, null, 2)
                    );
                  } else {
                    console.log("Put item succeeded.");
                    console.log("Inserted Item:", paramsPut.Item);
                  }
                  resolve(200);
                });
              } else {
                console.error(
                  "Unable to update item. Error:",
                  JSON.stringify(err, null, 2)
                );
                resolve(200);
              }
            } else {
              if (!data.Attributes) {
                ddb.deleteItem(
                  {
                    TableName: "PriAIBookmarks4",
                    Key: {
                      userID: {
                        S: user.userId,
                      },
                      threadID: {
                        S: threadID,
                      },
                    },
                  },
                  (deleteErr, deleteData) => {
                    if (deleteErr) {
                      console.error(
                        "Unable to delete item. Error:",
                        JSON.stringify(deleteErr, null, 2)
                      );
                    } else {
                      console.log("Delete item succeeded.");
                      console.log("Deleted Item:", deleteData.Item);
                    }
                    resolve(200);
                  }
                );
              } else {
                console.log(
                  `Update item to ${add ? "add" : "remove"} succeeded. `
                );
                console.log(
                  "Updated Number Set Attribute:",
                  paramsUpdate.ExpressionAttributeValues[":time"].NS
                );
                resolve(200);
              }
            }
          });
        });

        deleteBookmarkPromises[1] = new Promise((resolve, reject) => {
          ddb.updateItem(
            {
              ExpressionAttributeNames: {
                "#Y": "bookmark",
              },
              ExpressionAttributeValues: {
                ":y": {
                  BOOL: add,
                },
              },
              Key: {
                threadID: {
                  S: threadID,
                },
                time: {
                  N: time.toString(),
                },
              },
              ReturnValues: "ALL_NEW",
              TableName: "PriAIMessages3",
              UpdateExpression: "SET #Y = :y",
            },
            function (err, data) {
              if (err) {
                // console.log("Error insert config", err);
              } else {
                // console.log("Success insert config", data);
              }
              resolve(200);
            }
          );
        });
        const [statusDeleteBookmark, statusUpdateMessage] = await Promise.all(
          deleteBookmarkPromises
        );

        const success =
          statusDeleteBookmark === 200 && statusUpdateMessage === 200;

        return NextResponse.json(
          {
            statusText: success
              ? "Change Bookmark Success"
              : "Change Bookmark Fail",
          },
          { status: success ? 200 : 400 }
        );
      } catch (e) {
        console.error(e);
        return NextResponse.json(
          {
            statusText: "Change Bookmark Fail",
          },
          { status: 400 }
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
