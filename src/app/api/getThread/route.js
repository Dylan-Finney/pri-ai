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

const getMessagesParams = (threadID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: threadID },
    },
    KeyConditionExpression: "threadID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.AWS_MESSAGES_TABLE_NAME,
  };
};
export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      const { threadID } = await req.json();
      var allMessages = [];
      const statusGetMessages = await new Promise((resolve, reject) => {
        ddb.query(getMessagesParams(threadID), function (err, data) {
          if (err) {
            // console.log("Error", err);
          } else {
            // console.log("Success", data.Items);

            data.Items.forEach(function (element, index, array) {
              // console.log({ element });
              allMessages.push({
                message: element.message.S,
                time: parseInt(element.time.N),
                speaker: element.speaker.S,
              });
            });

            allMessages = allMessages.sort((a, b) => a.time - b.time);
            // console.log({ allMessages });
            resolve(200);
            // setConversationID(newID);
            // setChatlog(allMessages);
            // setFetchingConversation(false);
          }
        });
      });

      const success = statusGetMessages === 200;

      return NextResponse.json(
        {
          statusText: success ? "Get Thread Success" : "Get Thread Fail",
          allMessages,
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
