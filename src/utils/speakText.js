import axios from "axios";
import { getAudioURL } from "./backend/audio";

export async function speakText(speak, lng) {
  try {
    // if (!mute) {
    const url = getAudioURL({ speak, lng });
    return url;
    // }
  } catch (err) {
    console.error("Can't get TTS");
  }
}
