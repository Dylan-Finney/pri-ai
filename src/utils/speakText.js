import axios from "axios";

export async function speakText(speak, lng) {
  try {
    // if (!mute) {
    const responseAPI = await axios({
      method: "POST",
      url: "/api/audio",
      data: {
        speak,
        lng,
      },
    });
    return responseAPI.data.url;
    // }
  } catch (err) {
    console.error("Can't get TTS");
  }
}
