import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export async function OpenAIStreamChat(payload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let counter = 0;
  // console.log("payload", payload);
  // console.log("prompt", payload.prompt);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          process.env.REACT_APP_STAGE === "dev"
            ? process.env.REACT_APP_OPENAI_API_KEY
            : process.env.REACT_APP_OPENAI_API_KEY
        }`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.status > 399)
      throw { status: res.status, statusText: res.statusText };

    // console.log("res",res )

    // CHATGPT STREAM
    const stream = new ReadableStream({
      async start(controller) {
        // callback
        function onParse(event) {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              // maybe parse error
              controller.error(e);
            }
          }
        }

        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks and invoke an event for each SSE event stream
        const parser = createParser(onParse);
        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res.body) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    //Text Complete
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     function onParse(event) {
    //       if (event.type === "event") {
    //         const data = event.data
    //         if (data === "[DONE]") {
    //           controller.close()
    //           return
    //         }
    //         try {
    //           const json = JSON.parse(data)
    //           const text = json.choices[0].text
    //           if (counter < 2 && (text.match(/\n/) || []).length) {
    //             return
    //           }
    //           const queue = encoder.encode(text)
    //           controller.enqueue(queue)
    //           counter++
    //         } catch (e) {
    //           controller.error(e)
    //         }
    //       }
    //     }

    //     // stream response (SSE) from OpenAI may be fragmented into multiple chunks
    //     // this ensures we properly read chunks & invoke an event for each SSE event stream
    //     const parser = createParser(onParse)

    //     // https://web.dev/streams/#asynchronous-iteration
    //     for await (const chunk of res.body) {
    //       parser.feed(decoder.decode(chunk))
    //     }
    //   }
    // })
    return stream;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function OpenAIStreamText(payload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let counter = 0;
  // console.log("payload", payload);
  // console.log("prompt", payload.prompt);

  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          process.env.REACT_APP_STAGE === "dev"
            ? process.env.REACT_APP_OPENAI_API_KEY_DEV
            : process.env.REACT_APP_OPENAI_API_KEY_PROD
        }`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.status > 399)
      throw { status: res.status, statusText: res.statusText };

    // console.log("res",res )

    // Text Complete
    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event) {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].text;
              if (counter < 2 && (text.match(/\n/) || []).length) {
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              controller.error(e);
            }
          }
        }

        // stream response (SSE) from OpenAI may be fragmented into multiple chunks
        // this ensures we properly read chunks & invoke an event for each SSE event stream
        const parser = createParser(onParse);

        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res.body) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });
    return stream;
  } catch (e) {
    console.error(e);
    return e;
  }
}
