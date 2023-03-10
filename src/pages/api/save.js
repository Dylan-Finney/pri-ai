
import axios from "axios"
export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
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
                    mutation MyMutation($prompt: String = "") {
                        createRegisteredUser(data: {exchanges: {create: {prompt: $prompt}}}) {
                          id
                          exchanges(last: 1) {
                            id
                          }
                        }
                      }
                `,
                variables: {
                    "prompt": req.body.prompt
                }
                },
            })
            console.log("newUser", response.data.data)
            return res.status(200).send({ message: 'User created with new prompt', userID: response.data.data.createRegisteredUser.id, exchangeID: response.data.data.createRegisteredUser.exchanges[0].id })
        } catch(e){
            console.log("newUser", e)
            return res.status(400).send({ message: 'Prompt could not be stored and user created' })
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
                    mutation MyMutation($id: ID = "", $prompt: String = "") {
                        updateRegisteredUser(
                          data: {exchanges: {create: {prompt: $prompt}}}
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
                    "id": req.body.userID
                }
                },
            })
            console.log("newPrompt", response.data.data)
            return res.status(200).send({ message: 'New prompt stored', exchangeID: response.data.data.updateRegisteredUser.exchanges[0].id })
        } catch(e){
            console.log("newPrompt", e)
            return res.status(400).send({ message: 'Prompt could not be stored' })
        }
    }
    
    
    }
