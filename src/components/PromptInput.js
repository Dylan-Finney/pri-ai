import { HelpIcon } from "@/assets/HelpIcon";
import { agentsDemo2, agentsProd2 } from "@/utils/agents";
import { Box, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiMicrophone, HiStop } from "react-icons/hi";
import { TbSend } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
// import { HelpIcon } from "@/assets/";

function PromptInput(props) {
  const [prompt, setPrompt] = useState("");
  const [mic, setMic] = useState(false);
  const speech = useRef("");
  const agents = props.demoMode === true ? agentsDemo2 : agentsProd2;
  // const [userID, setUserID] = useState("");
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

  const submit = async () => {
    setPrompt("");
    await props.send(prompt);
  };
  return (
    <Flex
      padding={"10px"}
      borderTop={"2px solid #eeeff2"}
      minWidth="max-content"
      alignItems="center"
      // flex={1}
    >
      <Box
        cursor={"pointer"}
        onClick={() => {
          props.openDrawer();
        }}
      >
        <HelpIcon />
      </Box>
      <MentionsInput
        onCurs
        placeholder="Ex: What is in my calendar for tomorrow?"
        value={prompt}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            console.log("Submitted");
            submit();
          }
        }}
        onChange={(event, newValue) => {
          console.log(newValue);
          setPrompt(newValue);
        }}
        forceSuggestionsAboveCursor={true}
        singleLine
        style={{
          "&singleLine": {
            display: "flex",
            // width: "100vw",
            flex: 1,
            width: "1vw",
            height: 40,
            marginLeft: "10px",
            suggestions: {
              list: {
                overflowY: "auto",
                height: "40vh",
              },
            },
            highlighter: {
              padding: 1,
              paddingTop: 5,
              border: "2px inset transparent",
              overflowX: "hidden",
            },
            input: {
              borderRadius: "5px",
              borderColor: "#CBD5E0",

              padding: "7px",
              border: "1px solid",
              // minWidth: "100vw",

              minHeight: 40,
            },
          },
        }}
      >
        <Mention
          trigger="@"
          displayTransform={(a, display) => `@${display}`}
          data={agents.map((data, i) => {
            return {
              id: i,
              display: `${data.call}`,
              data: data,
            };
          })}
          style={{
            backgroundColor: "#F0FDF9",
          }}
          appendSpaceOnAdd={true}
          renderSuggestion={(
            suggestion,
            search,
            highlightedDisplay,
            index,
            focused
          ) => {
            const image = suggestion.data.image.urlCircle || undefined;
            const company = suggestion.data.company || "Prifina";
            return (
              <Flex
                onBlur={() => {
                  console.log("TEST");
                }}
                flexDirection={"row"}
                style={{ padding: "10px" }}
                alignItems={"center"}
                gap={"5px"}
              >
                {/* <AgentSkiCoachIcon scale={1} /> */}

                {image !== undefined ? (
                  <Box
                    // cursor={"pointer"}
                    position={"relative"}
                    width={"fit-content"}
                    // onClick={() => {
                    //   onClickAgent(agent);
                    // }}
                  >
                    <NextImage
                      src={`/assets/agents/${image}`}
                      width={50}
                      height={50}
                      alt={`Picture of the ${suggestion.data}`}
                    ></NextImage>
                    <Box
                      position={"absolute"}
                      zIndex={2}
                      bottom={-2}
                      right={-2}
                    >
                      {suggestion.data.image.chatIcon}
                    </Box>
                  </Box>
                ) : (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      // backgroundColor: "red",
                    }}
                  ></div>
                )}

                <Text noOfLines={1}>
                  <span style={{ color: "green" }}>@{suggestion.display}</span>{" "}
                  {company !== undefined && (
                    <span style={{ fontWeight: 600 }}>- by {company}</span>
                  )}
                </Text>
                <NextImage
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("TEST");
                    props.openDrawer(index);
                  }}
                  src={`/assets/details_menu.svg`}
                  width={25}
                  height={25}
                  alt={`Picture of the`}
                  style={{ marginLeft: "auto" }}
                ></NextImage>
              </Flex>
            );
          }}
          markup={"@[__display__](__id__)"}
        />
        <Mention
          trigger="#"
          displayTransform={(a, display) => `#${display}`}
          data={[]}
          regex={/#(\S+)/}
          style={{
            backgroundColor: "#F0FDF9",
            textShadow: "",
          }}
          markup="#__id__"
        />
      </MentionsInput>
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
        onClick={submit}
        isDisabled={props.sendDisabled || props.saving}
      >
        <TbSend size={"1.3em"} color={"#FFFFFF"} />
      </Button>
    </Flex>
  );
}

export default PromptInput;
