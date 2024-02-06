import { Button, Flex, Textarea, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HiMicrophone, HiStop } from "react-icons/hi";
import { TbSend } from "react-icons/tb";

function PromptInput(props) {
  const [prompt, setPrompt] = useState("");
  const [mic, setMic] = useState(false);
  const [shiftDown, setShiftDown] = useState(false);
  const speech = useRef("");
  const [userID, setUserID] = useState("");
  useEffect(() => {
    let recognition;
    if (mic) {
      // console.log("RECORDING ",);
      const SpeechRecognition =
        window.speechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      // does this support all browser languages?
      recognition.lang = props.language;
      recognition.continuous = true;
      recognition.interimResults = true;
      var before = prompt;
      var final_transcript = "";
      recognition.onresult = (event) => {
        var interim_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript =
          final_transcript.charAt(0).toUpperCase() + final_transcript.slice(1);
        if (interim_transcript === "") {
          setPrompt(`${before}${final_transcript}. `);
          setMic(false);
          recognition.stop();
        } else {
          setPrompt(`${before}${final_transcript}${interim_transcript}`);
        }
        // console.log("final_transcript", final_transcript);
        // console.log("interim_transcript",interim_transcript);

        // setMic(false);
      };

      recognition.start();
    } else {
      if (speech.current !== "") {
        recognition.stop(); //recording stops automatically....
      }
    }
  }, [mic]);
  return (
    <Flex
      padding={"10px"}
      borderTop={"2px solid #eeeff2"}
      minWidth="max-content"
      alignItems="center"
    >
      <Textarea
        marginLeft={"3%"}
        width={"85%"}
        rows={1}
        resize={"none"}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        placeholder="Ex: What is in my calendar for tomorrow?"
        onKeyDown={async (event) => {
          if (event.key === "Shift" && !shiftDown) {
            setShiftDown(true);
          } else if (event.key === "Enter" && !shiftDown) {
            event.preventDefault;
            setPrompt("");
            await props.send(prompt);
          }
        }}
        onKeyUp={async (event) => {
          if (event.key === "Shift") {
            setShiftDown(false);
          }
        }}
        isDisabled={props.sendDisabled}
        autoFocus={true}
      />
      <Tooltip
        textAlign={"center"}
        label={`${
          props.voiceDisabled
            ? "Browser not supported. Try Google Chrome or Microsoft Edge."
            : ""
        }`}
      >
        <Button
          width={"fit-content"}
          color={"#FFFFFF"}
          backgroundColor={"#0E9384"}
          marginLeft={"8px"}
          onClick={() => {
            setMic(!mic);
          }}
          isDisabled={props.sendDisabled || props.voiceDisabled}
        >
          {mic ? <HiStop size={"1.3em"} /> : <HiMicrophone size={"1.3em"} />}
        </Button>
      </Tooltip>
      <Button
        marginLeft={"1%"}
        marginRight={"auto"}
        backgroundColor={"#0e9384"}
        paddingLeft={"auto"}
        paddingRight={"auto"}
        type={"submit"}
        onClick={async () => {
          setPrompt("");
          await props.send(prompt);
        }}
        isDisabled={props.sendDisabled || props.saving}
      >
        <TbSend size={"1.3em"} color={"#FFFFFF"} />
      </Button>
    </Flex>
  );
}

export default PromptInput;
