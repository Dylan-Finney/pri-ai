"use client";
/* eslint-disable react/no-unescaped-entities */
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import "@/styles/App.module.css";
import NextImage from "next/image";
import { TbSend } from "react-icons/tb";
import { RiLoginCircleLine } from "react-icons/ri";
import { HiMicrophone, HiStop } from "react-icons/hi";
const {
  DynamoDBClient,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");
import getConfig from "next/config";

import Sidebar from "./Sidebar";
import About from "./About";
import ChatResponse from "./ChatResponse";
import ChatPrompt from "./ChatPrompt";

import OnboardingModal from "./Onboarding/OnboardingModal";

// const { serverRuntimeConfig } = getConfig();
// console.log({ serverRuntimeConfig });
const {
  useMediaQuery,
  Flex,
  Textarea,
  Button,
  useDisclosure,
  Text,
  Box,
  Tooltip,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  Skeleton,
} = require("@chakra-ui/react");
import { createStandaloneToast } from "@chakra-ui/toast";
import { Container, errorToasts } from "./Toast";
import { Chatlog } from "./Chatlog";
import { Sharing } from "./Sharing";
import LoginModal from "./LogInModal";
import { getCurrentUser } from "aws-amplify/auth";
import { enqueueAudioFile } from "@/utils/enqueueAudioFile";
import sections from "@/utils/sections";
import { streamIn } from "@/utils/streamIn";
import { apps, avatars } from "@/utils/constants";
import LoadingAnimation from "./LoadingAnimation";
import Header from "./Header";
import { v4 as uuidv4 } from "uuid";
import OnboardingPlaceholder from "./Onboarding/OnboardingPlaceholder";
import PromptInput from "./PromptInput";
export const Context = createContext();

export const AppContext = createContext();
export const UserContext = createContext();
// var AWS = require("aws-sdk");
// AWS.config.update({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

function App() {
  //Speech Recongition
  const [loggedIn, setLoggedIn] = useState(false);
  const [details, setDetails] = useState({
    name: null,
    country: "United States",
    region: "California",
    job: null,
    email: null,
  });
  const [onboarding, setOnboarding] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        if (!loggedIn) {
          var user = await getCurrentUser();
          // console.log({ user });
          setLoggedIn(true);
          setInitializing(true);
          setDetails({
            ...details,
            name: user.username,
          });
          setOnboarding(false);
          var threads = [];
          setUserID(user.userId);
          const newAvatar = avatars[0];
          const newName = `${user.username}'s Pri-AI`;
          setSelectedAvatar(newAvatar);
          setAIName(newName);
          const response = await axios({
            method: "POST",
            url: "/api/initialize",
            data: {},
          });
          // console.log(response);
          setConversations(response.data.threads);
          setSelectedAvatar(response.data.avatar);
          setAIName(response.data.name);
          setInitializing(false);
          initalMessage();
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkIfLoggedIn();
  }, [onboarding]);

  const [usrlang, setUsrlang] = useState(null);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [language, setLanguage] = useState(usrlang);
  const [sourceNodes, setSourceNodes] = useState([]);

  const audioCtx = useRef(null);
  const [mute, setMute] = useState(false);

  const [prompt, setPrompt] = useState("");
  const welcomeMessageText = `👋 Welcome to PriAI's demo mode by Prifina!
Demo mode is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers.
The full details on the abilities of Pri-AI can be found here in the help sheet. Keep in mind, demo mode does not have access to any of your data the real mode may have, nor any data not explicitly told. 

🤝 I am your Personal Assistant. Think of me as your very own personal AI-powered butler, available 24/7 to assist you. If you are unsure how to use me, ask me how can I help you.`;
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);
  const { ToastContainer, toast } = createStandaloneToast();

  useEffect(() => {
    // var newAudio = new Audio("/sounds/new_message.wav");
    // newAudio.volume = 0.05;
    // setAudio(newAudio);
    window.SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    setVoiceInputEnabled(window.SpeechRecognition !== undefined);
    setLanguage(navigator.language || navigator.userLanguage);
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx.current = new AudioContext();
    // only run once on the first render on the client
  }, []);

  const clearChat = () => {
    setChatlog([]);
    setPrompt("");
    sourceNodes.map((sourceNode) => {
      sourceNode.disconnect(audioCtx.current.destination);
    });
    sourceNodes.length = 0;
    setShowWelcomeMessage(false);
  };

  useEffect(() => {
    if (mute) {
      if (audio !== null) [(audio.muted = true)];
      sourceNodes.map((sourceNode) => {
        sourceNode.disconnect(audioCtx.current.destination);
      });
      sourceNodes.length = 0;
    } else {
      if (audio !== null) [(audio.muted = false)];
    }
  }, [mute]);
  const {
    isOpen: isSideBarOpen,
    onOpen: onSideBarOpen,
    onClose: onSideBarClose,
  } = useDisclosure();
  const {
    isOpen: isOnboardingOpen,
    onOpen: onOnboardingOpen,
    onClose: onOnboardingClose,
  } = useDisclosure();
  const {
    isOpen: isLogInOpen,
    onOpen: onLogInOpen,
    onClose: onLogInClose,
  } = useDisclosure();
  const {
    isOpen: isSharingOpen,
    onOpen: onSharingOpen,
    onClose: onSharingClose,
  } = useDisclosure();

  //Example exchange {id: "clfb3uecq3npo0bmrzk3mx114", prompt: {text: "Test Prompt", time: 1679068112}, response: {text: "Test Response", time: 1679068112, helpful: null}}
  const [chatlog, setChatlog] = useState([]);
  const [userID, setUserID] = useState("");
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState("chat");
  const [shiftDown, setShiftDown] = useState(false);
  const [fetchingConversation, setFetchingConversation] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showWelcomeOneMoreMessage, setShowWelcomeOneMoreMessage] =
    useState(false);
  const [aIName, setAIName] = useState(null);
  const [chosenApps, setChosenApps] = useState([]);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [loginTime, setLoginTime] = useState(Date.now());
  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  const date4 = new Date(Date.now());
  date4.setDate(date4.getDate() - 8);
  const [conversations, setConversations] = useState([]);

  const [conversationIndex, setConversationIndex] = useState(-1);
  const [conversationID, setConversationID] = useState(-1);

  useEffect(() => {
    // console.log({ conversations });
  }, [conversationIndex]);

  // const [generatingResponse, setGeneratingResponse] = useState(false)

  useEffect(() => {
    // close the Drawer when screen size is smaller than md
    if (isLargerThanMD) {
      onSideBarClose();
    }
  }, [isLargerThanMD, onSideBarClose]);

  const saveConversation = async ({
    prompt,
    answer,
    promptSent,
    responseReceivedTime,
  }) => {
    const newThreadID = uuidv4();
    var title = "New Thread";
    const responseTitle = await fetch("/api/createTitle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aiResponse: answer,
        prompt: prompt,
      }),
    });
    var title = "";

    await streamIn(responseTitle.body, (newTitleChunk) => {
      title = title + newTitleChunk;
    });
    if (title.charAt(0) === `"` || title.charAt(0) === `'`) {
      title = title.substring(1, title.length - 1);
    } else if (title.length === 0) {
      title = "New Thread";
    }
    if (loggedIn) {
      await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify({
          threadID: newThreadID,
          prompt: {
            time: promptSent.toString(),
            message: prompt,
          },
          response: {
            time: responseReceivedTime.toString(),
            message: answer,
          },
          userID,
          title,
          isNew: true,
        }),
      });
    }

    setConversationIndex(conversations.length);
    setConversationID(newThreadID);
    const newConversations = [
      ...conversations,
      {
        title,
        id: newThreadID,
        lastMessage: Date.now(),
        chatlog: [].concat(chatlog, [
          { message: prompt, time: promptSent, speaker: "User" },
          { message: answer, time: responseReceivedTime, speaker: "PriAI" },
        ]),
      },
    ];
    setConversations(newConversations);
    //   console.log({
    //     newConversations,
    //     newConversationIndex: conversations.length,
    //   });
  };

  const appendConversation = async ({
    prompt,
    answer,
    promptSent,
    responseReceivedTime,
  }) => {
    if (loggedIn) {
      // Put New Messages
      const conversation = conversations.find((c) => {
        return c.id === conversationID;
      });
      // console.log({ conversation });
      await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify({
          threadID: conversationID,
          prompt: {
            time: promptSent.toString(),
            message: prompt,
          },
          response: {
            time: responseReceivedTime.toString(),
            message: answer,
          },
          userID,
          isNew: false,
        }),
      });
    }

    setConversations(
      conversations.map((c) => {
        if (c.id === conversationID) {
          return {
            ...c,
            lastMessage: Date.now(),
            chatlog: [].concat(chatlog, [
              { message: prompt, time: promptSent, speaker: "User" },
              { message: answer, time: responseReceivedTime, speaker: "PriAI" },
            ]),
          };
        } else {
          return c;
        }
      })
    );
  };

  const storeConversation = () => {};

  const fetchAnswers = async (prompt, promptSent) => {
    const fetchPromises = [];
    fetchPromises[0] = fetch(loggedIn ? "/api/chatFull" : "/api/chatDemo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify({
        persona: {
          name: details.name || "",
          email: details.email || "",
          job: details.job || "",
          country: details.country || "",
          region: details.region || "",
        },
        chatlog: chatlog,
        prompt: prompt,
      }),
    });
    fetchPromises[1] = axios({
      method: "POST",
      url: "/api/categorize",
      data: {
        prompt: prompt,
      },
    });
    const [response, responseCategory] = await Promise.all(fetchPromises);
    var answer = "";
    const responseReceivedTime = Date.now();
    await streamIn(response.body, (newAnswerChunk) => {
      // console.log({answer})
      answer = answer + newAnswerChunk;
      // console.log({ answer });
      setChatlog(
        [].concat(chatlog, [
          { message: prompt, time: promptSent, speaker: "User" },
          { message: answer, time: responseReceivedTime, speaker: "PriAI" },
        ])
      );
    });
    return { answer, responseReceivedTime };
  };

  const getResponse = async (prompt) => {
    var promptSent = Date.now();
    setLoading(true);
    try {
      setChatlog(
        [].concat(chatlog, {
          message: prompt,
          time: promptSent,
          speaker: "User",
        })
      );

      const { answer, responseReceivedTime } = await fetchAnswers(
        prompt,
        promptSent
      );
      // console.log("DONE");
      setQuestionsUsed(questionsUsed + 1);
      setPrompt("");
      setSaving(true);
      if (conversationID === -1) {
        await saveConversation({
          prompt,
          answer,
          promptSent,
          responseReceivedTime,
        });
      } else {
        await appendConversation({
          prompt,
          answer,
          promptSent,
          responseReceivedTime,
        });
      }
      try {
        if (!mute) {
          enqueueAudioFile({
            answer,
            language,
            audioCtx: audioCtx.current,
            sourceNodes,
            mute,
            endNode: (sourceNode) => {
              // remove this source node from the array
              sourceNodes.splice(sourceNodes.indexOf(sourceNode), 1);
              // console.log("onended")

              // if there are more source nodes in the array, start playing the next one
              if (sourceNodes.length > 0) {
                setTimeout(function () {
                  sourceNodes[0].start();
                }, 1000);
              }
            },
            addNode: (sourceNode) => {
              sourceNodes.push(sourceNode);
            },
            playNode: (sourceNode) => {
              if (sourceNodes.length === 1) {
                sourceNode.start();
              }
            },
          });
        }
        setLoading(false);
      } catch (e) {
        console.error("Problem with TTS", e);
      }
      setSaving(false);
    } catch (e) {
      console.error("General getResponse Error", e);
      setPrompt("");
      setLoading(false);
      errorToasts({ error: "Unable to get response" });
    }
  };

  const submitFeedback = async (id, helpful, details, index) => {
    try {
      const responseFeedback = await axios({
        method: "POST",
        url: "/api/feedback",
        data: {
          id: id,
          userID: userID,
          helpful: helpful,
          details: details,
        },
      });
      let chatlogTemp = [...chatlog];
      chatlogTemp[index] = {
        prompt: { ...chatlogTemp[index].prompt },
        response: { ...chatlogTemp[index].response, helpful },
      };
      setChatlog([...chatlogTemp]);
    } catch (e) {
      console.error("Failure to save feedback");
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const initalMessage = async () => {
    await sleep(2000);
    setLoginTime(Date.now());
    setShowWelcomeMessage(true);
    // audio.play();
    // await sleep(2000);
    // setShowWelcomeOneMoreMessage(true);
    // audio.play();
  };

  //Load up onboaridng on load
  // const useMountEffect = (fun) => useEffect(fun, []);
  // useMountEffect(() => {
  //   onOnboardingOpen();
  // });

  // useEffect(() => {

  // }, []);

  const changeConversation = async (newID) => {
    if (newID === -1) {
      setChatlog([]);
      setConversationIndex(newID);
      setConversationID(newID);
    } else {
      if (loggedIn) {
        setChatlog([]);
        setShowWelcomeMessage(false);
        setFetchingConversation(true);
        const response = await axios({
          method: "POST",
          url: "/api/getThread",
          data: { threadID: newID },
        });
        // console.log(response);
        setConversationID(newID);
        setChatlog(response.data.allMessages);
        setFetchingConversation(false);
      } else {
        const newIndex = conversations.findIndex((convo) => convo.id === newID);
        if (newIndex > -1) {
          setChatlog(conversations[newIndex].chatlog);
          setConversationIndex(newID);
          setConversationID(newID);
        } else {
          console.error("Couldn't find index");
        }
      }
    }
  };

  useLayoutEffect(() => {
    var element = document.getElementById("chatlog");
    element.scrollTop = element.scrollHeight;
  }, [chatlog, loading, showWelcomeMessage, showWelcomeOneMoreMessage]);
  return (
    <>
      <div style={{ margin: "" }}>
        <>
          {onboarding ? (
            <>
              <UserContext.Provider
                value={[
                  aIName,
                  setAIName,
                  details,
                  setDetails,
                  selectedAvatar,
                  setSelectedAvatar,
                ]}
              >
                <AppContext.Provider
                  value={[
                    apps,
                    (apps) => {
                      setChosenApps(apps);
                    },
                  ]}
                >
                  <OnboardingModal
                    isOpen={isOnboardingOpen}
                    onClose={onOnboardingClose}
                    onOpen={onOnboardingOpen}
                    onFinish={() => {
                      setOnboarding(false);
                      setAIName(`${details.name}'s Pri-AI`);
                      setSelectedAvatar(
                        avatars[Math.floor(Math.random() * avatars.length)]
                      );
                      initalMessage();
                    }}
                  />
                </AppContext.Provider>
              </UserContext.Provider>
              <LoginModal
                isOpen={isLogInOpen}
                onClose={onLogInClose}
                onOpen={onLogInOpen}
                logInSuccess={(username) => {
                  // setLoggedIn(true);
                  setDetails({
                    ...details,
                    name: username,
                  });
                  setOnboarding(false);
                  setAIName(`${username}'s Pri-AI`);
                  setSelectedAvatar(
                    avatars[Math.floor(Math.random() * avatars.length)]
                  );
                }}
              />
            </>
          ) : (
            <></>
          )}
          <Sharing
            isOpen={isSharingOpen}
            onClose={onSharingClose}
            onOpen={onSharingOpen}
            isLargerThanMD={isLargerThanMD}
          />

          <Drawer
            placement={"left"}
            isOpen={isSideBarOpen}
            onClose={onSideBarClose}
            size={"xs"}
          >
            <DrawerOverlay />
            <DrawerContent width={"85%"} padding={"16px"}>
              <DrawerCloseButton />
              <Sidebar
                loggedIn={loggedIn}
                // display={{ base: "none", md: "flex" }}
                section={section}
                name={details.name}
                questionsUsed={questionsUsed}
                changeSection={setSection}
                conversations={conversations}
                disabledClick={fetchingConversation || loading}
                changeConversation={(newID) => {
                  changeConversation(newID);
                  onSideBarClose();
                }}
                onboarding={onboarding}
                activeConvo={conversationID}
                initializing={initializing}
              />
            </DrawerContent>
          </Drawer>
          <div
            style={{ display: "flex", flexDirection: "row", height: "100vh" }}
          >
            <Sidebar
              loggedIn={loggedIn}
              display={{ base: "none", md: "flex" }}
              section={section}
              name={details.name}
              questionsUsed={questionsUsed}
              changeSection={setSection}
              conversations={conversations}
              disabledClick={fetchingConversation || loading}
              changeConversation={changeConversation}
              onboarding={onboarding}
              activeConvo={conversationID}
              initializing={initializing}
            />
            <div
              style={{
                flexDirection: "column",
                minWidth: "80.5%",
                width: "100%",
                display: "flex",
              }}
            >
              <Header
                selectedAvatar={selectedAvatar}
                onboarding={onboarding}
                aIName={aIName}
                setAIName={setAIName}
                mute={mute}
                setMute={setMute}
                onSideBarOpen={onSideBarOpen}
                clearChat={clearChat}
                onSharingOpen={onSharingOpen}
                userID={userID}
                initializing={initializing}
              />
              {section === sections.ABOUT ? (
                <>
                  <About />
                </>
              ) : (
                <>
                  <Chatlog onboarding={onboarding}>
                    {onboarding ? (
                      <OnboardingPlaceholder
                        logIn={onLogInOpen}
                        openDemo={onOnboardingOpen}
                      />
                    ) : (
                      <>
                        <div style={{ marginTop: "auto" }} />

                        {showWelcomeMessage && (
                          <>
                            <ChatResponse
                              aIName={aIName}
                              selectedAvatar={selectedAvatar}
                              time={loginTime}
                              text={welcomeMessageText}
                              feedback={false}
                              generating={false}
                            />
                          </>
                        )}
                        {fetchingConversation === true ? (
                          <>
                            {Array.from({ length: 10 }, (_, index) => (
                              <>
                                <Skeleton
                                  height={"100px"}
                                  mb={1}
                                  speed={0.85}
                                />
                                <Skeleton
                                  height={"100px"}
                                  speed={0.95}
                                  mb={1}
                                />
                              </>
                            ))}
                          </>
                        ) : (
                          <>
                            {chatlog?.map((message, index) => {
                              return (
                                <>
                                  {message.speaker === "User" ? (
                                    <ChatPrompt
                                      name={details.name}
                                      text={message.message}
                                      time={message.time}
                                    />
                                  ) : (
                                    <ChatResponse
                                      aIName={aIName}
                                      selectedAvatar={selectedAvatar}
                                      text={message.message}
                                      time={message.time}
                                      saving={saving}
                                      submitFeedback={(helpful, details) => {
                                        submitFeedback(
                                          message.id,
                                          helpful,
                                          details,
                                          index
                                        );
                                      }}
                                      feedback={
                                        index < chatlog.length - 1 ||
                                        (!loading &&
                                          index === chatlog.length - 1)
                                      }
                                      generating={
                                        loading && index === chatlog.length - 1
                                      }
                                    />
                                  )}
                                </>
                              );
                            })}
                          </>
                        )}

                        {loading && <LoadingAnimation />}
                      </>
                    )}
                  </Chatlog>

                  <PromptInput
                    language={language}
                    sendDisabled={
                      loading ||
                      onboarding ||
                      questionsUsed >= 10 ||
                      fetchingConversation
                    }
                    voiceDisabled={!voiceInputEnabled}
                    setPrompt={(temp) => {
                      setPrompt(temp);
                    }}
                    send={async (prompt) => {
                      await getResponse(prompt);
                    }}
                    saving={saving}
                  />
                  {/* </Flex> */}
                </>
              )}
            </div>
          </div>
        </>
      </div>
      <ToastContainer />
      <Container />
    </>
  );
}

export default App;
