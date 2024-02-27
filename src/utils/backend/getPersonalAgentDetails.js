import { getCurrentUser } from "aws-amplify/auth";
import { agentsProd2 } from "../agents";

var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
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
    TableName: process.env.REACT_APP_AWS_AGENTS_TABLE_NAME,
  };
};
export async function getPersonalAgentDetails() {
  try {
    const user = await getCurrentUser();
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
              Bucket: process.env.REACT_APP_AWS_IMAGES_BUCKET,
              Key: `${user.userId}/${agent.id}`,
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

      return agentDetails;
    } else {
      console.error("Auth Fail");
    }
  } catch (e) {
    console.error(e);
  }
}
