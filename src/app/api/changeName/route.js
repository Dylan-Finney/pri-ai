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
      const { newName } = await req.json();
      const status = await new Promise((resolve, reject) => {
        ddb.updateItem(
          {
            ExpressionAttributeNames: {
              "#Y": "customPriAIName",
            },
            ExpressionAttributeValues: {
              ":y": {
                S: newName,
              },
            },
            Key: {
              userID: {
                S: user.userId,
              },
            },
            ReturnValues: "ALL_NEW",
            TableName: process.env.AWS_CONFIG_TABLE_NAME,
            UpdateExpression: "SET #Y = :y",
          },
          function (err, data) {
            if (err) {
              // console.log("Error", err);
            } else {
              // console.log("Success", data);
              // data.Items.forEach(function (element, index, array) {
              //   console.log({ element });
              //   threads.push({
              //     id: element.threadID.S,
              //     time: parseInt(element.time.N),
              //     title: element.title.S,
              //   });
              // });
              // setConversations(threads);
            }
            resolve(200);
          }
        );
      });

      const success = status === 200;

      return NextResponse.json(
        {
          statusText: success ? "Change Name Success" : "Change Name Fail",
        },
        { status: success ? 200 : 400 }
      );
    } else {
      return NextResponse.json({ statusText: "Auth Fail" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ statusText: "Auth Fail" }, { status: 400 });
  }
}
