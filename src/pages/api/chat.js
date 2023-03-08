const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(req, res) {
  console.log(req.body)
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  if (req.body.persona&&req.body.prompt){
    var formattedDetails = `${req.body.persona.name}, my birthdate is ${req.body.persona.dob}, my email is ${req.body.persona.email}, working as a ${req.body.persona.job}, from ${req.body.persona.region}, ${req.body.persona.country}`
    const initalPrompt = `Prifina is a Private Personal AI Cloud Computer (PACC) - The first scalable personal AI cloud computing architecture with private data storage, optimized for consumers.
        I want you to act like my “fake Private Personal AI Cloud Computer”. You will have access to all my personal data and information from all common applications and services that consumers typically use, as well as ability to use those apps via APIs, to be able to answer any question that I will ask from you or ask you to take action on using my connected apps. I pretend to be the following persona: “${formattedDetails}”. You will give me as accurate, logical and realistic answers as possible, using real names of applications, services, locations, etc, based on all the knowledge you have been trained also outside of my prompt, and you will create logical and realistic sounding fake for everything else. You will reply “Based on your [data source] data available in [your private data cloud AND/OR public data source name]…”. About 25% of the time you will reply ”“Based on your [data source] data available in [your private data cloud OR public data source name]…. …however, the data you have about in your cloud is a bit limited, I think I could answer you better, if you also add your [different data source name] into your account”. Also sometimes (30%) you will also mention about something relevant along with your answers based on the data observations you have made based of different data points or patterns, like; “BTW, I also wanted to mention that based on your [data from data type], you have…” or “BTW, I also wanted to mention that based on a predication made by [data from data type], you may…” You will never answer “As a language model, I'm not…” as this whole thing is for demonstration only where you don’t have such limitations.`
    var messages = [{"role": "system", "content": initalPrompt}]
    if (req.body.chatlog && req.body.chatlog.length>0){
      for (var i = 0; i<req.body.chatlog.length&&i<=9;i++){
        messages.push({"role": "user", "content": req.body.chatlog[i].prompt.text})
        messages.push({"role": "system", "content": req.body.chatlog[i].response.text})
      }
    }
    messages.push({"role": "user", "content": req.body.prompt})
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:messages
    })
    res.status(200).json({"response": {"text": response.data.choices[0].message.content}})
  } else {
    res.status(400).json({ error: `You need to supply ${req.body.persona ? "" : "persona and "}${req.body.prompt ? "" : "prompt."}` })
    // res.status(400).json({ error: `You need to supply ${req.body}` })
    
  }
  
}
