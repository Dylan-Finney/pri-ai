import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import { avatars } from "@/utils/constants";
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

var getThreadsParams = (userID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: userID },
    },
    KeyConditionExpression: "userID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.AWS_THREADS_TABLE_NAME,
  };
};

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

const getPriAIConfigParams = (userID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: userID },
    },
    KeyConditionExpression: "userID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.AWS_CONFIG_TABLE_NAME,
  };
};

export async function POST(req) {
  try {
    const user = await runWithAmplifyServerContext({
      nextServerContext: { cookies },

      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    if (user.userId) {
      var queryPromises = [];
      var threads = [];
      var avatar = "";
      var name = "";

      queryPromises[0] = new Promise((resolve, reject) => {
        ddb.query(getThreadsParams(user.userId), function (err, data) {
          if (err) {
            // console.log("Error", err);
          } else {
            //console.log("Success", data.Items);
            data.Items.forEach(function (element, index, array) {
              // console.log({ element });
              threads.push({
                id: element.threadID.S,
                lastMessage: parseInt(element.time.N),
                title: element.title.S,
              });
            });
            //   setConversations(threads);
          }
          resolve(200);
        });
      });
      queryPromises[1] = new Promise((resolve, reject) => {
        ddb.query(getPriAIConfigParams(user.userId), function (err, data) {
          if (err || data.Items.length === 0) {
            // console.log("Error get config", err);
            const newAvatar =
              avatars[Math.floor(Math.random() * avatars.length)];
            const newName = `${user.username}'s Pri-AI`;
            setSelectedAvatar(newAvatar);
            setAIName(newName);
            avatar = newAvatar;
            name = newName;
            ddb.updateItem(
              {
                ExpressionAttributeNames: {
                  "#Y": "customPriAIName",
                  "#AT": "customPriAIImage",
                },
                ExpressionAttributeValues: {
                  ":y": {
                    S: newName,
                  },
                  ":t": {
                    S: newAvatar,
                  },
                },
                Key: {
                  userID: {
                    S: user.userId,
                  },
                },
                ReturnValues: "ALL_NEW",
                TableName: process.env.AWS_CONFIG_TABLE_NAME,
                UpdateExpression: "SET #Y = :y, #AT = :t",
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
          } else {
            // console.log("Success get config", data);
            avatar = data.Items[0].customPriAIImage.S;
            name =
              data.Items[0].customPriAIName.S || `${user.username}'s Pri-AI`;
            resolve(200);
          }
        });
      });

      const [statusGetThreads, statusGetConfig] = await Promise.all(
        queryPromises
      );

      const success = statusGetThreads === 200 && statusGetConfig === 200;
      // console.log(newAvatar);

      return NextResponse.json(
        {
          statusText: success ? "Initialize Success" : "Initialize Fail",
          name,
          avatar,
          threads,
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
