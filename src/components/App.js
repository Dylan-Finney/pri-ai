/* eslint-disable react/no-unescaped-entities */
import { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import axios from "axios"
import "@/styles/App.module.css"
import { CgSlack } from 'react-icons/cg';
import NextImage from "next/image";
import {TbSend,TbEdit} from 'react-icons/tb'; 
import {RiDeleteBin6Line, RiLoginCircleLine} from 'react-icons/ri'; 
import {HiMicrophone, HiStop} from 'react-icons/hi'; 
import {GoMute, GoUnmute} from 'react-icons/go'; 
const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");

// import US from "../assets/country/US.svg"

const Illustration = "/assets/Illustration.svg"

const logo = "/assets/logo.svg"

const share = "/assets/share.svg"


import {CheckIcon, CloseIcon, HamburgerIcon} from "@chakra-ui/icons"

import Sidebar from './Sidebar';
import About from './About';
import ChatResponse from './ChatResponse';
import ChatPrompt from './ChatPrompt';

import OnboardingModal from './Onboarding/OnboardingModal';
const {Input,useMediaQuery, Flex, TagLabel, Tag, Textarea, Button, useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,Icon,ModalBody,Lorem,ModalFooter, Spinner,Text, Spacer, Box, SimpleGrid, Tooltip, Progress, ChakraProvider, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, UnorderedList, ListItem, Editable, EditablePreview, EditableInput, useEditableControls, ButtonGroup, IconButton, CheckboxIcon, FormErrorMessage, DrawerOverlay, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, Image, FormControl, useToast    } = require("@chakra-ui/react")
import { createStandaloneToast } from '@chakra-ui/toast'
import { errorToasts } from './Toast';
import { Chatlog } from './Chatlog';
import { Sharing } from './Sharing';


export const Context = createContext();

export const AppContext = createContext();
export const UserContext = createContext();

function PromptInput(props){
  const [prompt, setPrompt] = useState("")
  const [mic, setMic] = useState(false);
  const [shiftDown, setShiftDown] = useState(false)
  const speech = useRef("");
  useEffect(() => {
    let recognition;
      if (mic) {
        // console.log("RECORDING ",);
        const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        // does this support all browser languages?
        recognition.lang = props.language;
        recognition.continuous = true;
        recognition.interimResults = true;
        var before = prompt;
        var final_transcript = '';
        recognition.onresult = (event) => {
          var interim_transcript = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          final_transcript = final_transcript.charAt(0).toUpperCase() + final_transcript.slice(1)
          if (interim_transcript === ""){
            setPrompt(`${before}${final_transcript}. `)
            setMic(false)
          } else {
            setPrompt(`${before}${final_transcript}${interim_transcript}`)
          }
          // console.log("final_transcript", final_transcript);
          // console.log("interim_transcript",interim_transcript);

          // setMic(false);
        }

        recognition.start();
      } else {
        
        if (speech.current !== "") {
          recognition.stop();  //recording stops automatically....
        }
      }
    }, [mic])
  return (
    <>
      <Textarea marginLeft={"3%"} width={"85%"} rows={1} resize={"none"} value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} placeholder='Ex: What is in my calendar for tomorrow?' onKeyDown={async (event)=>{if(event.key==="Shift"&&!shiftDown){setShiftDown(true)}else if (event.key === "Enter"&&!shiftDown){event.preventDefault;setPrompt("");await props.send(prompt)}}} onKeyUp={async (event)=>{if(event.key==="Shift"){setShiftDown(false)}}} isDisabled={props.sendDisabled} autoFocus={true} />
      <Tooltip textAlign={"center"} label={`${props.voiceDisabled ? "Browser not supported. Try Google Chrome or Microsoft Edge." :  ""}`}>
        <Button width={"fit-content"} color={"#FFFFFF"} backgroundColor={"#0E9384"} marginLeft={"8px"} onClick={()=>{setMic(!mic)}} isDisabled={props.sendDisabled||props.voiceDisabled}>{mic ? <HiStop size={"1.3em"}/> : <HiMicrophone size={"1.3em"}/>}</Button>
      </Tooltip>
      <Button marginLeft={"1%"} marginRight={"auto"} backgroundColor={"#0e9384"} paddingLeft={"auto"} paddingRight={"auto"} type={'submit'} onClick={async ()=>{setPrompt("");await props.send(prompt)}} isDisabled={props.sendDisabled||props.saving}><TbSend size={"1.3em"} color={"#FFFFFF"}/></Button>
    </>
  )
}

