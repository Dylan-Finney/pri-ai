
import axios from "axios"
export default async function handler(req, res) {
    console.log(req.body)
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Only POST requests allowed' })
        return
    }
    if (req.body.id && (req.body.helpful === true || req.body.helpful === false) && req.body.details){
        try {
            const response = await axios({
                url: process.env.HYGRAPH_URL,
                method:"POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.HYGRAPH_API_KEY}` },
                data: {
                    "operationName":"MyMutation",
                    "query": `
                    mutation MyMutation($id: ID = "", $helpful: Boolean = false, $helpfulDetails: String = "") {
                        updateExchange(
                          data: {helpful: $helpful, helpfulDetails: $helpfulDetails}
                          where: {id: $id}
                        ) {
                          id
                        }
                      }
                      
                            
                `,
                variables: {
                    "id": req.body.id, 
                    "helpful": req.body.helpful, 
                    "helpfulDetails": req.body.details
                }
                },
            })
            console.log("feedback", response.data.data)
            return res.status(200).send({ message: 'Feedback stored' })
        } catch(e){
            console.log("feedback", e)
            return res.status(400).send({ error: 'Feedback could not be stored' })
        }
    } else {
        return res.status(400).send({ error: 'Feedback could not be stored' })
    }
    
    
    }
