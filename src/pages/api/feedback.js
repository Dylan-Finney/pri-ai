
import axios from "axios"
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});
export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }
    if (req.body.id !== null && (req.body.helpful === true || req.body.helpful === false) && req.body.details){
        try {
            const input = {
                "ExpressionAttributeNames": {
                  "#H": "helpful",
                  "#HD": "helpfulDetails"
                },
                "ExpressionAttributeValues": {
                  ":h": {
                    "BOOL": req.body.helpful
                  },
                  ":d": {
                    "S": req.body.details
                  }
                },
                "Key": {
                  "userID": {
                    "S": req.body.userID
                  },
                  "exchangeID": {
                    "N": req.body.id.toString()
                  }
                },
                "TableName": process.env.CONVOS_TABLE_NAME,
                "UpdateExpression": "SET #H = :h, #HD = :d"
              };
              console.log(input)
            const command = new UpdateItemCommand(input);
            await client.send(command);
            // console.log("feedback", response.data.data)
            return res.status(200).send({ message: 'Feedback stored' })
        } catch(e){
            console.log("feedback", e)
            return res.status(400).send({ error: 'Feedback could not be stored' })
        }
    } else {
        return res.status(400).send({ error: 'Feedback could not be stored 1' })
    }
    
    
    }
