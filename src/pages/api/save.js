
import axios from "axios"
export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }
    if (req.body.newUser === true){
        try {
            const response = await axios({
                url: process.env.HYGRAPH_URL,
                method:"POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.HYGRAPH_API_KEY}` },
                data: {
                    "operationName":"MyMutation",
                    "query": `
                    mutation MyMutation($prompt: String = "", $name: String = "", $response: String = "", $country: String = "", $region: String = "", $job: String = "", $email: String = "", $chosenApps: [String!] = "") {
                        createRegisteredUser(
                          data: {exchanges: {create: {prompt: $prompt, response: $response}}, details: {create: {job: $job, name: $name, country: $country, region: $region}}, email: $email, chosenApps: $chosenApps}
                        ) {
                          id
                          exchanges {
                            id
                          }
                        }
                      }                      
                `,
                variables: {
                    "prompt": req.body.prompt,
                    "response": req.body.response,
                    "name": req.body.details.name,
                    "country": req.body.details.country,
                    "region": req.body.details.region,
                    "job": req.body.details.job,
                    "email": req.body.details.email,
                    "chosenApps": req.body.chosenApps

                }
                },
            })
            console.log("newUser", response.data.data)
            return res.status(200).send({ message: 'User created with new prompt', userID: response.data.data.createRegisteredUser.id, exchangeID: response.data.data.createRegisteredUser.exchanges[0].id })
        } catch(e){
            console.log("newUser", e)
            return res.status(400).send({ error: 'Prompt could not be stored and user created' })
        }
    } else {
        try {
            const response = await axios({
                url: process.env.HYGRAPH_URL,
                method:"POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.HYGRAPH_API_KEY}` },
                data: {
                    "operationName":"MyMutation",
                    "query": `
                    mutation MyMutation($id: ID = "", $prompt: String = "", $response: String = "") {
                        updateRegisteredUser(
                          data: {exchanges: {create: {prompt: $prompt, response: $response}}}
                          where: {id: $id}
                        ) {
                          id
                          exchanges(last: 1) {
                            id
                          }
                        }
                      }
                      
                    
                    
                            
                `,
                variables: {
                    "prompt": req.body.prompt,
                    "id": req.body.userID,
                    "response": req.body.response
                }
                },
            })
            console.log("newPrompt", response.data.data)
            return res.status(200).send({ message: 'New prompt stored', exchangeID: response.data.data.updateRegisteredUser.exchanges[0].id })
        } catch(e){
            console.log("newPrompt", e)
            return res.status(400).send({ error: 'Prompt could not be stored' })
        }
    }
    
    
    }
