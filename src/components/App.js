"use client";
/* eslint-disable react/no-unescaped-entities */
import "@/styles/App.module.css";
import axios from "axios";
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import About from "./About";
import ThreadsSidebar from "./ThreadsSidebar";
import { useVectorStore } from "@/store/zustand";
import { generateUniqueId } from "@/utils";
import { agentsDemo2, agentsProd2 } from "@/utils/agents";
import { apps, avatars, baseBookmarkThreadObj } from "@/utils/constants";
import { enqueueAudioFile } from "@/utils/enqueueAudioFile";
import {
  aiAnswer,
  getHistory,
  updateUsedTokens,
} from "@/utils/pri-ai/getAnswer";
import { getData } from "@/utils/pri-ai/getChunks";
import { handleIndex } from "@/utils/pri-ai/handleIndex";
import sections from "@/utils/sections";
import { streamIn } from "@/utils/streamIn";
import { createStandaloneToast } from "@chakra-ui/toast";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import LoginModal from "./LogInModal";
import OnboardingModal from "./Onboarding/OnboardingModal";
import { Sharing } from "./Sharing";
import { Container, errorToasts } from "./Toast";
import { UploadSection } from "./Sections/UploadSection";
import DeleteModal from "./DeleteModal";
import SideMenu from "./SideMenu";
import ChatSection from "./ChatSection";
import sideTabScreens from "../utils/sideTabScreens";
import sidebarScreens from "@/utils/sidebarScreens";

const {
  useMediaQuery,
  Flex,
  useDisclosure,
  Box,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
} = require("@chakra-ui/react");
export const Context = createContext();

export const AppContext = createContext();
export const UserContext = createContext();
export const DataContext = createContext();

export const UIContext = createContext();
export const AuthContext = createContext();
export const ConvoContext = createContext();

