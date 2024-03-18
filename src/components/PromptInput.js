import { HelpIcon } from "@/assets/HelpIcon";
import { agentsDemo2, agentsProd2 } from "@/utils/agents";
import { Avatar, Box, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import NextImage from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { HiMicrophone, HiStop } from "react-icons/hi";
import { TbSend } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
import AgentImage from "./AgentImage";
import { AuthContext, ConvoContext, DataContext, UIContext } from "./App";
import sideTabScreens from "@/utils/sideTabScreens";
import PeopleIcon from "@/assets/PeopleIcon";
// import { HelpIcon } from "@/assets/";

const SendButton = ({ submit, inputDisabled }) => {
  return (
    <Button
      marginLeft={"1%"}
      marginRight={"auto"}
      backgroundColor={"#0e9384"}
      paddingLeft={"auto"}
      paddingRight={"auto"}
      type={"submit"}
      onClick={submit}
      isDisabled={inputDisabled}
    >
      <TbSend size={"1.3em"} color={"#FFFFFF"} />
    </Button>
  );
};

const MicButton = ({ voiceInputEnabled, inputDisabled, mic, setMic }) => {
  return (
    <Tooltip
      textAlign={"center"}
      label={`${
        !voiceInputEnabled
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
        isDisabled={inputDisabled || !voiceInputEnabled}
      >
        {mic ? <HiStop size={"1.3em"} /> : <HiMicrophone size={"1.3em"} />}
      </Button>
    </Tooltip>
  );
};

const ShowAgentsButton = ({ onClick }) => {
  return (
    <Box cursor={"pointer"} onClick={onClick}>
      <PeopleIcon />
    </Box>
  );
};

function PromptInput({}) {
  const {
    demoMode,
    sendPrompt,
    language,
    loading,
    questionsUsed,
    fetchingConversation,
    saving,
    voiceInputEnabled,
  } = useContext(ConvoContext);
  const { setScrollToAgent, setSideTabScreen, setShowSideTab, isLargerThanMD } =
    useContext(UIContext);
  const { onboarding } = useContext(AuthContext);

  const [prompt, setPrompt] = useState("");
  const [mic, setMic] = useState(false);
  const speech = useRef("");
  const { agents, buddies } = useContext(DataContext);

  const inputDisabled =
    loading ||
    onboarding ||
    questionsUsed >= 10 ||
    fetchingConversation ||
    saving;
  const agentsAll = demoMode === true ? agents : buddies;
  // const [userID, setUserID] = useState("");
  useEffect(() => {
    let recognition;
    if (mic) {
      // console.log("RECORDING ",);
      const SpeechRecognition =
        window.speechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      // does this support all browser languages?
      recognition.lang = language;
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
    await sendPrompt(prompt);
  };

  const showAgentsTab = (index = undefined) => {
    setScrollToAgent(index);
    setSideTabScreen(sideTabScreens.AGENT_LIST);
    setShowSideTab(true);
    // onDrawerOpen();
  };
  return (
    <Flex
      padding={"10px"}
      borderTop={"2px solid #eeeff2"}
      minWidth="max-content"
      alignItems="center"
      position={isLargerThanMD ? "unset" : "fixed"}
      bottom={isLargerThanMD ? "unset" : 0}
      width={"100%"}
      backgroundColor={"white"}

      // flex={1}
    >
      <ShowAgentsButton onClick={showAgentsTab} />
      <MentionsInput
        disabled={inputDisabled}
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
          data={agentsAll.map((data, i) => {
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
            const image = suggestion.data.image.urlFull || undefined;
            const company = suggestion.data.company || "Prifina";
            console.log("Mention", suggestion.data);
            return (
              <Flex
                flexDirection={"row"}
                style={{ padding: "10px" }}
                alignItems={"center"}
                gap={"5px"}
              >
                {/* <AgentSkiCoachIcon scale={1} /> */}

                {image !== undefined ? (
                  <AgentImage
                    show={suggestion.data.image.urlFull}
                    icon={suggestion.data.image.chatIcon}
                    name={suggestion.data.name}
                    url={suggestion.data.image.urlFull}
                    defaultImage={suggestion.data.image.defaultFull}
                    size={2}
                    iconScale={2}
                  />
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
                    openDrawer(index);
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
      <MicButton
        inputDisabled={inputDisabled}
        mic={mic}
        setMic={setMic}
        voiceInputEnabled={voiceInputEnabled}
      />
      <SendButton submit={submit} inputDisabled={inputDisabled} />
    </Flex>
  );
}

export default PromptInput;
