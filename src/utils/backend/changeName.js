import { getCurrentUser } from "aws-amplify/auth";
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
export async function changeName(newName) {
  try {
    const user = await getCurrentUser();
    if (user.userId) {
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
            TableName: process.env.REACT_APP_AWS_CONFIG_TABLE_NAME,
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

      return success;
    } else {
      console.error("Not Authenticated");
    }
  } catch (e) {
    console.error("Change Agent Name Error", e);
  }
}
