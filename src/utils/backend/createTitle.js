import { OpenAIStreamChat } from "../OpenAIStream";

export const runtime = "edge";

export async function createTitle({ prompt, aiResponse }) {
  if (aiResponse && prompt) {
    const initalPrompt = `Given a conversation between a user and a AI, create a short simple thread title for the conversation at most 7 words. Do not make reference to the AI or the User in the title. E.g., 'Cultural Experiences', 'Trivia Questions Complilation'`;

    const formattedPrompt = `--User--
${prompt}
--AI--
${aiResponse}
----`;

    const payload = {
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: initalPrompt },
        { role: "user", content: formattedPrompt },
      ],
      max_tokens: 256,
      temperature: 0.1,
      stream: true,
      // finish_reason: "stop"
    };

    const response = await OpenAIStreamChat(payload);

    if (response.status > 399) {
      console.error("Error Status");
      return;
    } else {
      return response;
    }
  } else {
    console.error("Parameter Fail");
  }
}
