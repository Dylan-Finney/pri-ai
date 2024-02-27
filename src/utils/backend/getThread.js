import { getCurrentUser } from "aws-amplify/auth";
var AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const getMessagesParams = (threadID) => {
  return {
    ExpressionAttributeValues: {
      ":s": { S: threadID },
    },
    KeyConditionExpression: "threadID = :s",
    // ProjectionExpression: "Episode, Title, Subtitle",
    TableName: process.env.REACT_APP_AWS_MESSAGES_TABLE_NAME,
  };
};
export async function getThread(threadID) {
  try {
    const user = await getCurrentUser();
    if (user.userId) {
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

      return allMessages;
    } else {
      console.error("Auth Fail");
    }
  } catch (e) {
    console.error(e);
  }
}
