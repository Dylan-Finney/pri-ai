import { agentsProd2 } from "@/utils/agents";
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
var s3 = new AWS.S3({ apiVersion: "2012-08-10" });

const getAgentDetailsParams = (userID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: userID },
    },
    KeyConditionExpression: "userID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.AWS_AGENTS_TABLE_NAME,
  };
};
export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      //   const { threadID } = await req.json();
      var agentDetails = [];

      await new Promise((resolve, reject) => {
        ddb.query(
          getAgentDetailsParams(user.userId),
          async function (err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.Items);

              for (const element of data.Items) {
                console.log(element);
                agentDetails.push({
                  id: parseInt(element.agentID.S),
                  name: element.name.S,
                  image: "",
                });
              }
              resolve(200);
            }
          }
        );
      });

      async function fetchAgentImages() {
        for (const agent of agentsProd2) {
          try {
            var params = {
              Bucket: process.env.AWS_IMAGES_BUCKET,
              Key: `${user.userId}/${agent.id}`,
              Expires: 86400,
            };
            const url = await s3.getSignedUrlPromise("getObject", params);

            const index = agentDetails.findIndex((obj) => obj.id === agent.id);
            if (index > -1) {
              agentDetails[index] = {
                ...agentDetails[index],
                image: url,
              };
            } else {
              agentDetails.push({
                id: agent.id,
                image: url,
              });
            }
            console.log(url);
          } catch (err) {
            console.error(err);
            // Handle errors as needed
          }
        }
      }

      await fetchAgentImages();

      return NextResponse.json(
        {
          statusText: "Get Agent Details Success",
          agentDetails,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ statusText: "Auth Fail" }, { status: 400 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { statusText: "Auth Fail or Error" },
      { status: 400 }
    );
  }
}
