import { speakText } from "./speakText";

export async function enqueueAudioFile({
  answer,
  language,
  audioCtx,
  mute,
  addNode,
  playNode,
  endNode,
}) {
  // fetch the audio file and decode it
  if (!mute) {
    await fetch(await speakText(answer, language))
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // console.log(audioBuffer);
        // create a new AudioBufferSourceNode for the audio file
        const sourceNode = audioCtx.createBufferSource();

        // set the audio buffer as the source node's buffer
        sourceNode.buffer = audioBuffer;

        // connect the source node to the previous source node in the array, or the audio context's destination (i.e., speakers) if this is the first file
        // if (sourceNodes.length > 0) {
        // sourceNode.connect(sourceNodes[sourceNodes.length - 1]);
        // } else {
        sourceNode.connect(audioCtx.destination);
        // }

        // set the onended event to play the next file in the queue when this file is finished playing
        sourceNode.onended = function () {
          endNode(sourceNode);
        };

        // add the new source node to the array
        addNode(sourceNode);

        // if this is the only source node in the array, start playing it
        playNode(sourceNode);
      });
  }
}
