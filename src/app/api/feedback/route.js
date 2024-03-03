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
      const { threadID, time, remove, helpful, details } = await req.json();

      //   const messageID = `${threadID}-${time}`;

      //   var baseObject = {
      //     PriAIBookmarks3: [
      //       {
      //         PutRequest: {
      //           Item: {
      //             userID: {
      //               S: user.userId,
      //             },
      //             messageID: {
      //               S: messageID,
      //             },
      //           },
      //         },
      //       },
      //     ],
      //   };

      if (remove === true) {
        try {
          const statusRemoveFeedback = await new Promise((resolve, reject) => {
            ddb.updateItem(
              {
                ExpressionAttributeNames: {
                  "#Y": "feedback",
                },
                ExpressionAttributeValues: {
                  ":y": {
                    M: {},
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
                  console.log("Error insert feedback", err);
                } else {
                  console.log("Success insert feedback", data);
                }
                resolve(200);
              }
            );
          });

          const success = statusRemoveFeedback === 200;

          return NextResponse.json(
            {
              statusText: success
                ? "Remove Feedback Success"
                : "Remove Feedback Fail",
            },
            { status: success ? 200 : 400 }
          );
        } catch (e) {
          console.error(e);
          return NextResponse.json(
            {
              statusText: "Remove Feedback Fail",
            },
            { status: 400 }
          );
        }
      } else {
        try {
          const statusPutFeedback = await new Promise((resolve, reject) => {
            ddb.updateItem(
              {
                ExpressionAttributeNames: {
                  "#Y": "feedback",
                },
                ExpressionAttributeValues: {
                  ":y": {
                    M: {
                      // M indicates a map
                      helpful: { BOOL: helpful }, // Set helpful to true
                      details: { S: details }, // Set details to 'test'
                    },
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
                  console.log("Error insert feedback", err);
                } else {
                  console.log("Success insert feedback", data);
                }
                resolve(200);
              }
            );
          });

          const success = statusPutFeedback === 200;

          return NextResponse.json(
            {
              statusText: success
                ? "Add Feedback Success"
                : "Add Feedback Fail",
            },
            { status: success ? 200 : 400 }
          );
        } catch (e) {
          console.error(e);
          return NextResponse.json(
            {
              statusText: "Add Feedback Fail",
            },
            { status: 400 }
          );
        }
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