function App() {
  /*
    STATES
  */

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

  const [demoMode, setDemoMode] = useState(true);

  const [showSideTab, setShowSideTab] = useState(false);

  const [sideTabScreen, setSideTabScreen] = useState(
    sideTabScreens.SAVED_CHATS
  );
  const [expandedAgent, setExpandedAgent] = useState(-1);
  const [expandSideTab, setExpandSideTab] = useState(false);

  const [indexToUpload, setIndexToUpload] = useState("");

  //Speech Recongition
  const [loggedIn, setLoggedIn] = useState(false);
  const [threadTitle, setThreadTitle] = useState("Welcome");
  const [details, setDetails] = useState({
    name: null,
    country: "United States",
    region: "California",
    job: null,
    email: null,
  });
  const [onboarding, setOnboarding] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const [agents, setAgents] = useState(agentsProd2);
  const [buddies, setBuddies] = useState(agentsProd2);

  const [usrlang, setUsrlang] = useState(null);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [language, setLanguage] = useState(usrlang);
  const [sourceNodes, setSourceNodes] = useState([]);

  const audioCtx = useRef(null);
  const [mute, setMute] = useState(true);

  const welcomeMessageText = `👋 Welcome to PriAI's demo mode by Prifina!
Demo mode is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers.
The full details on the abilities of Pri-AI can be found here in the help sheet. Keep in mind, demo mode does not have access to any of your data the real mode may have, nor any data not explicitly told. 

🤝 I am your Personal Assistant. Think of me as your very own personal AI-powered butler, available 24/7 to assist you. If you are unsure how to use me, ask me how can I help you.`;
  const [loading, setLoading] = useState(false);
  const [scrollToAgent, setScrollToAgent] = useState(undefined);
  const { ToastContainer, toast } = createStandaloneToast();

  //Example exchange {id: "clfb3uecq3npo0bmrzk3mx114", prompt: {text: "Test Prompt", time: 1679068112}, response: {text: "Test Response", time: 1679068112, helpful: null}}
  const [chatlog, setChatlog] = useState([]);
  const [userID, setUserID] = useState("");
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState(sections.CHAT);
  const [fetchingConversation, setFetchingConversation] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [aIName, setAIName] = useState(null);
  const [chosenApps, setChosenApps] = useState([]);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [loginTime, setLoginTime] = useState(Date.now());
  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  const [bookmarks, setBookmarks] = useState({});

  const [conversations, setConversations] = useState([]);

  const [conversationIndex, setConversationIndex] = useState(-1);
  const [conversationID, setConversationID] = useState(-1);

  const boxRef = useRef();
  let isFirstClick = true;
  let changingScreen = false;

  //The selected bookmarked thread for the sidetab
  const [bookmarkedThread, setBookmarkedThread] = useState(
    baseBookmarkThreadObj
  );

  //Which agent was selected to ad knowledge to
  const [agentKnowledgeUpload, setAgentKnowledgeUpload] = useState("");

  //The selected screen for the sidetab
  const [sidebarScreen, setSidebarScreen] = useState(sidebarScreens.MENU);

  /*
    DISCLOSURE STATES
  */
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
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
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

  /*
    FUNCTIONS
  */
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
    indexQuery,
    usedAgent
  ) => {
    const requestID = generateUniqueId();
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
        requestId: requestID,
        lastEntry,
        aggregate,
        followUp: followUpUpdate,
        statement: entry,
        llm: defaultModel.current,
        history: historyContent,
        chunks,
        summary: summary.current,
        chatId: generateUniqueId(),
        currentIndex: indexQuery,
        session: sessionID,

        entryType,
        langCode,
        appId: "PriAI",
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
            speaker: getSpeaker(usedAgent.call),
          },
        ])
      );

      updateUsedTokens({
        url,
        userId: userID,
        requestId: requestID,
        finish_reason: results.finish_reason,
        currentIndex: indexQuery,
        llm: defaultModel.current,
        langCode,
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
          speaker: usedAgent.call,
        });
      } else {
        await appendConversation({
          prompt: prompt.entry,
          answer: cleanedAnswer,
          promptSent: prompt.promptSent,
          responseReceivedTime,
          speaker: usedAgent.call,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAgent = (entry) => {
    var regexAgent = entry.match(/@\[(\w+)\]\((\d+)\)/);
    const agents = demoMode ? agentsDemo2 : buddies;
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
    console.log({ regexAgent });
    if (regexAgent !== null && buddies[regexAgent[2]].call === regexAgent[1]) {
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

    // console.log({
    //   dataError,
    //   chunks,
    //   scores,
    //   functions,
    //   confidence,
    //   tokens,
    //   searchAggregation,
    //   followUp,
    //   entryType,
    //   langCode,
    //   newInput,
    // });
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
      indexQuery,
      usedAgent
    );
    console.log("END GET ANSWER ");
    setLoading(false);
  };

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
          const response = await axios({
            method: "POST",
            url: "/api/initialize",
            data: {},
          });
          // console.log(response.data);
          // console.log(response);
          setConversations(response.data.threads);
          setSelectedAvatar(response.data.avatar);
          setAIName(response.data.name);
          setBookmarks(response.data.bookmarks);

          const responseAgentDetails = await axios({
            method: "POST",
            url: "/api/getPersonalAgentsDetails",
            data: {},
          });
          // console.log(responseAgentDetails.data);
          var agentsCopy = [...agentsProd2];
          const agentIndexes = agentsCopy.map(function (x) {
            return x.id;
          });

          for (const agentDetail of responseAgentDetails.data.agentDetails) {
            if (agentIndexes.indexOf(agentDetail.id) > -1) {
              agentsCopy[agentIndexes.indexOf(agentDetail.id)] = {
                ...agentsCopy[agentIndexes.indexOf(agentDetail.id)],
                name:
                  agentDetail.name === undefined
                    ? agentsCopy[agentIndexes.indexOf(agentDetail.id)].name
                    : agentDetail.name,
                image: {
                  ...agentsCopy[agentDetail.id].image,
                  urlFull: agentDetail.image,
                },
              };
            }
          }
          // console.log({ agentsCopy });
          setBuddies(agentsCopy);
          setAgents([...agentsDemo2, ...agentsCopy]);
          // initalMessage();
        }
      } catch (e) {
        console.error(e);
        setDemoMode(true);
      }
      setInitializing(false);
    };
    checkIfLoggedIn();
  }, [onboarding]);

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

  useEffect(() => {
    // console.log({ conversations });
  }, [conversationIndex]);

  // const [generatingResponse, setGeneratingResponse] = useState(false)

  useEffect(() => {
    // close the Drawer when screen size is smaller than md
    if (isLargerThanMD) {
      onSideBarClose();
      if (!showSideTab) {
        setExpandSideTab(false);
      }
    } else {
      if (showSideTab) {
        setExpandSideTab(true);
      } else {
        setExpandSideTab(false);
      }
      //
    }
  }, [isLargerThanMD, onSideBarClose]);

  const getSpeaker = (speaker) => {
    return speaker !== "" ? speaker : demoMode ? "pri-ai" : "mybuddy";
  };

  const saveConversation = async ({
    prompt,
    answer,
    promptSent,
    responseReceivedTime,
    speaker = "",
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
            speaker: getSpeaker(speaker),
          },
          userID,
          title,
          isNew: true,
          speakers: [getSpeaker(speaker)],
          newSpeaker: true,
          demo: demoMode,
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
        buddies: !demoMode,
        speakers: [getSpeaker(speaker)],
        chatlog: [].concat(chatlog, [
          { message: prompt, time: promptSent, speaker: "User" },
          {
            message: answer,
            time: responseReceivedTime,
            speaker: getSpeaker(speaker),
          },
        ]),
      },
    ];
    setConversations(newConversations);
    setThreadTitle(title);
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
    speaker = "",
  }) => {
    const conversation = conversations.find((c) => {
      return c.id === conversationID;
    });
    // console.log(conversation);
    const isNewSpeaker = () => {
      if (!conversation.speakers || conversation.speakers?.length === 0) {
        return true;
      } else {
        return !conversation.speakers.includes(getSpeaker(speaker));
      }
    };
    if (loggedIn) {
      // Put New Messages

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
            speaker: getSpeaker(speaker),
          },
          userID,
          isNew: false,
          speakers: [...conversation.speakers, getSpeaker(speaker)],
          newSpeaker: isNewSpeaker(),
        }),
      });
    }

    setConversations(
      conversations.map((c) => {
        if (c.id === conversationID) {
          return {
            ...c,
            speakers: isNewSpeaker()
              ? [...conversation.speakers, getSpeaker(speaker)]
              : conversation.speakers,
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

  const resetSideTab = () => {
    setSideTabScreen(sideTabScreens.SAVED_CHATS);
    setShowSideTab(false);
    setExpandSideTab(false);
    setExpandedAgent(-1);
  };
  useEffect(() => {
    if (showSideTab) {
      //Close the sidetab when clicking on anything outside of the sidetab
      window.onclick = (event) => {
        if (boxRef.current) {
          if (
            showSideTab &&
            event.target !== boxRef.current &&
            !boxRef.current.contains(event.target)
          ) {
            if (isFirstClick) {
              isFirstClick = false;
              return;
            }
            // else if (changingScreen) {
            //   changingScreen = false;
            //   return;
            // }
            // console.log("HIDE TAB");
            resetSideTab();
          }
        }
      };
      // Always expand for mobile
      if (!isLargerThanMD) setExpandSideTab(true);
    } else {
      //Reset UI and states when closed
      window.onclick = (event) => {};
      setBookmarkedThread(baseBookmarkThreadObj);
      setExpandSideTab(false);
    }
  }, [showSideTab]);

  /**
   * Function to fetch the answer to the prompt
   * @param {string} prompt - The prompt to retrive the answer for
   * @param {number} promptSent - The time the message was sent
   * @param {string} speaker - The agent/buddy that the message is meant to be addressed to
   */
  const fetchAnswers = async (prompt, promptSent, speaker = "") => {
    const fetchPromises = [];
    //Get answer for the prompt, depending on whether the demo mode is on
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
        agent: getAgent(prompt),
      }),
    });

    //Categorize the prompt
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

    //Stream in the answer
    await streamIn(response.body, (newAnswerChunk) => {
      answer = answer + newAnswerChunk;
      setChatlog(
        [].concat(chatlog, [
          { message: prompt, time: promptSent, speaker: "User" },
          {
            message: answer,
            time: responseReceivedTime,
            speaker: getSpeaker(speaker),
          },
        ])
      );
    });
    return { answer, responseReceivedTime };
  };

  /**
   * The DemoMode function to get a response from the user's prompt.
   * @param {string} promptOriginal - The prompt as it was sent by the user
   */
  const getResponse = async (promptOriginal) => {
    var promptSent = Date.now();
    setLoading(true);

    //Clears the prompt of embedded Mention Data
    const prompt = clearPromptOfMentionsData(promptOriginal);

    try {
      //Append the message to the chatlog state to display while fetching the answer
      setChatlog(
        [].concat(chatlog, {
          message: prompt,
          time: promptSent,
          speaker: "User",
        })
      );

      //Get the agent/buddy that the prompt mentions
      const agent = getAgent(promptOriginal);
      const speaker = getSpeaker(agent === null ? "" : agent[1]);

      //Fetch the answer from the backend
      const { answer, responseReceivedTime } = await fetchAnswers(
        prompt,
        promptSent,
        speaker
      );

      //Increment the questions used for potential cap reasons
      setQuestionsUsed(questionsUsed + 1);
      setSaving(true);

      //Save the message. If the answer is apart of a new thread, create a new thread in the backend.
      if (conversationID === -1) {
        await saveConversation({
          prompt,
          answer,
          promptSent,
          responseReceivedTime,
          speaker,
        });
      } else {
        await appendConversation({
          prompt,
          answer,
          promptSent,
          responseReceivedTime,
          speaker,
        });
      }

      try {
        if (!mute) {
          //Use Text-to-Speech for the answer
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

  useEffect(() => {
    if (loggedIn) {
      if (conversationID === "") {
        //When creating a new thread and loggedIn, always disable demo mode to show the buddies
        setDemoMode(false);
      }
    }
  }, [conversationID]);

  useEffect(() => {
    //Change the agents accessible to the user based on whether the user is in demo mode or not
    setAgents(demoMode ? agentsDemo2 : [...buddies, ...agentsDemo2]);
  }, [demoMode]);

  /**
   * Function to change the feedback for the selected message.
   * @param {string} threadID - The ID of the conversation thread the message belongs to.
   * @param {number} time - The time the message was sent.
   * @param {boolean} helpful - Whether the feedback is positive (true) or negative (false).
   * @param {string} details - The details provided about the feedback. (only for negative feedback)
   * @param {boolean} remove - Whether the feedback is being added or removed (default: false).
   * @param {number} index - The index of the message in the chatlog
   */
  const submitFeedback = async ({
    threadID,
    time,
    helpful,
    details,
    remove = false,
    index,
  }) => {
    try {
      //Update feedback for the message in the backend
      const responseFeedback = await axios({
        method: "POST",
        url: "/api/feedback",
        data: {
          threadID,
          time,
          helpful,
          details,
          remove,
        },
      });

      //Update feedback in the frontend
      let chatlogTemp = [...chatlog];
      chatlogTemp[index] = {
        ...chatlogTemp[index],
        feedback: remove
          ? {}
          : {
              helpful: remove ? undefined : helpful,
              details: remove ? undefined : details,
            },
      };
      setChatlog([...chatlogTemp]);
    } catch (e) {
      console.error("Failure to save feedback");
    }
  };

  /**
   * Function to change the active conversation thread.
   * @param {number} newID - The ID of the new conversation thread.
   * @param {string} title - The title of the new conversation thread (default: "New Thread").
   */
  const changeConversation = async (newID, title = "New Thread") => {
    if (newID === -1) {
      //Resets conversation state when there is no previous ID (newID is -1)
      setChatlog([]);
      setConversationIndex(newID);
      setConversationID(newID);
      setThreadTitle(title);
      lastGoodAnswer.current = {};
      if (loggedIn) {
        setDemoMode(false);
      }
    } else {
      const newIndex = conversations.findIndex((convo) => convo.id === newID);
      if (loggedIn) {
        //Fetch conversation data when user is logged in
        setChatlog([]);
        setShowWelcomeMessage(false);
        setFetchingConversation(true);
        const response = await axios({
          method: "POST",
          url: "/api/getThread",
          data: { threadID: newID },
        });
        setConversationID(newID);
        setChatlog(response.data.allMessages);
        setFetchingConversation(false);

        //Finds last user and AI messages indices for reference
        var userMessageIndex = -1;
        var aiMessageIndex = -1;
        for (
          var index = response.data.allMessages.length - 1;
          (aiMessageIndex < 0 || userMessageIndex < 0) && index >= 0;
          index--
        ) {
          if (response.data.allMessages[index].speaker === "User") {
            userMessageIndex = index;
          } else if (response.data.allMessages[index].speaker !== "User") {
            aiMessageIndex = index;
          }
        }

        //Resets lastGoodAnswer to have the last user message (statement) and assitatn message (answer)
        lastGoodAnswer.current = {
          answer:
            aiMessageIndex >= 0
              ? response.data.allMessages[aiMessageIndex].message
              : "",
          aggregate: false,
          statement:
            userMessageIndex >= 0
              ? response.data.allMessages[userMessageIndex].message
              : "",
          followUp: false,
          entryType: 1,
        };
        //Sets the title of the thread and whether the thread uses the demo agents or buddies
        setThreadTitle(title);
        setDemoMode(!conversations[newIndex].buddies);
      } else {
        if (newIndex > -1) {
          //Fetch conversation data when user is NOT logged in
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
          //Resets last good answer
          lastGoodAnswer.current = {
            answer: "",
            aggregate: false,
            statement: "",
            followUp: false,
            entryType: 1,
          };
          setThreadTitle(conversations[newIndex].title);
          setDemoMode(!conversations[newIndex].buddies);
        } else {
          console.error("Couldn't find index");
        }
      }
    }
    setShowSideTab(false);
  };

  //When the chatlog changes, scroll to the bottom
  useLayoutEffect(() => {
    var element = document.getElementById("chatlog");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [chatlog, loading, showWelcomeMessage]);

  useEffect(() => {
    if (section === sections.CHAT) {
      //When the user returns to the chat section, reset the agentKnowledgeUpload state
      setAgentKnowledgeUpload("");
    }
  }, [section]);

  /**
   * Function to (un)bookmark the message in the chatlog
   * @param {number} index - The index of the selected message in the chatlog.
   * @param {boolean} add - Whether to bookmark or unbookmark the message.
   * @param {number} time - The time the message was sent/retrived which corresponds to its ID.
   */
  const bookmarkMessage = ({ index, add, time }) => {
    //Update the bookmark flag within the conversation state
    setChatlog(
      chatlog.map((c, i) => {
        if (i == index) {
          return {
            ...c,
            bookmark: !c.bookmark,
          };
        }
        return c;
      })
    );
    if (add) {
      //Add bookmark
      setBookmarks({
        ...bookmarks,
        [conversationID]: bookmarks[conversationID]
          ? [...bookmarks[conversationID], time]
          : [time],
      });
    } else {
      if (bookmarks[conversationID].length > 1) {
        //Remove bookmark from array
        const index = bookmarks[conversationID].indexOf(time);
        if (index > -1) {
          var copyArray = bookmarks[conversationID];
          setBookmarks({
            ...bookmarks,
            [conversationID]: copyArray.splice(index, 1),
          });
        }
      } else {
        //Delete thread array from bookmarks object if there are no longer any bookmarks left
        var copyObj = bookmarks;
        delete copyObj[conversationID];
        setBookmarks(copyObj);
      }
    }
  };

  /**
   * Function to send the prompt to the correct processing function.
   * @param {string} prompt - The prompt statement to retrive an answer for.
   */
  const sendPrompt = async (prompt) => {
    if (demoMode === true) {
      await getResponse(prompt);
    } else {
      await getChunks(prompt.trim());
    }
  };

  return (
    <>
      <UIContext.Provider
        value={{
          isLargerThanMD,
          boxRef,
          expandSideTab,
          sideTabScreen,
          scrollToAgent,
          section,
          setSection,
          onSideBarOpen,
          setSidebarScreen,
          onSharingOpen,
          setSideTabScreen,
          onDeleteOpen,
          onLogInOpen,
          onOnboardingOpen,
          setExpandedAgent,
          setShowSideTab,
          showSideTab,
          expandedAgent,
          isDrawerOpen,
          onDrawerClose,
          onUploadOpen,
          setScrollToAgent,
          setExpandSideTab,
          onSideBarClose,
        }}
      >
        <AuthContext.Provider
          value={{
            loggedIn,
            details,
            onboarding,
            initializing,
            userID,
          }}
        >
          <ConvoContext.Provider
            value={{
              questionsUsed,
              conversations,
              fetchingConversation,
              loading,
              changeConversation,
              conversationID,
              bookmarks,
              setBookmarks,
              setConversations,
              demoMode,
              setDemoMode,
              selectedAvatar,
              aIName,
              setAIName,
              mute,
              setMute,
              clearChat,
              userID,
              threadTitle,
              chatlog,
              setBookmarkedThread,
              bookmarkMessage,
              submitFeedback,
              language,
              voiceInputEnabled,
              sendPrompt,
              saving,
              bookmarkedThread,
              setAgentKnowledgeUpload,
              setIndexToUpload,
              baseBookmarkThreadObj,

              isUploadOpen,
              indexToUpload,
              onUploadClose,
            }}
          >
            <div style={{ margin: "" }}>
              <DataContext.Provider
                value={{
                  agents,
                  setAgents,
                  buddies,
                  setBuddies,
                  loggedIn,
                  isLargerThanMD,
                }}
              >
                <Flex flexDirection={"row"}>
                  {isLargerThanMD && <SideMenu />}

                  <Box width={"100%"}>
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
                                  avatars[
                                    Math.floor(Math.random() * avatars.length)
                                  ]
                                );
                                // initalMessage();
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
                              avatars[
                                Math.floor(Math.random() * avatars.length)
                              ]
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
                      placement={
                        sidebarScreen === sidebarScreens.MENU ? "left" : "right"
                      }
                      isOpen={isSideBarOpen}
                      onClose={onSideBarClose}
                      size={"xs"}
                    >
                      <DrawerOverlay />
                      <DrawerContent
                        backgroundColor={
                          sidebarScreen === sidebarScreens.MENU
                            ? "#1e1e23"
                            : "white"
                        }
                        width={"85%"}
                        padding={"16px"}
                      >
                        <DrawerCloseButton />
                        {sidebarScreen === sidebarScreens.THREADS && (
                          <ThreadsSidebar />
                        )}
                        {sidebarScreen === sidebarScreens.MENU && <SideMenu />}
                      </DrawerContent>
                    </Drawer>
                    <Flex
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "100vh",
                      }}
                    >
                      {section === sections.UPLOAD && (
                        <UploadSection
                          userID={userID}
                          defaultAgent={agentKnowledgeUpload}
                        />
                      )}
                      {section === sections.ABOUT && <About />}
                      {section === sections.CHAT && <ChatSection />}
                    </Flex>
                  </Box>
                </Flex>
              </DataContext.Provider>
            </div>
            <ToastContainer />
            <Container />
            <DeleteModal />
          </ConvoContext.Provider>
        </AuthContext.Provider>
      </UIContext.Provider>
    </>
  );
}

export default App;
