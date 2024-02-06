import { OpenAIStreamChat } from "@/utils/OpenAIStream";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
// import { OpenAIStreamChat } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

export async function POST(req) {
  const { prompt, aiResponse } = await req.json();

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
      return NextResponse.json({}, { status: 500 });
    } else {
      return new Response(response);
    }
  } else {
    return NextResponse.json({ statusText: "Parameter Fail" }, { status: 400 });
  }
}
