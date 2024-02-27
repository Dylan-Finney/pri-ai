import { getCurrentUser } from "aws-amplify/auth";
window.Buffer = window.Buffer || require("buffer").Buffer;
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var s3 = new AWS.S3({ apiVersion: "2012-08-10" });

const getMessagesParams = (userID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: userID },
    },
    KeyConditionExpression: "userID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.REACT_APP_AWS_AGENTS_TABLE_NAME,
  };
};
export async function changeAgentDetails({
  agentID,
  imageEncoded,
  type,
  contentType,
  name,
}) {
  try {
    const user = await getCurrentUser();
    if (user.userId) {
      if (agentID && (imageEncoded || name)) {
        if (imageEncoded === undefined) {
          const statusPutName = await new Promise(async (resolve, reject) => {
            try {
              var params = {
                TableName: process.env.REACT_APP_AWS_AGENTS_TABLE_NAME,
                Item: {
                  userID: { S: user.userId },
                  agentID: { S: agentID.toString() },

                  name: { S: name },
                },
              };
              ddb.putItem(params, function (err, data) {
                if (err) {
                  console.log("Error", err);
                  resolve(2001);
                } else {
                  console.log("Success", data);
                  resolve(200);
                }
              });
            } catch (e) {
              resolve(2001);
            }
          });

          const success = statusPutName === 200;
          return success;
        } else {
          const base64Data = imageEncoded.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const binaryData = Buffer.from(base64Data, "base64");
          console.log({ agentID, binaryData, type, contentType });
          var signedUrl = "";

          const statusPutImage = await new Promise(async (resolve, reject) => {
            try {
              s3.putObject(
                {
                  Bucket: process.env.REACT_APP_AWS_IMAGES_BUCKET,
                  Key: `${user.userId}/${agentID}`,
                  Body: binaryData,
                  //   ContentEncoding: "base64",
                  ContentType: contentType,
                },
                (err, data) => {
                  console.log(err, data);
                  if (err) {
                    console.error(err);
                    resolve(2001);
                  } else {
                    signedUrl = s3.getSignedUrl("getObject", {
                      Bucket: process.env.REACT_APP_AWS_IMAGES_BUCKET,
                      Key: `${user.userId}/${agentID}`,
                      Expires: 3600, // Link expires in 1 hour
                    });
                    resolve(200);
                  }
                }
              );
            } catch (e) {
              resolve(2001);
            }
          });

          const success = statusPutImage === 200;

          return signedUrl;
        }
      }
      // const command = new PutObjectCommand(params);
    } else {
      console.error("Not Authenticated");
    }
  } catch (e) {
    console.error("Change Agent Details Error", e);
  }
}
