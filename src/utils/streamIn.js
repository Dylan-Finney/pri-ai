const streamIn = async (data, changeVal) => {
  if (!data) return undefined;

  if (data) {
    const reader = data.getReader();
    const decoder = new TextDecoder();
    var done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      // console.log({ value, doneReading });
      done = doneReading;
      const chunkValue = decoder.decode(value);
      changeVal(chunkValue);
    }
  }
};

export { streamIn };
