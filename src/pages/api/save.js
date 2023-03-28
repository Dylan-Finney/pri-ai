
import axios from "axios"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient();

export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }
    const time = (new Date().getTime()/1000).toString()
    if (req.body.newUser === true){
      const userID = uuidv4()
      
      
      var Item = {
        userID: { S: userID },
        country: { S: req.body.details.country },
        createdAt: { N: time },
        email: { S: req.body.details.email },
        job: { S: req.body.details.job },
        name: { S: req.body.details.name},
        region: { S: req.body.details.region },
  
      };
      if (req.body.chosenApps.length>0) {
        Item["chosenApps"] = {SS: req.body.chosenApps}
      }
      try {
      await client.send(
        new PutItemCommand({
          TableName: process.env.USER_TABLE_NAME,
          Item,
        })
      );
      await client.send(
        new PutItemCommand({
          TableName: process.env.CONVOS_TABLE_NAME,
          Item: {
            userID: { S: userID },
            createdAt: { N: time },
            prompt: { S: req.body.prompt },
            response: { S: req.body.response },
            exchangeID: { N: req.body.questionsUsed.toString() },
            category: { S: req.body.category },

          },
        })
      );
      console.log("newUser", userID)
      return res.status(200).send({ message: 'User created with new prompt', userID: userID})
      } catch(e){
        console.log(e)
        return res.status(400).send({ error: 'Prompt could not be stored and user created' })
      }
    } else {
        try {
            const Item = {
              userID: { S: req.body.userID },
              createdAt: { N: time },
              prompt: { S: req.body.prompt },
              response: { S: req.body.response },
              exchangeID: { N: req.body.questionsUsed.toString() },
              category: { S: req.body.category }
  
            }
            await client.send(
              new PutItemCommand({
                TableName: process.env.CONVOS_TABLE_NAME,
                Item,
              })
            );
            console.log("newPrompt")
            return res.status(200).send({ message: 'New prompt stored'})
        } catch(e){
            console.log("newPrompt", e)
            return res.status(400).send({ error: 'Prompt could not be stored' })
        }
    }
    

    
    }
