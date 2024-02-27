import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { PollyClient } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
// import voices from "@/components/utils/Voices";
import voices from "../voices";

const pollyClient = new PollyClient({
  region: "eu-west-1",
  credentials: fromCognitoIdentityPool({
    //client: new CognitoIdentityClient({ region: "eu-west-1" }),
    clientConfig: { region: "eu-west-1" },
    identityPoolId: process.env.REACT_APP_POLLY_IDENTITY_POOL_ID, // IDENTITY_POOL_ID
  }),
});

export async function getAudioURL({ speak, lng = "en-US" }) {
  // console.log(await req.json());
  if (speak) {
    try {
      const voice = voices[lng] || null;
      if (voice) {
        const voiceParts = voice.split("/");
        const voiceEngine = voiceParts.length === 1 ? "neural" : "standard";
        const voiceID = voiceParts.length === 1 ? voiceParts[0] : voiceParts[1];
        // console.log("VOICE ", voiceParts);
        // remove the A: in answer....
        //   if (speak.substring(1, 3) === ": ") {
        //     speak = speak.substring(3);
        //   }
        // Set the parameters
        const speechParams = {
          OutputFormat: "mp3", // For example, ‘mp3’
          SampleRate: "24000", // For example, ’16000
          Text: speak, // The ‘speakText’ function supplies this value
          TextType: "text", // For example, "text"
          VoiceId: voiceID, // For example, "Matthew"
          Engine: voiceEngine,
        };
        let url = await getSynthesizeSpeechUrl({
          client: pollyClient,
          params: speechParams,
        });
        // console.log(url);
        return url;
      }
    } catch (err) {
      // console.log("Error", err);
      console.error("TTS Error", err);
    }
  } else {
    console.error("Needs text for TTS");
  }
}
