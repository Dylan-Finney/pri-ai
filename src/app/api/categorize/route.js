// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

import { NextResponse } from "next/server";

// const openai = new OpenAIApi(configuration);
export async function POST(req) {
  if (req.body.prompt) {
    return NextResponse.json({ text: "test" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "test" }, { status: 200 });
  }
}
