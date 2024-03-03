import { NextResponse } from "next/server";
import { GPTTokens } from "gpt-tokens";
import NextCors from "nextjs-cors";

export async function POST(req) {
  // await NextCors(req, NextResponse, {
  //   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  //   origin: "*",
  //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // });
  const body = await req.json();
  const {
    userId,
    requestId,
    followUp,
    aggregate,
    entryType,
    langCode,
    session,
    statement,
    llm,
    answer,
    score,
    tokens,
    currentIndex,
    finish_reason = null,
  } = body;

  console.log("LOG UPDATE START ", new Date().toISOString());
  const logEvent = {
    [requestId]: {
      SESSION_ID: session,
      APP_ID: process.env.APP_ID,
      INDEX_ID: currentIndex,
      USER_ID: userId || "XXXXXXXX",
    },
  };

  console.log(`###_SESSION_ID= ${session}`);
  console.log(`###_INDEX_ID= ${currentIndex}`);
  console.log(`###_REQUEST_ID= ${requestId}`);
  let usageInfo = undefined;
  if (typeof answer === "undefined") {
    /* 
        usageInfo = new GPTTokens({
          model: llm,
          messages: tokenMessages.map(m => ({ "role": m.role, "content": m.content }))
        });
    
     */
    console.log(`###_INIT_STATEMENT= ${statement}`);

    console.log(`###_ENTRY_TYPE= ${entryType}`);
    console.log(`###_ENTRY_LANG= ${langCode}`);
    logEvent[requestId]["ENTRY_TYPE"] = entryType;
    logEvent[requestId]["ENTRY_LANG"] = langCode;
    // logEvent[requestId]["INIT_TOKENS"] = usageInfo.usedTokens;
    logEvent[requestId]["INIT_STATEMENT"] = statement;

    if (followUp) {
      console.log(`###_FOLLOWUP= OK`);
      logEvent[requestId]["FOLLOWUP"] = true;
    }
    if (aggregate) {
      console.log(`###_AGGREGATE= OK`);
      logEvent[requestId]["AGGREGATION"] = true;
    }
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
    console.log(`###_END_STATEMENT= ${statement}`);
    console.log(`###_ANSWER= ${answer}`);
    console.log(`###_TOTAL_TOKENS= ${tokens + usageInfo.usedTokens}`);

    logEvent[requestId]["ANSWER_TOKENS"] = usageInfo.usedTokens;
    logEvent[requestId]["SCORE"] = score;
    logEvent[requestId]["END_STATEMENT"] = statement;
    logEvent[requestId]["ANSWER"] = answer;
    logEvent[requestId]["TOTAL_TOKENS"] = tokens + usageInfo.usedTokens;
  }
  if (finish_reason) {
    console.log(`###_FINISH_REASON= ${finish_reason}`);
    logEvent[requestId]["FINISH_REASON"] = finish_reason;
    /*   if (finish_reason === 'length') {
        console.log(`###_FINISH= -1`);
      }
      if (finish_reason === 'function') {
        console.log(`###_FINISH= 2`);
      }
      if (finish_reason === 'stop') {
        console.log(`###_FINISH= 1`)
      } */
  }
  console.log("###_LOG_EVENT= ", JSON.stringify(logEvent));
  console.log("LOG UPDATE END ", new Date().toISOString());
  console.log('"###_TOKENS= ', usageInfo);
  return NextResponse.json(
    { tokens: usageInfo?.usedTokens || 0 },
    { status: 200 }
  );
}