function App() {
  //Speech Recongition
  
  const [usrlang, setUsrlang] = useState(null);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);
  const [language, setLanguage] = useState(usrlang);
  const [sourceNodes, setSourceNodes] = useState([]);
  const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
  const audioCtx = useRef(null)
  const [mute, setMute] = useState(false)
  



  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [audio, setAudio] = useState(null);
  const { ToastContainer, toast } = createStandaloneToast()

  useEffect(() => {
    var newAudio = new Audio('/sounds/new_message.wav')
    newAudio.volume = 0.05
    setAudio(newAudio)
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    setVoiceInputEnabled(window.SpeechRecognition !== undefined)
    setLanguage(navigator.language || navigator.userLanguage);
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx.current = new AudioContext();
  // only run once on the first render on the client
  }, [])
  const [details, setDetails] = useState({
    name: null,
    country: "United States",
    region: "California",
    job: null,
    email: null
  })

  const clearChat = () => {
    setChatlog([]);
    setPrompt("");
    sourceNodes.map((sourceNode) => {
      sourceNode.disconnect(audioCtx.current.destination)
    })
    sourceNodes.length=0
    setShowWelcomeMessage(false);
  }

  useEffect(()=>{
    if (mute){
      if(audio !== null)[
        audio.muted = true
      ]
      sourceNodes.map((sourceNode) => {
        sourceNode.disconnect(audioCtx.current.destination)
      })
      sourceNodes.length=0

    } else {
      if(audio !== null)[
        audio.muted = false
      ]
    }
  }, [mute])
  const  {isOpen: isSideBarOpen, onOpen: onSideBarOpen, onClose: onSideBarClose} = useDisclosure()
  const  {isOpen: isOnboardingOpen, onOpen: onOnboardingOpen, onClose: onOnboardingClose} = useDisclosure()
  const  {isOpen: isSharingOpen, onOpen: onSharingOpen, onClose: onSharingClose} = useDisclosure()
  
  //Example exchange {id: "clfb3uecq3npo0bmrzk3mx114", prompt: {text: "Test Prompt", time: 1679068112}, response: {text: "Test Response", time: 1679068112, helpful: null}}
  const [chatlog,setChatlog] = useState([])
  const [userID, setUserID] = useState("")
  const [saving, setSaving] = useState(false)
  const [section,setSection] = useState("chat")
  const [shiftDown, setShiftDown] = useState(false)
  const [onboarding,setOnboarding] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [showWelcomeOneMoreMessage, setShowWelcomeOneMoreMessage] = useState(false)
  const [aIName, setAIName] = useState(null)
  const [chosenApps, setChosenApps] = useState([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [loginTime, setLoginTime] = useState(Date.now())
  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  
  useEffect(() => {
    // close the Drawer when screen size is smaller than md
    if (isLargerThanMD) {
      onSideBarClose()
    }
  }, [isLargerThanMD, onSideBarClose]);
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<CheckIcon/>} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon/>} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent='center'>
        <IconButton size='sm' icon={<TbEdit size="1.5em"/>} {...getEditButtonProps()} />
      </Flex>
    )
  }
  const getResponse = async (prompt) => {
    var promptSent = Date.now()
    
    setLoading(true)
    try{
      const [responseAPI, responseCategory] = await Promise.all([
        axios({
          method: "POST",
          url: "/api/chat",
          data: {
            "persona":{
                "name": details.name || "",
                "email": details.email || "",
                "job": details.job || "",
                "country": details.country || "",
                "region": details.region || "",
            },
            "chatlog": chatlog,
            "prompt": prompt
        }
        }),
        axios({
          method: "POST",
          url: "/api/categorize",
          data: {
            "prompt": prompt
        }
        }),
      ])
      if (responseAPI.data.response){
        //Needs Validation error such that it doesn't break
        try {
          if (!mute){
            await enqueueAudioFile(await speakText(responseAPI.data.response.text, language))
          }
        } catch(e){

        }
        
        setSaving(true)
        setLoading(false)
        setQuestionsUsed(questionsUsed+1)
        setPrompt("")
        setChatlog([].concat(chatlog,{prompt:{text: prompt, time: promptSent}, response: {text: responseAPI.data.response.text, time: Date.now()}}))
        // audio.play();
        try{
          const responseStore = await axios({
            method: "POST",
            url: "/api/save",
            data: {
              "newUser": questionsUsed === 0 ? true : false,
              "questionsUsed": questionsUsed,
              "userID": userID, 
              "prompt": prompt,
              "response": responseAPI.data.response.text,
              "details": details,
              "chosenApps": chosenApps,
              "category": responseCategory.data.response.text
          }
          })
          if (responseStore.data.userID){
            setUserID(responseStore.data.userID)
          }
          setChatlog([].concat(chatlog,{id: questionsUsed, prompt:{text: prompt, time: promptSent}, response: {text: responseAPI.data.response.text, time: Date.now()}}))
        } catch(e){
          console.error("Failure to save response")
        }
        setSaving(false)
      } 
      return responseAPI
    } catch(e){
      console.log("Failure to get response")
      setPrompt("")
      setLoading(false)
      errorToasts({error: e.response.data.error})
      return e
    }
  }
  const apps = [{"name": "23andMe", "tags": ["Misc"]},{"name": "Airbnb", "tags": ["Misc"]},{"name": "Amazon", "tags": ["Misc"]},{"name": "Ancestry", "tags": ["Misc"]}, {"name": "Apple Health", "tags": ["Health"]}, {"name": "Bosch", "tags": ["Health"]}, {"name": "Doordash", "tags": ["Misc"]}, {"name": "Evernote", "tags": ["Misc"]}, {"name": "Facebook", "tags": ["Social"]}, {"name": "Fitbit", "tags": ["Health"]}, {"name": "Google Calendar", "tags": ["Misc"]}, {"name": "Google Maps", "tags": ["Transport"]}, {"name": "Google", "tags": ["Misc"]}, {"name": "Instacart", "tags": ["Misc"]}, {"name": "Instagram", "tags": ["Social"]}, {"name": "iTunes", "tags": ["Social"]}, {"name": "Linkedin", "tags": ["Social"]}, {"name": "Lyft", "tags": ["Transport"]}, {"name": "Maps", "tags": ["Transport"]}, {"name": "Medium", "tags": ["Social"]}, {"name": "Netflix", "tags": ["Social"]}, {"name": "Notion", "tags": ["Misc"]}, {"name": "Oura", "tags": ["Health"]}, {"name": "Peloton", "tags": ["Health"]}, {"name": "Polar", "tags": ["Health"]}, {"name": "Prime Video", "tags": ["Social"]}, {"name": "Reddit", "tags": ["Social"]}, {"name": "Runkeeper", "tags": ["Health"]}, {"name": "Snapchat", "tags": ["Social"]}, {"name": "Spotify", "tags": ["Social"]}, {"name": "Strava", "tags": ["Health"]}, {"name": "Suunto", "tags": ["Health"]}, {"name": "Tiktok", "tags": ["Social"]}, {"name": "Tripadvisor", "tags": ["Misc"]}, {"name": "Twitch", "tags": ["Social"]}, {"name": "Twitter", "tags": ["Social"]}, {"name": "Uber Eats", "tags": ["Misc"]}, {"name": "Uber", "tags": ["Transport"]}, {"name": "Waze", "tags": ["Transport"]}, {"name": "Withings", "tags": ["Health"]}, {"name": "Youtube", "tags": ["Social"]}]
  

  const submitFeedback = async (id, helpful, details, index) => {
    try {
      const responseFeedback = await axios({
        method: "POST",
        url: "/api/feedback",
        data: {
          "id": id,
          "userID": userID, 
          "helpful": helpful,
          "details": details
      }
      })
      let chatlogTemp = [...chatlog]; 
      chatlogTemp[index] = {prompt:{...chatlogTemp[index].prompt},response:{...chatlogTemp[index].response, helpful}}; 
      setChatlog([...chatlogTemp]);
    } catch(e) {
      console.error("Failure to save feedback")
    }
  }

  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function enqueueAudioFile(audioFileUrl) {
    // fetch the audio file and decode it
    if (!mute){
      await fetch(audioFileUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioCtx.current.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        // create a new AudioBufferSourceNode for the audio file
        const sourceNode = audioCtx.current.createBufferSource();
  
        // set the audio buffer as the source node's buffer
        sourceNode.buffer = audioBuffer;
  
        // connect the source node to the previous source node in the array, or the audio context's destination (i.e., speakers) if this is the first file
        // if (sourceNodes.length > 0) {
          // sourceNode.connect(sourceNodes[sourceNodes.length - 1]);
        // } else {
          sourceNode.connect(audioCtx.current.destination);
        // }
  
        // set the onended event to play the next file in the queue when this file is finished playing
        sourceNode.onended = function() {
          // remove this source node from the array
          sourceNodes.splice(sourceNodes.indexOf(sourceNode), 1);

          // console.log("onended")
  
          // if there are more source nodes in the array, start playing the next one
          if (sourceNodes.length > 0) {
            sourceNodes[0].start();
          }
        };
  
        // add the new source node to the array
        sourceNodes.push(sourceNode);
  
        // if this is the only source node in the array, start playing it
        if (sourceNodes.length === 1) {
          sourceNode.start();
        }
      });
    }
    
  }

  async function speakText(speak, lng) {
    try {
      if (!mute) {
        const responseAPI = await axios({
          method: "POST",
          url: "/api/audio",
          data: {
            speak, 
            lng
        }
        })
        return responseAPI.data.url
      }
    } catch (err) {
      console.error("Can't get TTS");
    }
  };

  const initalMessage = async () => {
    await sleep(2000)
    setLoginTime(Date.now())
    setShowWelcomeMessage(true)
    audio.play();
    await sleep(2000)
    setShowWelcomeOneMoreMessage(true)
    audio.play();
  }
  





  //Load up onboaridng on load
  const useMountEffect = (fun) => useEffect(fun, [])
  useMountEffect(() => {
    onOnboardingOpen();
  }) 

  useLayoutEffect(()=>{
    var element = document.getElementById('chatlog');
    element.scrollTop = element.scrollHeight;
  },[chatlog, loading, showWelcomeMessage, showWelcomeOneMoreMessage])
  return (
      <>
      <div style={{margin: ""}}>
        
      <>
        {
          onboarding ? (
            <>
              <UserContext.Provider value={[aIName, (name) =>{setAIName(name)}, details, (name) =>{setDetails(name)}, selectedAvatar, (name) =>{setSelectedAvatar(name)}]}>
                <AppContext.Provider value={[apps, (apps)=>{setChosenApps(apps)}]}>
                  <OnboardingModal isOpen={isOnboardingOpen} onClose={onOnboardingClose} onOpen={onOnboardingOpen} onFinish={()=>{setOnboarding(false);setAIName(`${details.name}'s Personal Assistant`); setSelectedAvatar(avatars[Math.floor(Math.random() * avatars.length)]);initalMessage();}} />
                </AppContext.Provider>
              </UserContext.Provider>
            </>
          ) : (
            <>
            </>
          )
        }
        <Sharing isOpen={isSharingOpen} onClose={onSharingClose} onOpen={onSharingOpen} isLargerThanMD={isLargerThanMD}/>

          <Drawer placement={"left"} isOpen={isSideBarOpen} onClose={onSideBarClose} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent width={"85%"} padding={"16px"}>
            <DrawerCloseButton />
            <Sidebar section={section} name={details.name} questionsUsed={questionsUsed} changeSection={setSection} clear={clearChat} share={()=>{onSharingOpen()}} mute={mute} setMute={()=>{setMute(!mute)}}/>
          </DrawerContent>
          </Drawer>
          <div style={{display:"flex", flexDirection:"row", height: "100vh"}}>
            <Sidebar display={{base: "none", md: "flex"}} section={section} name={details.name} questionsUsed={questionsUsed} changeSection={setSection}/>
            <div style={{flexDirection:"column", minWidth: "80.5%", width: "100%", display: "flex"}}>

            <Box style={{display:"flex", flexDirection:"row", alignItems: "center", paddingLeft: "1rem", marginTop: "10px", marginBottom: "10px"}}>
              <Box display={{base: "none", md:"flex"}} width={"100%"} height={"100%"} alignItems={"center"}>
              {
                selectedAvatar === null || onboarding ? (
                  <>
                  </>
                ) : (
                  <>
                    <div style={{flex: "none", order: "0", flexGrow: "0", position: "relative"}}>
                    <Box style={{width: "40px", height: "40px"}}>
                      <NextImage 
                        src={`/assets/avatar/${selectedAvatar}`}
                        alt="Avatar"
                        width={100}
                        height={100}
                      />
                    </Box>
                    <div style={{background: "#12B76A", border: "2.5px solid #FFFFFF", borderRadius: "10px", width: "15px", height: "15px", position: "absolute",right: "0px", bottom: "0px"}}/>
                    </div>
                    <Editable
                      textAlign='center'
                      alignItems='center'
                      display={"flex"}
                      flexDirection={"row"}
                      defaultValue={aIName}
                      onSubmit={(newValue)=>{setAIName(newValue)}}
                      as={"b"}
                      marginLeft={"0.5rem"}
                      marginRight={"0.5rem"}
                      isPreviewFocusable={false}
                      submitOnBlur={false}
                    >
                      <EditablePreview width={"fit-content"} marginRight={"0.5rem"}/>
                      {/* Here is the custom input */}
                      <Input as={EditableInput} width={"fit-content"} marginRight={"0.5rem"}/>
                      <EditableControls />
                    </Editable>
                    {/* <Text as="b" borderRadius={"25px"} paddingLeft={"1rem"} paddingRight={"1rem"} height={"fit-content"} paddingBottom={"0rem"} color={"#027948"} backgroundColor={"#ecfdf3"}><span style={{height: "5px",  width: "5px","background-color": "#12b76a","border-radius": "50%", display: "inline-block", marginBottom: "3px"}}/> Online</Text> */}
                  </>
                  
                  
                )
              }
              {/* <Text marginLeft={"0.5rem"} as='b'>{aIName}</Text><TbEdit size="1.5em"style={{ display: 'inline-block' }}/> */}
              
              
              
              <Spacer/>
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} onClick={()=>{setMute(!mute)}}>{mute ? <>Unmute <Box marginLeft={"5px"}><GoMute size={16}/></Box></> : <>Mute <Box marginLeft={"5px"}><GoUnmute size={16}/></Box></>}</Button>
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} onClick={()=>{clearChat()}}>Clear chat <Box marginLeft={"5px"}><RiDeleteBin6Line size={16}/></Box></Button>
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#0e9384"} color={"#FFFFFF"} width={"fit-content"} minWidth={"152px"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}><Text>Join the community</Text><Box marginLeft={"5px"}><CgSlack size={16}/></Box></Button>
              <Button marginRight={"1rem"} size='sm'  color={"#107569"} variant={'ghost'} onClick={()=>{onSharingOpen()}}>Share <Box marginLeft={"5px"} minWidth={"16px"} width={"20px"} height={"20px"}><NextImage width={100} height={100} alt="Share Icon" src={share} /></Box></Button>
              </Box>
              <Box display={{base: "flex", md:"none"}} flexDirection={"row"} width={"100%"} alignItems={"center"}>
                <Box style={{ width: "32px", height: "33px", display: 'inline-block', filter: "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))" }}>
                      <NextImage 
                        src={logo}
                        alt="Logo"
                        width={100}
                        height={100}
                      />
                </Box>
                <Text paddingLeft={"10px"} color='#0E9384' fontWeight="700" fontSize={"20px"}>Pri-AI</Text>
                <Spacer/>
                <IconButton icon={<HamburgerIcon/>} marginRight={"1rem"} onClick={onSideBarOpen}/>
              </Box>
            </Box>
            {
              section === "about" ? (
                <>
                  <About/>
                </> 
              ) : (
                <>
                  <Chatlog onboarding={onboarding}>
                    {
                      onboarding ? (
                        <>
                        <Box style={{ width: "220px", height: "160px"}}>
                          <NextImage 
                            src={Illustration}
                            alt="Illustration"
                            width={220}
                            height={100}
                          />
                        </Box>
                        <Text as="b" fontSize='lg'>Finish Setting up your AI</Text>
                        <Text maxWidth={"38%"} color="#475467">To work properly your AI needs to know more about you. Complete the onboarding to continue.</Text>
                        <div>
                          <Button width={"fit-content"} backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} marginRight={"8px"} onClick={()=>{window.open("https://beta.prifina.com/priai.html" , "_self")}}>Exit Demo</Button>
                          <Button width={"fit-content"} color={"#FFFFFF"} backgroundColor={"#0E9384"} marginLeft={"8px"} onClick={()=>{onOnboardingOpen()}}><RiLoginCircleLine size={"1.3em"} style={{transform: 'rotate(315deg)' }} />Onboarding</Button>
                        </div>
                        </>
                      ) : (
                        <>
                        <div style={{marginTop:"auto"}}/>
                    {
                      showWelcomeMessage ? (
                        <>
                          <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={{text: `👋 Welcome to the Private AI demo by Prifina!
This demo is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers.
In addition, this demo utilizes application interfaces to interact with your applications and other external services, which means it can not only answer any question you may have, but it can also take any action you ask it to do. 
We've also customized this demo based on the personalization details you provided, so you can expect more relevant and personalized responses. 
So, go ahead and ask your first question! We're excited to show you how our Private Al demo can provide you with realistic answers and help simplify your life. `, time: loginTime}} feedback={false}/>
                          {showWelcomeOneMoreMessage?(
                            <>
                              <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={{text: `☝️Oh, One more thing before you get started. For this Demo, each session is limited to 10 questions, you can see your question count in the navigation menu.
Ok, go ahead and ask your first question! We're excited to show you how our Private AI demo can provide you with realistic answers and help simplify your life.`, time: loginTime}} feedback={false}/>
                            </>
                          ) : (
                            <>
                            </>
                          )}
                          </>
                        ): (
                          <></>
                        )
                      }
                      
                    
                      {
                      chatlog.map((exchange, index)=>{
                        return (
                          <>
                            <ChatPrompt name={details.name} prompt={exchange.prompt}/>
                            
                            <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={exchange.response} saving={saving} submitFeedback={(helpful, details)=>{submitFeedback(exchange.id, helpful, details, index)}}/>
                          </>
                      )
                      })
                      }
                      {loading?(
                        <>
                          <Box backgroundColor={"#FFFFFF"} width={"100%"} alignItems={"center"} justifyContent={"center"} padding={"10px"} display={"flex"}>
                            <Spacer/>
                            <Spinner/>
                            <Spacer/>

                          </Box>
                          
                        </>
                      ): (
                        <>
                        </>
                      )}
                      {
                        questionsUsed >= 10 ? (
                          <>
                            <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={{text: `Thank you for trying out our Pri-AI (personal AI) demo! We hope you found it helpful and informative.
If you enjoyed this experience, please share it with your friends and don’t forget to check back for updates!
Pri-AI is created with 💖 by the Prifina team. 
At Prifina, we're committed to empowering people with their personal data to live happier and healthier lives. Pri-AI is just one piece of the Prifina puzzle.
👉 Learn more about Prifina at https://www.prifina.com/
👉 Get involved while you wait for Pri-AI to launch by joining our Slack communityLiberty.Equality.Data.`,time:chatlog[questionsUsed-1].response.time}} end={true}/>
                          </>
                        ) : (
                          <>
                          </>
                        )
                      }
                        </>
                      )
                    }
                  
                  </Chatlog>

                  <Flex padding={"10px"} borderTop={"2px solid #eeeff2"} minWidth='max-content' alignItems='center' >
                      <PromptInput language={language} sendDisabled={loading||onboarding||questionsUsed>=10} voiceDisabled={!voiceInputEnabled} setPrompt={(temp)=>{setPrompt(temp)}} send={async (prompt)=>{await getResponse(prompt)}} saving={saving}/>
                  </Flex>
                </>
              )
            }
            </div>
          </div>
        </>
      </div>
      <ToastContainer />
      </>
  );
}

export default App;
