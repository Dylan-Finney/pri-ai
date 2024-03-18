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
      const { bookmarks, threadID } = await req.json();

      var messages = [];
      const config = {
        RequestItems: {
          PriAIMessages3: {
            Keys: bookmarks.map((bookmark) => {
              return {
                threadID: { S: threadID },
                time: { N: bookmark.toString() },
              };
            }),
          },
        },
      };
      console.log(JSON.stringify(config));

      const statusPut = await new Promise((resolve, reject) => {
        ddb.batchGetItem(config, function (err, data) {
          if (err) {
            console.error(err);
            resolve(400);
          }
          // an error occurred
          else {
            // data.map(()=>{
            //   messages.push()
            // })
            console.log(data.Responses.PriAIMessages3);
            data.Responses.PriAIMessages3.map((message) => {
              messages.push({
                message: message.message.S,
                time: parseInt(message.time.N),
                threadID: message.threadID.S,
                speaker:
                  message.speaker.S === "PriAI" ||
                  message.speaker.S === "assistant"
                    ? "mybuddy"
                    : message.speaker.S,
              });
            });
            // console.log(data);
            resolve(200);
          }
          /*
   data = {
   }
   */
        });
      });
      const success = statusPut === 200;
      return NextResponse.json(
        {
          statusText: success
            ? "Get Bookmarked Messages Success"
            : "Get Bookmarked Messages Fail",
          messages,
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
