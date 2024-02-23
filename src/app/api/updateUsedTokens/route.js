import { NextResponse } from "next/server";
import { GPTTokens } from "gpt-tokens";

export async function POST(req) {
  const body = await req.json();
  const {
    session,
    statement,
    messages: tokenMessages,
    llm,
    answer,
    score,
    tokens,
    currentIndex,
    finish_reason = null,
  } = body;
  let usageInfo = undefined;
  if (tokenMessages && tokenMessages.length > 0) {
    usageInfo = new GPTTokens({
      model: llm,
      messages: tokenMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    console.log(`###_QUESTION_TOKENS= ${usageInfo.usedTokens}`);
    console.log(`###_SESSION_ID= ${session}`);
    console.log(`###_INIT_QUESTION= ${statement}`);
    console.log(`###_APP_ID= ${currentIndex}`);
    //console.log(`###_APP_ID= ${process.env.NEXT_PUBLIC_USER_ID}`);
  }
  if (answer && answer.length > 0) {
    usageInfo = new GPTTokens({
      model: llm,
      messages: [{ role: "assistant", content: answer }],
    });
    // console.log(`###_APP_ID= ${process.env.NEXT_PUBLIC_USER_ID}`);
    // console.log(`###_SESSION_ID= ${session}`);
    console.log(`###_ANSWER_TOKENS=${usageInfo.usedTokens}`);
    console.log(`###_SCORE= ${score}`);
    console.log(`###_END_QUESTION= ${statement}`);
    console.log(`###_ANSWER= ${answer}`);
    console.log(`###_TOTAL_TOKENS= ${tokens + usageInfo.usedTokens}`);
  }
  if (finish_reason) {
    console.log(`###_FINISH= ${finish_reason}`);
  }

  return NextResponse.json(
    { tokens: usageInfo?.usedTokens || 0 },
    { status: 200 }
  );
}
