"use client";
/* eslint-disable react/no-unescaped-entities */
// import "@/styles/App.module.css";
import "../styles/App.module.css";
import axios from "axios";
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
const {
  DynamoDBClient,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

import About from "./About";
import ChatPrompt from "./ChatPrompt";
import ChatResponse from "./ChatResponse";
import Sidebar from "./Sidebar";

import { useVectorStore } from "../store/zustand";
import { generateUniqueId } from "../utils";
import { agentsDemo2, agentsProd2 } from "../utils/agents";
import { apps, avatars } from "../utils/constants";
import { enqueueAudioFile } from "../utils/enqueueAudioFile";
import {
  aiAnswer,
  getHistory,
  updateUsedTokens,
} from "../utils/pri-ai/getAnswer";
import { getData } from "../utils/pri-ai/getChunks";
import { handleIndex } from "../utils/pri-ai/handleIndex";
import sections from "../utils/sections";
import { streamIn } from "../utils/streamIn";
import { createStandaloneToast } from "@chakra-ui/toast";
import { getCurrentUser } from "aws-amplify/auth";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import AgentsDrawer from "./AgentsDrawer/AgentsDrawer";
import { Chatlog } from "./Chatlog";
import Header from "./Header";
import LoadingAnimation from "./LoadingAnimation";
import LoginModal from "./LogInModal";
import OnboardingModal from "./Onboarding/OnboardingModal";
import OnboardingPlaceholder from "./Onboarding/OnboardingPlaceholder";
import PromptInput from "./PromptInput";
import { Sharing } from "./Sharing";
import { Container, errorToasts } from "./Toast";
import UploadModal from "./UploadModal/UploadModal";
import { initialize } from "../utils/backend/initialize";
import { chatDemo, chatFull } from "../utils/backend/chat";
import { getThread } from "../utils/backend/getThread";
import { createTitle } from "../utils/backend/createTitle";
import { saveMessage } from "../utils/backend/save";

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
export const Context = createContext();

export const AppContext = createContext();
export const UserContext = createContext();

// var AWS = require("aws-sdk");
// AWS.config.update({
//   region: process.env.REACT_APP_AWS_REGION,
//   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// });

function App() {
  const EVALS = {
    appStorage: "prifina-expert",
    defaultScoreLimit: 0.2,
    contentLng: "en",
  };
  let sessionID = "";
  let url = "http://localhost:3000/api/";
  const languageRef = useRef("en");
  const debugOption = false;
  const indexOption = "dylan-test2";
  const lastGoodAnswer = useRef({});
  const functionContent = useRef();
  const currentTopic = useRef("topic-0");
  const topicList = useRef(["topic-0"]);
  const models = useRef({
    "gpt-3.5-turbo": 3000,
    "gpt-3.5-turbo-1106": 15000,
  });
  const defaultModel = useRef("gpt-3.5-turbo-1106");
  const summary = useRef("");
  const currentIndex = useRef(indexOption);
  let defaultScoreLimit = EVALS.defaultScoreLimit;
  const { getLastItem, getItems, insert, semanticSearch } = useVectorStore(
    useShallow((state) => ({
      getLastItem: state.getLastItem,
      getItems: state.getItems,
      insert: state.insert,
      semanticSearch: state.semanticSearch,
    }))
  );

  const scoreLimit = useRef(defaultScoreLimit);

  // const demoMode = {
  //   PRIAI: 0,
  //   GPT: 1,
  // };

  const [demoMode, setDemoMode] = useState(true);

  if (typeof window !== "undefined") {
    //console.log("WINDOW ", window.location.origin);
    // url = window.location.origin + (window.location.port === "" ? "" : ":" + window.location.port) + "/api/v1";
    url = window.location.origin + "/api";
    // Perform localStorage action

    const wisdomStorage = localStorage.getItem(EVALS.appStorage);
    let wisdom = {};
    if (wisdomStorage !== null) {
      wisdom = JSON.parse(wisdomStorage);
    }

    if (wisdom?.session === undefined) {
      sessionID = generateUniqueId();
      wisdom["session"] = sessionID;
      localStorage.setItem(EVALS.appStorage, JSON.stringify(wisdom));
    }
    sessionID = wisdom.session;
  }

  const getAnswer = async (
    chunks,
    scores,
    followUp,
    aggregate,
    newInput,
    entryType,
    langCode,
    tokens,
    contentInput = "",
    prompt,
    indexQuery
  ) => {
    try {
      console.log("BEGIN getAnswer INSIDE");
      let entry = prompt.entry.trim();
      if (entry === "") {
        return;
      }
      if (entryType === 1 && !entry.endsWith("?")) {
        entry += "?";
      }
      if (entryType === -1 && !entry.endsWith(".") && !entry.endsWith("!")) {
        entry += ".";
      }
      // const chatId = uniqueId.current;
      let followUpUpdate = followUp;
      // history content....
      // const lastEntry = getLastItem();
      const lastEntry = lastGoodAnswer.current;
      console.log("BEGIN QUERY");
      const queryResult = await semanticSearch({
        text: entry,
        score: 0.3,
        topK: 5,
      });
      console.log("QUERY RESULT ", queryResult);
      let historyContent = [];
      if (queryResult.length > 0) {
        const sessionItems = getItems();

        currentTopic.current = queryResult[0].item.metadata.topic;
        const maxTokens = models.current[defaultModel.current];
        if (tokens < maxTokens - 2000) {
          historyContent = getHistory(
            tokens,
            maxTokens - 1000,
            queryResult,
            sessionItems,
            currentTopic.current
          );
        }
      } else {
        const topic = `topic-${topicList.current.length}`;
        topicList.current.push(topic);
        currentTopic.current = topic;
        if (!lastGoodAnswer.current.followUp) {
          followUpUpdate = false;
        }
      }
      const results = await aiAnswer({
        url,
        requestId: generateUniqueId(),
        lastEntry,
        aggregate,
        followUp: followUpUpdate,
        statement: entry,
        llm: defaultModel.current,
        history: historyContent,
        chunks,
        summary: summary.current,
        chatId: generateUniqueId(),
        indexQuery,
        session: sessionID,
        entryType,
        langCode,
        appId: "pri-ai",
        userId: userID,
      });

      if (results?.error) {
        errorToasts({ error: results.error.message || results.error.name });
        console.error(results?.error);
        return;
      }

      console.log("GET ANSWER END RESULTS  ", results);
      // const msgIndex = messageList.length - 1;

      // answer has html tags like this <br/>
      const responseReceivedTime = Date.now();
      const cleanedAnswer = results.answer
        .replace(/<br\/>/g, "\n")
        .replace(/<\/?[^>]+(>|$)/g, " ")
        .trim();

      const avgScore =
        scores.reduce((total, score) => total + score, 0) / scores.length || 0;
      // const formattedScore = avgScore > 0 ? avgScore.toFixed(2) : avgScore;

      if (avgScore >= scoreLimit.current + 0.1) {
        //0.3
        lastGoodAnswer.current = {
          answer: cleanedAnswer,
          aggregate,
          statement: entry,
          followUp: followUpUpdate,
          entryType,
        };
      } else {
        lastGoodAnswer.current = {};
      }
      setChatlog(
        [].concat(chatlog, [
          {
            message: prompt.entry,
            time: prompt.promptSent,
            speaker: "User",
          },
          {
            message: cleanedAnswer,
            time: responseReceivedTime,
            speaker: "PriAI",
          },
        ])
      );

      updateUsedTokens({
        userId: userID,
        requestId: generateUniqueId(),

        url,
        finish_reason: results.finish_reason,
        currentIndex: indexQuery,
        llm: defaultModel.current,
        statement: entry,
        session: sessionID,
        answer: results.answer,
        score: avgScore,
        tokens: results.tokens,
      }).then((updateRes) => {
        //console.log("UPDATE USED TOKENS IN VECTOR ", updateRes);
        //console.log("UPDATE USED TOKENS IN VECTOR ", updateRes.response);
        console.log("UPDATE USED TOKENS IN VECTOR ", updateRes.tokens);

        // add Q/A into vector
        insert({
          text: `${entry} ${cleanedAnswer}`,
          metadata: {
            entry,
            answer: cleanedAnswer,
            tokens: updateRes.tokens,
            topic: currentTopic.current,
          },
        });
      });

      if (conversationID === -1) {
        await saveConversation({
          prompt: prompt.entry,
          answer: cleanedAnswer,
          promptSent: prompt.promptSent,
          responseReceivedTime,
        });
      } else {
        await appendConversation({
          prompt: prompt.entry,
          answer: cleanedAnswer,
          promptSent: prompt.promptSent,
          responseReceivedTime,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAgent = (entry) => {
    var regexAgent = entry.match(/@\[(\w+)\]\((\d+)\)/);
    const agents = demoMode ? agentsDemo2 : agentsProd2;
    if (regexAgent === null) {
      const regexAllPossAgents = entry.match(/@(\w+)/g);
      console.log(regexAllPossAgents);
      if (regexAllPossAgents !== null) {
        for (var i = 0; i <= regexAllPossAgents.length - 1; i++) {
          const agentIndex = agents.findIndex(
            (e) => e.call === regexAllPossAgents[i].substring(1)
          );
          if (agentIndex > -1) {
            regexAgent = [, regexAllPossAgents[i].substring(1), agentIndex];
            break;
          }
        }
      }
    }
    return regexAgent;
  };

  const setNewIndex = (entry) => {
    var indexQuery = indexOption;
    var usedAgent = {
      index: -1,
      call: "",
    };
    const regexAgent = getAgent(entry);
    if (
      regexAgent !== null &&
      agentsProd2[regexAgent[2]].call === regexAgent[1]
    ) {
      usedAgent = {
        index: regexAgent[2],
        call: regexAgent[1],
      };
      indexQuery = handleIndex(agentsProd2[regexAgent[2]].index, userID);
    } else {
      indexQuery = `user_index_${userID}`;
    }
    return {
      indexQuery,
      usedAgent,
    };
  };

  const clearPromptOfMentionsData = (prompt) => {
    return prompt.replace(/@\[([^\]]+)\]\(\d+\)/g, "@$1");
  };

  const getChunks = async (entry) => {
    setLoading(true);
    console.log("GET CHUNKS ", sessionID, url, debugOption, indexOption, entry);
    var promptSent = Date.now();
    const { indexQuery, usedAgent } = setNewIndex(entry);

    entry = clearPromptOfMentionsData(entry);

    setChatlog(
      [].concat(chatlog, {
        message: entry,
        time: promptSent,
        speaker: "User",
      })
    );

    const {
      error: dataError,
      chunks,
      scores,
      functions,
      confidence,
      tokens,
      searchAggregation,
      followUp,
      entryType,
      langCode,
      newInput,
    } = await getData(
      entry,
      lastGoodAnswer.current,
      {
        sessionID,
        scoreLimit: scoreLimit.current,
        contentLng: EVALS.contentLng,
      },
      indexQuery,
      debugOption
    );

    console.log({
      dataError,
      chunks,
      scores,
      functions,
      confidence,
      tokens,
      searchAggregation,
      followUp,
      entryType,
      langCode,
      newInput,
    });
    if (dataError) {
      errorToasts({ error: dataError.message || dataError.name });
      console.error(dataError.name || dataError.message, dataError.cause.info);
      return;
    }

    console.log("FINAL CHUNKS ", chunks, confidence);
    console.log("BEGIN GET ANSWER ");

    await getAnswer(
      chunks,
      scores,
      followUp,
      searchAggregation,
      newInput,
      entryType,
      langCode,
      tokens,
      "",
      {
        promptSent,
        entry,
      },
      indexQuery
    );
    console.log("END GET ANSWER ");
    setLoading(false);
  };

  const [indexToUpload, setIndexToUpload] = useState("");

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
  const [initializing, setInitializing] = useState(true);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        if (!loggedIn) {
          setInitializing(true);
          var user = await getCurrentUser();
          // console.log({ user });
          setLoggedIn(true);
          setDemoMode(false);
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
          const initalizedData = await initialize();
          // console.log(response);
          setConversations(initalizedData.threads);
          setSelectedAvatar(initalizedData.avatar);
          setAIName(initalizedData.name);
          setAgents(agentsProd2);

          initalMessage();
        }
      } catch (e) {
        console.error(e);
        setDemoMode(true);
        setAgents(agentsDemo2);
      }
      setInitializing(false);
    };
    checkIfLoggedIn();
  }, [onboarding]);

  const [usrlang, setUsrlang] = useState(null);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [language, setLanguage] = useState(usrlang);
  const [sourceNodes, setSourceNodes] = useState([]);

  const audioCtx = useRef(null);
  const [mute, setMute] = useState(false);

  const welcomeMessageText = `👋 Welcome to PriAI's demo mode by Prifina!
Demo mode is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers.
The full details on the abilities of Pri-AI can be found here in the help sheet. Keep in mind, demo mode does not have access to any of your data the real mode may have, nor any data not explicitly told. 

🤝 I am your Personal Assistant. Think of me as your very own personal AI-powered butler, available 24/7 to assist you. If you are unsure how to use me, ask me how can I help you.`;
  const [loading, setLoading] = useState(false);
  const [scrollToAgent, setScrollToAgent] = useState(undefined);
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
    sourceNodes.map((sourceNode) => {
      sourceNode.disconnect(audioCtx.current.destination);
    });
    sourceNodes.length = 0;
    setShowWelcomeMessage(false);
  };

  useEffect(() => {
    if (mute) {
      sourceNodes.map((sourceNode) => {
        sourceNode.disconnect(audioCtx.current.destination);
      });
      sourceNodes.length = 0;
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

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  //Example exchange {id: "clfb3uecq3npo0bmrzk3mx114", prompt: {text: "Test Prompt", time: 1679068112}, response: {text: "Test Response", time: 1679068112, helpful: null}}
  const [chatlog, setChatlog] = useState([]);
  const [userID, setUserID] = useState("");
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState("chat");
  const [fetchingConversation, setFetchingConversation] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [aIName, setAIName] = useState(null);
  const [chosenApps, setChosenApps] = useState([]);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [loginTime, setLoginTime] = useState(Date.now());
  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");

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
    const responseTitle = await createTitle({
      aiResponse: answer,
      prompt: prompt,
    });
    console.log({ responseTitle });
    var title = "";

    await streamIn(responseTitle, (newTitleChunk) => {
      title = title + newTitleChunk;
    });
    console.log({ title });
    if (title.charAt(0) === `"` || title.charAt(0) === `'`) {
      title = title.substring(1, title.length - 1);
    } else if (title.length === 0) {
      title = "New Thread";
    }
    if (loggedIn) {
      await saveMessage({
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
      await saveMessage({
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

  const fetchAnswers = async (prompt, promptSent) => {
    const response = loggedIn
      ? await chatFull({
          persona: {
            name: details.name || "",
            email: details.email || "",
            job: details.job || "",
            country: details.country || "",
            region: details.region || "",
          },
          chatlog: chatlog,
          prompt: prompt,
          agent: getAgent(prompt),
        })
      : await chatDemo({
          persona: {
            name: details.name || "",
            email: details.email || "",
            job: details.job || "",
            country: details.country || "",
            region: details.region || "",
          },
          chatlog: chatlog,
          prompt: prompt,
          agent: getAgent(prompt),
        });
    // const [response, responseCategory] = await Promise.all(fetchPromises);
    var answer = "";
    const responseReceivedTime = Date.now();
    await streamIn(response, (newAnswerChunk) => {
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

  const getResponse = async (promptOriginal) => {
    var promptSent = Date.now();
    setLoading(true);

    const prompt = clearPromptOfMentionsData(promptOriginal);
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
      lastGoodAnswer.current = {};
    } else {
      if (loggedIn) {
        setChatlog([]);
        setShowWelcomeMessage(false);
        setFetchingConversation(true);
        const allMessages = await getThread(newID);
        // console.log(response);
        setConversationID(newID);
        setChatlog(allMessages);
        setFetchingConversation(false);
        console.log(allMessages);
        var userMessageIndex = -1;
        var aiMessageIndex = -1;
        for (
          var index = allMessages.length - 1;
          (aiMessageIndex < 0 || userMessageIndex < 0) && index >= 0;
          index--
        ) {
          if (allMessages[index].speaker === "User") {
            userMessageIndex = index;
          } else if (allMessages[index].speaker !== "User") {
            aiMessageIndex = index;
          }
        }
        lastGoodAnswer.current = {
          answer:
            aiMessageIndex >= 0 ? allMessages[aiMessageIndex].message : "",
          aggregate: false,
          statement:
            userMessageIndex >= 0 ? allMessages[userMessageIndex].message : "",
          followUp: false,
          entryType: 1,
        };
      } else {
        const newIndex = conversations.findIndex((convo) => convo.id === newID);
        if (newIndex > -1) {
          setChatlog(conversations[newIndex].chatlog);
          setConversationIndex(newID);
          setConversationID(newID);
          var userMessageIndex = -1;
          var aiMessageIndex = -1;
          for (
            var index = conversations[newIndex].chatlog.length - 1;
            (aiMessageIndex < 0 || userMessageIndex < 0) && index >= 0;
            index--
          ) {
            if (conversations[newIndex].chatlog[index].speaker === "User") {
              userMessageIndex = index;
            } else if (
              conversations[newIndex].chatlog[index].speaker !== "User"
            ) {
              aiMessageIndex = index;
            }
          }
          lastGoodAnswer.current = {
            answer:
              aiMessageIndex >= 0 ? allMessages[aiMessageIndex].message : "",
            aggregate: false,
            statement:
              userMessageIndex >= 0
                ? allMessages[userMessageIndex].message
                : "",
            followUp: false,
            entryType: 1,
          };
        } else {
          console.error("Couldn't find index");
        }
      }
    }
  };

  useLayoutEffect(() => {
    var element = document.getElementById("chatlog");
    element.scrollTop = element.scrollHeight;
  }, [chatlog, loading, showWelcomeMessage]);
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
                      setFetchingConversation(false);
                    }}
                    initializing={initializing}
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
                mode={demoMode}
                changeMode={() => {
                  setDemoMode(!demoMode);
                }}
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
                loggedIn={loggedIn}
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

                        {/* {showWelcomeMessage && (
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
                        )} */}
                        {fetchingConversation === true ? (
                          <>
                            {Array.from({ length: 10 }, (_, index) => (
                              <>
                                <Skeleton
                                  key={index * 2}
                                  height={"100px"}
                                  mb={1}
                                  speed={0.85}
                                />
                                <Skeleton
                                  key={index * 2 + 1}
                                  height={"100px"}
                                  speed={0.95}
                                  mb={1}
                                />
                              </>
                            ))}
                          </>
                        ) : (
                          <>
                            {chatlog.length === 0 ? (
                              <Flex
                                flex={1}
                                justifyContent={"center"}
                                alignItems={"center"}
                                flexDir={"column"}
                              >
                                <Text>What shall we do next?</Text>
                                <Text>
                                  Pri-AI with your team of AI buddies makes
                                  thigns a breeze
                                </Text>
                                <Text>AI Buddies is ON for this thread</Text>
                                <Text>What are AI Buddies?</Text>
                              </Flex>
                            ) : (
                              <>
                                {chatlog?.map((message, index) => {
                                  return (
                                    <Box key={index}>
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
                                          submitFeedback={(
                                            helpful,
                                            details
                                          ) => {
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
                                            loading &&
                                            index === chatlog.length - 1
                                          }
                                        />
                                      )}
                                    </Box>
                                  );
                                })}
                              </>
                            )}
                          </>
                        )}

                        {loading && <LoadingAnimation />}
                      </>
                    )}
                  </Chatlog>

                  <PromptInput
                    language={language}
                    demoMode={demoMode}
                    sendDisabled={
                      loading ||
                      onboarding ||
                      questionsUsed >= 10 ||
                      fetchingConversation
                    }
                    voiceDisabled={!voiceInputEnabled}
                    send={async (prompt) => {
                      if (demoMode === true) {
                        await getResponse(prompt);
                      } else {
                        await getChunks(prompt.trim());
                      }

                      //
                    }}
                    saving={saving}
                    openDrawer={(index = undefined) => {
                      setScrollToAgent(index);
                      onDrawerOpen();
                    }}
                  />
                  <AgentsDrawer
                    demoMode={demoMode}
                    onClose={onDrawerClose}
                    isOpen={isDrawerOpen}
                    scrollToAgent={scrollToAgent}
                    onLogInOpen={onLogInOpen}
                    openUploadModal={(index) => {
                      setIndexToUpload(index);
                      onUploadOpen();
                    }}
                    setIndexToUpload={setIndexToUpload}
                  />
                  <UploadModal
                    isOpen={isUploadOpen}
                    onClose={() => {
                      setIndexToUpload("");
                      onUploadClose();
                    }}
                    onOpen={onUploadOpen}
                    userID={userID}
                    index={indexToUpload}
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
