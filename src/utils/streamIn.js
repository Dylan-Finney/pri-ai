/**
 * Function to stream in chunks of data
 * @param {Blob} data - The Blob Data to stream in for
 * @param {function} changeVal - The function that takes in the new ChunkValues
 *  */
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
