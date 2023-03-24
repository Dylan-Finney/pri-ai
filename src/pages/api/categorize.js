const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function handler(req, res) {
  console.log(req.body)
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }
  if (req.body.prompt){
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      messages:[
        {"role": "system", "content": `"You will not show translations to any Non-English prompts in your responses. Can you categorize the prompts into one of the following categories. Ask yourself are you sure before providing the response. If you don't know the category it should go into, respond with "Unknown", no extra text:
        No data query needed E.x. "Can you play some music?"
        Single private data query needed E.x. "What was my average grade in my math class last semester?", "What am I do?ing this weekend?", "How do I feel today?"
        Single public data query needed E.x. "What is the population of New York City?"
        Multiple private data queries and/or analyzes required E.x. "Can you provide me with a breakdown of the total hours I worked last month, including overtime hours, and the different projects I was working on each day?"
        Multiple public data queries and/or analyzes required E.x. "What are the top 10 trending hashtags on Twitter related to the upcoming election, and what are the sentiment scores associated with each hashtag?"
        Multiple private and public queries and/or analyzes required E.x. "Can you provide a report on the current real estate market in my city, including average home prices, median household incomes, and crime rates in different neighborhoods?"
        Single action requested (ie do action via api) E.x. "Can you post a tweet on my Twitter account with the message 'Hello world!' and the hashtag #greetings?", "Block all that free time with the comment "email time""
        Multiple actions needed (Chained/piping). E.x. "Can you retrieve the names and email addresses of all the employees in my company's IT department, and then send them an email with a survey link asking for their feedback on our latest software release?"`},
        {"role": "user", "content": `"${req.body.prompt}"`},
      ]
      
    })
    res.status(200).json({"response": {"text": response.data.choices[0].message.content}})
  } else {
    res.status(400).json({ error: `Needs prompt` })
    
  }
  
}
