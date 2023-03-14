import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { PollyClient } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
import voices from "@/components/utils/Voices";

const pollyClient = new PollyClient({
  region: "eu-west-1",
  credentials: fromCognitoIdentityPool({
    //client: new CognitoIdentityClient({ region: "eu-west-1" }),
    clientConfig: { region: "eu-west-1" },
    identityPoolId: process.env.POLLY_IDENTITY_POOL_ID // IDENTITY_POOL_ID
  }),
});

export default async function handler(req, res) {
    const speak = req.body.speak;
    const lng = req.body.lng;
    if (speak && lng) {
        try {
            const voice = voices[lng] || null;
            if (voice) {
            const voiceParts = voice.split("/");
            const voiceEngine = voiceParts.length === 1 ? "neural" : "standard";
            const voiceID = voiceParts.length === 1 ? voiceParts[0] : voiceParts[1];
            console.log("VOICE ", voiceParts);
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
                Engine: voiceEngine
            };
            let url = await getSynthesizeSpeechUrl({
                client: pollyClient, params: speechParams
            });
            console.log(url);
            res.status(200).json({url})
            }
        } catch (err) {
            console.log("Error", err);
            res.status(400).json({error: "Error"})
        }
    } else {
        res.status(400).json({error: "Missing Speak or Language"})
    }
     
};