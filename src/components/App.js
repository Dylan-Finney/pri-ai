/* eslint-disable react/no-unescaped-entities */
import { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import axios from "axios"
import "@/styles/App.module.css"
import { CgSlack } from 'react-icons/cg';
import NextImage from "next/image";
import {TbSend,TbEdit} from 'react-icons/tb'; 
import {RiDeleteBin6Line, RiLoginCircleLine} from 'react-icons/ri'; 

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


export const Context = createContext();

export const AppContext = createContext();
export const UserContext = createContext();

function App() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [audio, setAudio] = useState(null);
  const { ToastContainer, toast } = createStandaloneToast()

  useEffect(() => {
    setAudio(new Audio('/sounds/new_message.wav'))
  // only run once on the first render on the client
  }, [])
  const [details, setDetails] = useState({
    name: null,
    dayDOB: null,
    monthDOB: null,
    yearDOB: null,
    country: "United States",
    region: "California",
    job: null,
    email: null
  })

  const clearChat = () => {
    setChatlog([]);
    setPrompt("");
    setShowWelcomeMessage(false);
  }
  const  {isOpen: isSideBarOpen, onOpen: onSideBarOpen, onClose: onSideBarClose} = useDisclosure()
  const  {isOpen: isOnboardingOpen, onOpen: onOnboardingOpen, onClose: onOnboardingClose} = useDisclosure()
  const [chatlog,setChatlog] = useState([])
  const [userID, setUserID] = useState("")
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
  const [isLargerThanSM] = useMediaQuery("(min-width: 30em)");
  
  useEffect(() => {
    // close the Drawer when screen size is smaller than md
    if (isLargerThanSM) {
      onSideBarClose()
    }
  }, [isLargerThanSM, onSideBarClose]);
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
  const getResponse = async () => {
    var promptSent = Date.now()
    
    setLoading(true)
    try{
      const responseAPI = await axios({
        method: "POST",
        url: "/api/chat",
        data: {
          "persona":{
              "name": details.name,
              "dob": `${details.monthDOB}-${details.dayDOB}-${details.yearDOB}`,
              "email": details.email,
              "job": details.job,
              "country": details.country,
              "region": details.region,
          },
          "chatlog": chatlog,
          "prompt": prompt
      }
      })
      if (responseAPI.data.response){
        setChatlog([].concat(chatlog,{prompt:{text: prompt, time: promptSent}, response: {text: responseAPI.data.response.text, time: Date.now()}}))
        setLoading(false)
        setQuestionsUsed(questionsUsed+1)
        setPrompt("")
        audio.play();
        try{
          const responseStore = await axios({
            method: "POST",
            url: "/api/save",
            data: {
              "newUser": questionsUsed === 0 ? true : false,
              "userID": userID, 
              "prompt": prompt
          }
          })
          if (responseStore.data.userID){
            setUserID(responseStore.data.userID)
          }
        } catch(e){
          console.error("Failure to save response")
        }
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
  

  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const initalMessage = async () => {
     await sleep(2000)
     setLoginTime(Date.now())
     setShowWelcomeMessage(true)
     audio.play();
     await sleep(2000)
     setShowWelcomeOneMoreMessage(true)
     audio.play();
  }

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
                <AppContext.Provider value={[apps, chosenApps, (app)=>{setChosenApps([...chosenApps, app.name])}, (app)=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}]}>
                  <OnboardingModal isOpen={isOnboardingOpen} onClose={onOnboardingClose} onOpen={onOnboardingOpen} onFinish={()=>{setOnboarding(false);initalMessage();}} />
                </AppContext.Provider>
              </UserContext.Provider>
            </>
          ) : (
            <>
            </>
          )
        }
        

          <Drawer placement={"left"} isOpen={isSideBarOpen} onClose={onSideBarClose} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent width={"85%"} padding={"16px"}>
            <DrawerCloseButton />
            <Sidebar section={section} name={details.name} questionsUsed={questionsUsed} changeSection={setSection} clear={clearChat}/>
          </DrawerContent>
          </Drawer>
          <div style={{display:"flex", flexDirection:"row", height: "100vh"}}>
            <Sidebar display={{base: "none", sm: "flex"}} section={section} name={details.name} questionsUsed={questionsUsed} changeSection={setSection}/>
            <div style={{flexDirection:"column", minWidth: "80.5%", width: "100%", display: "flex"}}>

            <Box flexGrow={0.5} style={{display:"flex", flexDirection:"row", alignItems: "center", paddingLeft: "1rem", marginTop: "10px", marginBottom: "10px"}}>
              <Box display={{base: "none", sm:"flex"}} width={"100%"} height={"100%"} alignItems={"center"}>
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
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} onClick={()=>{clearChat()}}>Clear chat <RiDeleteBin6Line/></Button>
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#0e9384"} color={"#FFFFFF"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community<CgSlack/></Button>
              <Button marginRight={"1rem"} size='sm'  color={"#107569"} variant={'ghost'} >Share <Box marginLeft={"5px"} width={"20px"} height={"20px"}><NextImage width={100} height={100} alit="Share Icon" src={share} /></Box></Button>
              </Box>
              <Box display={{base: "flex", sm:"none"}} flexDirection={"row"} width={"100%"} alignItems={"center"}>
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
                          <Button width={"fit-content"} backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} marginRight={"8px"}>Exit Demo</Button>
                          <Button width={"fit-content"} color={"#FFFFFF"} backgroundColor={"#0E9384"} marginLeft={"8px"} onClick={()=>{onOnboardingOpen()}}><RiLoginCircleLine size={"1.3em"} style={{transform: 'rotate(315deg)' }} />Onboarding</Button>
                        </div>
                        </>
                      ) : (
                        <>
                        <div style={{marginTop:"auto"}}/>
                    {
                      showWelcomeMessage ? (
                        <>
                          <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={{text: `👋 Welcome to the Private Al demo by Prifina!
This demo is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers.
In addition, this demo utilizes application interfaces to interact with your applications and other external services, which means it can not only answer any question you may have, but it can also take any action you ask it to do. 
We've also customized this demo based on the personalization details you provided, so you can expect more relevant and personalized responses. 
So, go ahead and ask your first question! We're excited to show you how our Private Al demo can provide you with realistic answers and help simplify your life. `, time: loginTime}} feedback={false}/>
                          {showWelcomeOneMoreMessage?(
                            <>
                              <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={{text: `☝️Oh, One more thing before you get started. For this Demo, each session is limited 10 questions, you can see your question count in the navigation menu.
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
                            
                            <ChatResponse aIName={aIName} selectedAvatar={selectedAvatar} response={exchange.response}/>
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

                  <Flex flexGrow={2.5} padding={"10px"} borderTop={"2px solid #eeeff2"} minWidth='max-content' alignItems='center' >
                      <Textarea marginLeft={"3%"} width={"85%"} rows={1} resize={"none"} value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} placeholder='Here is a sample placeholder' onKeyDown={async (event)=>{if(event.key==="Shift"&&!shiftDown){setShiftDown(true)}else if (event.key === "Enter"&&!shiftDown){event.preventDefault;await getResponse()}}} onKeyUp={async (event)=>{if(event.key==="Shift"){setShiftDown(false)}}} isDisabled={loading||onboarding||questionsUsed>=10} autoFocus={true} />
                      <Button marginLeft={"1%"} marginRight={"auto"} backgroundColor={"#0e9384"} paddingLeft={"auto"} paddingRight={"auto"} type={'submit'} onClick={async ()=>{await getResponse()}} isDisabled={loading||onboarding||questionsUsed>=10}><TbSend size={"1.3em"} color={"#FFFFFF"}/></Button>
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
