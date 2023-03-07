/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import axios from "axios"
import "@/styles/App.module.css"
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
// import ContactSupportIcon from '@mui/icons-material/ContactSupport';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { CgSlack } from 'react-icons/cg';
import ChakraNextImage from "./Image";
import { MdOutlineVerifiedUser,MdCheck,MdSearch } from 'react-icons/md';
import { BsQuestionOctagon } from 'react-icons/bs';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import {FaRegUserCircle} from 'react-icons/fa'; 
import {TbSend,TbEdit} from 'react-icons/tb'; 
import {RiCloseCircleFill, RiDeleteBin6Line, RiLoginCircleLine} from 'react-icons/ri'; 
import {FiExternalLink, FiThumbsUp, FiThumbsDown} from 'react-icons/fi'; 
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
// import US from "../assets/country/US.svg"
import {chat as ChatJS} from "./chat"
const logos = ["US.svg"]
const appIcons = ["23andme.svg",
  "airbnb.svg",
  "amazon.svg",
  "ancestry.svg",
  "appleHealth.svg",
  "bosch.svg",
  "doordash.svg",
  "evernote.svg",
  "facebook.svg",
  "fitbit.svg",
  "google-cal.svg",
  "google-maps.svg",
  "google.svg",
  "instacart.svg",
  "instagram.svg",
  "itunes.svg",
  "linkedin.svg",
  "lyft.svg",
  "maps.svg",
  "medium.svg",
  "movesense.svg",
  "netflix.svg",
  "notion.svg",
  "oura.svg",
  "peloton.svg",
  "polar.svg",
  "prime-video.svg",
  "reddit.svg",
  "runkeeper.svg",
  "snapchat.svg",
  "spotify.svg",
  "strava.svg",
  "suunto.svg",
  "tiktok.svg",
  "tripadvisor.svg",
  "twitch.svg",
  "twitter.svg",
  "uberEats.svg",
  "uber.svg",
  "waze.svg",
  "withings.svg",
  "youtube.svg",]
const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const Check = "/assets/check.svg"
const Illustration = "/assets/Illustration.svg"
const about = "/assets/about.svg"
const chat = "/assets/chat.svg"
const FAQ = "/assets/FAQ.svg"
const logo = "/assets/logo.svg"
const logout = "/assets/logout.svg"
const external = "/assets/external.svg"
const open = "/assets/open.svg"
const close = "/assets/close.svg"
const share = "/assets/share.svg"
const logoModal = "/assets/logo_modal.svg"
const yourselfModal = "/assets/yourself_modal.svg"
const trainModal = "/assets/train_modal.svg"
const privacyModal = "/assets/privacy_modal.svg"

import {CheckIcon, CloseIcon, HamburgerIcon} from "@chakra-ui/icons"
const { Configuration, OpenAIApi } = require("openai");
const {Input,useMediaQuery, Flex, TagLabel, Tag, Textarea, Button, useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,Icon,ModalBody,Lorem,ModalFooter, Spinner,Text, Spacer, Box, SimpleGrid, Tooltip, Progress, ChakraProvider, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, UnorderedList, ListItem, Editable, EditablePreview, EditableInput, useEditableControls, ButtonGroup, IconButton, CheckboxIcon, FormErrorMessage, DrawerOverlay, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, Image, FormControl    } = require("@chakra-ui/react")

function App() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState({
    name: false,
    age: false,
    location: false,
    job: false,
    marital: false
  })
  const [details, setDetails] = useState({
    name: null,
    dayDOB: null,
    monthDOB: null,
    yearDOB: null,
    country: null,
    region: null,
    job: null,
    email: null
  })
  const test = () => {
    if(Date.now()%2===0){return "gray"}else {return "red"}
  }
  const timeToString = (timestamp) => {
    var now = new Date(timestamp)
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var postfix = ""
    var hour = 0
    var minutes = ""
    switch(now.getHours()){
      case 23:
      case 22:
      case 21:
      case 20:
      case 19:
      case 18:
      case 17:
      case 16:
      case 15:
      case 14:
      case 13:
        postfix = "pm"
        hour =  now.getHours()-12
        break
      case 12:
        postfix = "pm"
        hour =  now.getHours()
        break
      case 11:
      case 10:
      case 9:
      case 8:
      case 7:
      case 6:
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
        postfix = "am"
        hour =  now.getHours()
        break
      case 0:
        postfix = "am"
        hour =  12
        break
      default:
        hour = 0
        postfix = "am"
    }
    switch(now.getMinutes()){
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        minutes = `0${now.getMinutes()}`
        break
      default:
        minutes = now.getMinutes()
        break
    }
    return `${weekday[now.getDay()]} ${hour}:${minutes}${postfix}`
  }
  const  {isOpen, onOpen, onClose} = useDisclosure()
  const  {isOpen: isSideBarOpen, onOpen: onSideBarOpen, onClose: onSideBarClose} = useDisclosure()
  const [chatlog,setChatlog] = useState([])
  const [section,setSection] = useState("chat")
  const [shiftDown, setShiftDown] = useState(false)
  const [setupScreen,setSetupScreen] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [showWelcomeOneMoreMessage, setShowWelcomeOneMoreMessage] = useState(false)
  const [aIName, setAIName] = useState(null)
  const [failedSubmit, setFailedSubmit] = useState(false)
  const [chosenTrainTab, setChosenTrainTab] = useState("Social")
  const [chosenApps, setChosenApps] = useState([])
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const [loginTime, setLoginTime] = useState(timeToString(Date.now()))
  const [isLargerThanSM] = useMediaQuery("(min-width: 30em)");
  
  useEffect(() => {
    // close the Drawer when screen size is smaller than md
    if (isLargerThanSM) {
      onSideBarClose()
    }
  }, [isLargerThanSM]);
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
      } 
      setQuestionsUsed(questionsUsed+1)
      setPrompt("")
      setLoading(false)
      var element = document.getElementById('chatlog');
      element.scrollTop = element.scrollHeight;
      return responseAPI
      

    } catch(e){

      setPrompt("")
      setLoading(false)
      return e
    }
    

    
    // const response = await openai.createCompletion({
    //   model: "text-curie-001", //text-curie-001 or text-davinci-003
    //   prompt: `
    //   ${chatlog.map((exchange)=>{
    //     return `
    //     Me: ${exchange.prompt}
    //     AI: ${exchange.response}`
    //   })}
    //   Me: ${prompt}
    //   AI: `,
    //   temperature: 0,
    //   max_tokens: 50,
    // });
  }
  const apps = [{"name": "23andMe", "tags": ["Misc"]},{"name": "Airbnb", "tags": ["Misc"]},{"name": "Amazon", "tags": ["Misc"]},{"name": "Ancestry", "tags": ["Misc"]}, {"name": "Apple Health", "tags": ["Health"]}, {"name": "Bosch", "tags": ["Health"]}, {"name": "Doordash", "tags": ["Misc"]}, {"name": "Evernote", "tags": ["Misc"]}, {"name": "Facebook", "tags": ["Social"]}, {"name": "Fitbit", "tags": ["Health"]}, {"name": "Google Calendar", "tags": ["Misc"]}, {"name": "Google Maps", "tags": ["Transport"]}, {"name": "Google", "tags": ["Misc"]}, {"name": "Instacart", "tags": ["Misc"]}, {"name": "Instagram", "tags": ["Social"]}, {"name": "iTunes", "tags": ["Social"]}, {"name": "Linkedin", "tags": ["Social"]}, {"name": "Lyft", "tags": ["Transport"]}, {"name": "Maps", "tags": ["Transport"]}, {"name": "Medium", "tags": ["Social"]}, {"name": "Netflix", "tags": ["Social"]}, {"name": "Notion", "tags": ["Misc"]}, {"name": "Oura", "tags": ["Health"]}, {"name": "Peloton", "tags": ["Health"]}, {"name": "Polar", "tags": ["Health"]}, {"name": "Prime Video", "tags": ["Social"]}, {"name": "Reddit", "tags": ["Social"]}, {"name": "Runkeeper", "tags": ["Health"]}, {"name": "Snapchat", "tags": ["Social"]}, {"name": "Spotify", "tags": ["Social"]}, {"name": "Strava", "tags": ["Health"]}, {"name": "Suunto", "tags": ["Health"]}, {"name": "Tiktok", "tags": ["Social"]}, {"name": "Tripadvisor", "tags": ["Misc"]}, {"name": "Twitch", "tags": ["Social"]}, {"name": "Twitter", "tags": ["Social"]}, {"name": "Uber Eats", "tags": ["Misc"]}, {"name": "Uber", "tags": ["Transport"]}, {"name": "Waze", "tags": ["Transport"]}, {"name": "Withings", "tags": ["Health"]}, {"name": "Youtube", "tags": ["Social"]}]
  
  const getCountryLogo = () => {
    switch(details.country){
      case "United States":
        return "US.svg"
      default:
        return ""
    }
  }

  const getAppLogo = (app) => {
    switch(app){
      case "23andMe":
        return "23andme.svg"
      case "Airbnb":
        return "airbnb.svg"
      case "Amazon":
        return "amazon.svg"
      case "Ancestry":
        return "ancestry.svg"
      case "Apple Health":
        return "apple-health.svg"
      case "Bosch":
        return "bosch.svg"
      case "Doordash":
        return "doordash.svg"
      case "Evernote":
        return "evernote.svg"
      case "Facebook":
        return "facebook.svg"
      case "Fitbit":
        return "fitbit.svg"
      case "Google Calendar":
        return "google-cal.svg"
      case "Google Maps":
        return "google-maps.svg"
      case "Google":
        return "google.svg"
      case "Instacart":
        return "instacart.svg"
      case "Instagram":
        return "instagram.svg"
      case "iTunes":
        return "itunes.svg"
      case "Linkedin":
        return "linkedin.svg"
      case "Lyft":
        return "lyft.svg"
      case "Maps":
        return "maps.svg"
      case "Medium":
        return "medium.svg"
      case "Movesense":
        return "movesense.svg"
      case "Netflix":
        return "netflix.svg"
      case "Notion":
        return "notion.svg"
      case "Oura":
        return "oura.svg"
      case "Peloton":
        return "peloton.svg"
      case "Polar":
        return "polar.svg"
      case "Prime Video":
        return "prime-video.svg"
      case "Reddit":
        return "reddit.svg"
      case "Runkeeper":
        return "runkeeper.svg"
      case "Snapchat":
        return "snapchat.svg"
      case "Spotify":
        return "spotify.svg"
      case "Strava":
        return "strava.svg"
      case "Suunto":
        return "suunto.svg"
      case "Tiktok":
        return "tiktok.svg"
      case "Tripadvisor":
        return "tripadvisor.svg"
      case "Twitch":
        return "twitch.svg"
      case "Twitter":
        return "twitter.svg"
      case "Uber Eats":
        return "uber-eats.svg"
      case "Uber":
        return "uber.svg"
      case "Waze":
        return "waze.svg"
      case "Withings":
        return "withings.svg"
      case "Youtube":
        return "youtube.svg"
      default:
        return ""
    }
  }

  
  

  const feedbackResponse = async (id, helpful) => {
    const responseAPI = await axios({
      method: "POST",
      url: "/api/feedback",
      data: {
        id: id,
        helpful: helpful
    }
    })
    console.log(responseAPI)
    const updateChatLog = chatlog.map((exchange)=>{
      if(exchange.response.id === id){
        return {...exchange, response: {id: id,text: exchange.response.text,helpful: helpful}}
      } 
      return exchange
    })
    setChatlog(updateChatLog)
  }
  // if (e.target.value.length<=40){

  // } else {

  // }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const initalMessage = async () => {
     await sleep(2000)
     setLoginTime(timeToString(Date.now()))
     setShowWelcomeMessage(true)
     await sleep(2000)
     setShowWelcomeOneMoreMessage(true)
  }
  return (
      <>
      <div style={{margin: "",minHeight: "100%"}}>
        
      <>
          {/* <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Privacy Warning</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
              Please be advised that this personal AI chat service may record and store the entire conversation history between you and the AI. The purpose of this recording is to improve the quality of the service and for research and development purposes. By using this service, you acknowledge and agree to the recording and storage of your conversation history. You also acknowledge that any details provided and any prompts entered hereafter will be sent to and processed by OpenAI. Please note that your personal information will be kept confidential and will not be disclosed to any other third party without your consent, except as required by law.
              <br/>
              If you have any concerns about the collection, use, or storage of your personal information, please do not use this service. If you have any questions or comments about our privacy policy or practices, please contact us.
              <br/>
              Thank you for using our personal AI chat service.
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Accept
                </Button>
                <Button colorScheme='red' onClick={()=>{setSetupScreen(!setupScreen);onClose()}}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal> */}
          <Modal closeOnOverlayClick={false} motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose} size={"full"}>
            <ModalOverlay />
            <ModalContent style={{borderRadius: "10px", border: "0px solid transparent"}} width={{base: "100%",sm:"85%"}} height={{base: "100%",sm:"5%"}} minHeight={{base: "100%",sm:"98vh"}} marginTop={{base: "0vh",sm:"1vh"}} padding={{base: "16px", sm: "0px"}}>
              <ModalCloseButton onClick={()=>{setOnboardingStep(0)}} />
              <div style={{display: "flex", flexDirection: "row", "height": "100%"}}>
                {/* Left Screen of Modal */}
                <Box display={{base: "none", sm: "block"}} style={{backgroundColor:"#F9FAFB", flex: 2, "max-height": "100%", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: "10px solid transparent"}}>
                  <div style={{display: "flex", flexDirection: "row",  justifyContent: "center", "alignItems": "center", marginTop: "auto", height: "100%"}}> 
                  
                  
                  <div style={{display: "flex", flexDirection: "column"}}>
                 
                  {
                    onboardingStep === 0 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Your personal AI</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>Give your AI a name and face</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Your personal AI</Text>
                      <Text marginBottom={"2vh"}>Give your AI a name and face.</Text>
                      </div>
                      </div>
                      </>
                    )
                  }
                  {
                    onboardingStep === 1 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Personalize your experience</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                      onboardingStep === 0? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Personalize your experience</Text>
                      <Text marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Personalize your experience</Text>
                      <Text marginBottom={"2vh"}>A few details about yourself</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  {
                    onboardingStep === 2 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Train your AI</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                      onboardingStep < 2? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#EAECF0"}}/>
                      </div>

                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Train your AI</Text>
                      <Text marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center"}}>
                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>
                      <div style={{width:"2px", height: "46px", background: "#0E9384"}}/>
                      </div>
                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Train your AI</Text>
                      <Text marginBottom={"2vh"}>Connect data to train your AI</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  {
                    onboardingStep ===  3 ? (
                      <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#0E9384", "border-radius": "15px"}}/>
                        </div>
                      </div>


                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"} color={"#107569"}>Privacy disclaimer</Text>
                      <Text color={"#0E9384"} marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                    ) : (
                      onboardingStep < 3? (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F9FAFB", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F9FAFB", "border": "2.5px solid #EAECF0", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "15px"}}/>
                        </div>
                      </div>


                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Privacy disclaimer</Text>
                      <Text marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                      ) : (
                        <>
                      <div style={{"display": "flex", "flexDirection": "row"}}>

                      <div style={{"background": "#F0FDF9", width: "35px", height: "35px","border-radius": "35px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                        <div style={{"boxSizing": "border-box", "background": "#F0FDF9", "border": "2.5px solid #0E9384", "border-radius": "80px", width: "30px",height: "30px", justifyContent: "center", "alignItems": "center",display:"flex"}}>
                          <MdCheck size={"25px"} color={"#0E9384"}/>
                        </div>
                      </div>

                      
                      <div style={{"display": "flex", "flexDirection": "column"}}>
                      <Text as={"b"}>Privacy disclaimer</Text>
                      <Text marginBottom={"2vh"}>How we handle and store your data</Text>
                      </div>
                      </div>
                      </>
                      )
                    )
                  }
                  
                  
                  </div>
                  </div>
                </Box>
                {/* Right Screen of Modal */}
                <div style={{backgroundColor:"#FFFFFF", flex: 5, paddingTop: "5vh", paddingLeft: "1vw", display: "flex", flexDirection: "column", paddingRight: "10px", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", border: "10px solid transparent"}}>
                  {
                    onboardingStep === 0 ? (
                      <>
                      <Box overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"70vh"} maxHeight={"70vh"}>
                      <Image src={logoModal} alt="Logo Icon" width={"48px"} marginBottom={{base: "24px", sm: "0px"}}/>
                      <Text fontSize={"30px"} fontWeight={"600"} color={"#101828"} marginBottom={{base: "8px", sm: "10px"}}>Setup your personal AI</Text>
                      <Text fontSize={"16px"} fontWeight={"400"} color={"#475467"} marginBottom={"10px"}>Give your AI a name and a face</Text>
                      <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}>Name your AI</Text>
                      <FormControl isInvalid={aIName===""  || (failedSubmit && aIName === null)}>
                        <Input placeholder='Johnny5_AI' value={aIName} onChange={(e)=>{setAIName(e.target.value)}}/>
                        {/* <FormErrorMessage display={aIName==="" || (failedSubmit && aIName === null)? "block" : "none"}>AI Name must not be empty</FormErrorMessage> */}
                      </FormControl>
                      
                      
                      <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} marginTop={"10px"}>Choose an avatar for your AI</Text>
                      <FormControl isInvalid={selectedAvatar==="" || (failedSubmit && selectedAvatar === null)}>
                      <SimpleGrid columns={7} minChildWidth={{base: "70px",sm: '97px'}} spacing='10px' marginTop={"10px"} marginRight={{base: "0px", sm: "57px"}}>
                        {
                          avatars.map((avatar,i)=>{
                            if (avatar === selectedAvatar) {
                              return (
                                <Image maxWidth={{base: "70px", sm: "90px"}} key={i} src={`/assets/avatar/${avatar}`} alt={avatar} onClick={()=>{setSelectedAvatar(avatar)}} style={{"padding": "10px", backgroundColor: "#F0FDF9", borderRadius: "50px", border: "2px solid #0E9384"}}/>
                              )
                            } else if (avatar === "Unknown") {
                              return <></>
                            } 
                            else {
                              return (
                                <Image maxWidth={{base: "70px", sm: "90px"}} src={`/assets/avatar/${avatar}`} key={i} alt={avatar} onClick={()=>{setSelectedAvatar(avatar)}} style={{"padding": "10px", borderRadius: "50px",border: "2px solid #EAECF0"}}/>
                              )
                            }
                          })
                        }
                      </SimpleGrid>
                      {/* <FormErrorMessage display={selectedAvatar==="" || (failedSubmit && selectedAvatar === null)? "block" : "none"}>Avatar must be chosen</FormErrorMessage> */}
                      </FormControl>
                      </Box>
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 1 ? (
                      <>
                      <Box overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"70vh"} maxHeight={"70vh"} marginRight={"20px"}>
                      <Image src={yourselfModal} alt="Personalize Icon" width={"48px"} marginBottom={{base: "24px", sm: "0px"}}/>
                      <Text as={"b"} fontSize={"2xl"} color={"#101828"}>Tell us about yourself</Text>
                      <Text color={"#475467"}>Give us some information about yourself so we can better personalize your experience</Text>
                      <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: 1, lg: 10}}>
                        <Box flexDirection={"column"} style={{"display": "flex", order: 1}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Full name</Text>
                        <FormControl isInvalid={details.name==="" || (failedSubmit && details.name === null)}>
                        <Input type={"text"} placeholder="Theresa Webb" maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, name: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.name==="" || (failedSubmit && details.name === null)? "block" : "none"}>Please provide name</FormErrorMessage> */}
                        </FormControl>
                        </Box>
                        <div style={{"display": "flex", flexDirection: "column", order: 2}}>
                        <FormControl isInvalid={details.job==="" || (failedSubmit && details.job === null)}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Job title</Text>
                        <Input type={"text"} placeholder="Teacher" maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, job: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.job==="" || (failedSubmit && details.job === null)? "block" : "none"}>Please provide job</FormErrorMessage> */}
                        </FormControl>
                        </div>
                        <Box order={{base: 4, lg: 3}} style={{"display": "flex", flexDirection: "column"}}>
                        
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Date of birth</Text>
                        <div style={{"display": "flex", flexDirection: "row"}}>
                        <FormControl width={"fit-content"}  isInvalid={details.monthDOB==="" || parseInt(details.monthDOB) > 31 || parseInt(details.monthDOB) < 1 ||(failedSubmit && (details.monthDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Month</Text>
                        <Input type={"number"} placeholder="02" width={"52px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}  onChange={(e)=>{setDetails({...details, monthDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        <FormControl width={"fit-content"} isInvalid={details.dayDOB==="" || parseInt(details.dayDOB) > 31 || parseInt(details.dayDOB) < 1 || (failedSubmit && (details.dayDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} onChange={(e)=>{setDetails({...details, dayDOB: e.target.value})}}>Day</Text>
                        <Input type={"number"} placeholder="19" width={"52px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, dayDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        <FormControl width={"fit-content"}  isInvalid={details.yearDOB==="" || parseInt(details.yearDOB) > 2050 || parseInt(details.yearDOB) < 1900 ||(failedSubmit && (details.yearDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}  >Year</Text>
                        <Input type={"number"} placeholder="1985" width={"69px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}  onChange={(e)=>{setDetails({...details, yearDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        </div>
                        {/* <FormErrorMessage display={details.dayDOB==="" || details.monthDOB==="" || details.yearDOB==="" || (failedSubmit && (details.dayDOB===null || details.monthDOB===null || details.yearDOB===null))? "block" : "none"}>Please correctly provide date of birth month, day, year.</FormErrorMessage> */}
                        
                        </Box>
                       
                        <Box order={{base: 3, lg: 4}} paddingTop={{base: "0px", sm: "21px"}} style={{"display": "flex", flexDirection: "column"}}>
                        <FormControl isInvalid={details.email==="" || (failedSubmit && details.email === null)}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Email address</Text>
                        <Input type={"email"} placeholder="t.webb@example.com" width={"100%"} maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, email: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.email==="" || (failedSubmit && details.email === null)? "block" : "none"}>Please provide email</FormErrorMessage> */}
                        </FormControl>
                        </Box>
                        <div style={{"display": "flex", flexDirection: "column", order: 5}}>
                        <FormControl isInvalid={details.country==="" || (failedSubmit && details.country === null)}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Country</Text>
                        <div>
                          {
                            details.country === "" || details.country === null ? (
                              <>
                              </>
                            ) : (
                              <img src={`/assets/country/${getCountryLogo()}`} alt={`${details.country} Country Logo`} style={{display: "inline-flex", float: "left", "pointer-events": "none", marginRight: "-40px", marginLeft: "10px", marginTop: "11px"}}/>
                            )
                          }
                        
                        
                        <CountryDropdown 
                          classes='dropdown'
                          value={details.country}
                          onChange={(val) => setDetails({...details, country: val})} 
                          whitelist={["US"]}
                          priorityOptions={["US"]}
                          style={{"box-sizing": "border-box",
                            "appearance": "none" ,

                            /* Auto layout */
                            "display": "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            "padding": "10px 14px",
                            "padding-left": "40px",
                            "gap": "8px",

                            "width": "100%",
                            "max-width": "336px",
                            "height": "44px",

                            "color": details.country === "" ? "#667085" : "#1a202c",
                            
                            /* Gray/100 */
                            "background": "#F2F4F7",
                            
                            /* Gray/300 */
                            "border": details.country === "" || (failedSubmit && details.country === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                            
                            /* Shadow/xs */
                            "box-shadow": "0px 1px 2px rgba(16, 24, 40, 0.05)",
                            "border-radius": "8px",
                            
                            /* Inside auto layout */
                            "flex": "none",
                            "order": "1",
                            "align-self": "stretch",
                            "flex-grow": "0"}}/>
                        </div>
                        {/* <FormErrorMessage display={details.country==="" || (failedSubmit && details.country === null)? "block" : "none"}>Please provide country</FormErrorMessage> */}
                        </FormControl>
                        </div>
                        <div style={{"display": "flex", flexDirection: "column", order: 6}}>
                        <FormControl isInvalid={details.region==="" || (failedSubmit && details.region === null)}>
                        <div>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >State</Text>
                        <MdSearch
                        size={"1.5rem"}
                        style={{float: "left", "pointer-events": "none", marginRight: "-40px", marginLeft: "10px", marginTop: "11px"}}
                        />
                        <RegionDropdown
                        country={details.country}
                        value={details.region}
                        onChange={(val) => setDetails({...details, region: val})} 
                        style={{"box-sizing": "border-box",
                            "appearance": "none" ,

                            /* Auto layout */
                            "display": "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            "padding": "10px 14px",
                            "padding-left": "40px",
                            "gap": "8px",
                            
                            "width": "100%",
                            "max-width": "336px",
                            "height": "44px",

                            "color": details.region === "" ? "#667085" : "#1a202c",
                            
                            /* Gray/100 */
                            "background": "#F2F4F7",
                            
                            /* Gray/300 */
                            "border": details.region === "" || (failedSubmit && details.region === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                            
                            /* Shadow/xs */
                            "box-shadow": "0px 1px 2px rgba(16, 24, 40, 0.05)",
                            "border-radius": "8px",
                            
                            /* Inside auto layout */
                            "flex": "none",
                            "order": "1",
                            "align-self": "stretch",
                            "flex-grow": "0"}}
                            />
                        </div>
                        {/* <FormErrorMessage display={details.region==="" || (failedSubmit && details.region === null)? "block" : "none"}>Please provide region</FormErrorMessage> */}
                        </FormControl>
                        </div>
                      </SimpleGrid>
                      </Box>
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 2 ? (
                      <>
                      <Image src={trainModal} alt="Train Icon" width={"48px"} marginBottom={{base: "24px", sm: "0px"}}/>
                      <Text as={"b"} fontSize={"2xl"} color={"#101828"}>Train your AI</Text>
                      <Text color={"#475467"}>Data is powers your AI, the more you add the better results you will get. Select the apps you use below to train your AI!</Text>
                      <Box display={{base: "none", sm:"block"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                          {
                            chosenTrainTab === "Social" ? (
                              <div style={{display: "flex", flexDirection: "row", background: "#F9FAFB", "border-radius": "6px", "padding": "10px 14px"}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#344054"}>Social & streaming</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Social")).length}</Text>
                              </div>
                            ) : (
                              <div style={{display: "flex", flexDirection: "row", "border-radius": "6px", "padding": "10px 14px"}} onClick={()=>{setChosenTrainTab("Social")}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#667085"}>Social & streaming</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Social")).length}</Text>
                              </div>
                            )
                          }
                          {
                            chosenTrainTab === "Transport" ? (
                              <div style={{display: "flex", flexDirection: "row", background: "#F9FAFB", "border-radius": "6px", "padding": "10px 14px"}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#344054"}>Transport</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Transport")).length}</Text>
                              </div>
                            ) : (
                              <div style={{display: "flex", flexDirection: "row", "border-radius": "6px", "padding": "10px 14px"}} onClick={()=>{setChosenTrainTab("Transport")}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#667085"}>Transport</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Transport")).length}</Text>
                              </div>
                            )
                          }
                          {
                            chosenTrainTab === "Health" ? (
                              <div style={{display: "flex", flexDirection: "row", background: "#F9FAFB", "border-radius": "6px", "padding": "10px 14px"}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#344054"}>Health & Fitness</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Health")).length}</Text>
                              </div>
                            ) : (
                              <div style={{display: "flex", flexDirection: "row", "border-radius": "6px", "padding": "10px 14px"}} onClick={()=>{setChosenTrainTab("Health")}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#667085"}>Health & Fitness</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Health")).length}</Text>
                              </div>
                            )
                          }
                          {
                            chosenTrainTab === "Misc" ? (
                              <div style={{display: "flex", flexDirection: "row", background: "#F9FAFB", "border-radius": "6px", "padding": "10px 14px"}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#344054"}>Misc</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Misc")).length}</Text>
                              </div>
                            ) : (
                              <div style={{display: "flex", flexDirection: "row", "border-radius": "6px", "padding": "10px 14px"}} onClick={()=>{setChosenTrainTab("Misc")}}>
                                <Text paddingRight={"2px"} fontWeight={"600"} color={"#667085"}>Misc</Text>
                                <Text fontSize={"14px"} alignItems={"center"} display={"flex"} color={"#344054"} textAlign={"center"} fontWeight={"500"} background={"#F2F4F7"} mixBlendMode={"multiply"} borderRadius={"16px"} width={"28px"} height={"24px"} padding={"2px 10px"}>{apps.filter(app=>chosenApps.includes(app.name)&&app.tags.includes("Misc")).length}</Text>
                              </div>
                            )
                          }
                        </div>
                        <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                        {
                          apps.filter(app=>app.tags.includes(chosenTrainTab)).map((app)=>{
                            return (
                              <>
                              {
                                chosenApps.includes(app.name) ? (
                                  <>
                                  <Tooltip label={`${app.name}`}>
                                  <Box style={{"box-sizing": "border-box",
                                      /* Auto layout */
                                      "display": "flex",
                                      "flex-direction": "row",
                                      "align-items": "flex-start",
                                      "padding": "16px",
                                      "gap": "4px",

                                      "width": "84px",
                                      "height": "64px",

                                      /* Teal / 50 */
                                      "background": "#F0FDF9",

                                      /* Teal / 600 */
                                      "border": "2px solid #0E9384",
                                      "border-radius": "12px",

                                      /* Inside auto layout */
                                      "flex": "none",
                                      "order": 0,
                                      "flex-grow": 0}} onClick={()=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}}>
                                        <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                        <div style={{"box-sizing": "border-box",

                                          "width": "16px",
                                          "height": "16px",

                                          /* Teal / 600 */
                                          "background": "#0E9384",

                                          /* Teal / 600 */
                                          "border": "1px solid #0E9384",
                                          "border-radius": "8px",

                                          /* Inside auto layout */
                                          "flex": "none",
                                          "order": 1,
                                          "flex-grow": 0}}><img src={Check} style={{"position": "relative",
                                            "left": "16.67%",
                                            "right": "16.67%",
                                            "top": "25%",
                                            "bottom": "29.17%",                              
                                            }} alt={"Check"}/></div>
                                  </Box>
                                  </Tooltip>
                                  </>
                                ) : (
                                  <>
                                  <Tooltip label={`${app.name}`}>
                                  <Box style={{"box-sizing": "border-box",
                                /* Auto layout */
                                "display": "flex",
                                "flex-direction": "row",
                                "align-items": "flex-start",
                                "padding": "16px",
                                "gap": "4px",

                                "width": "84px",
                                "height": "64px",

                              /* Base/White */
                              "background": "#FFFFFF",

                              /* Gray/200 */
                              "border": "1px solid #EAECF0",
                              "border-radius": "12px",

                                /* Inside auto layout */
                                "flex": "none",
                                "order": 0,
                                "flex-grow": 0}} onClick={()=>{setChosenApps([...chosenApps, app.name])}}>
                                  <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                  <div style={{"box-sizing": "border-box",

                                    "width": "16px",
                                    "height": "16px",

                                    /* Base/White */
                                    "background": "#FFFFFF",

                                    /* Gray/200 */
                                    "border": "1px solid #D0D5DD",
                                    "border-radius": "8px",

                                    /* Inside auto layout */
                                    "flex": "none",
                                    "order": 1,
                                    "flex-grow": 0}}></div>
                                  </Box>
                                  </Tooltip>
                                  </>
                                )
                              }
                              
                              
                              </>
                            )
                          })
                        }
                        </SimpleGrid>
                      </Box> 
                      <Box display={{base: "block", sm:"none"}} overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"49vh"} maxHeight={"49vh"} marginTop={"2vh"}>
                      <Accordion variant={"prifina"} allowToggle>
                        <AccordionItem marginBottom={"16px"}>
                          {({ isExpanded }) => (
                            <>
                                <div>
                                    <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text as={"b"} color={ isExpanded ? "#101828" : "#667085"} fontSize={"16px"}>Social & streaming</Text>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                                    {
                                      apps.filter(app=>app.tags.includes("Social")).map((app)=>{
                                        return (
                                          <>
                                          {
                                            chosenApps.includes(app.name) ? (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                                  /* Auto layout */
                                                  "display": "flex",
                                                  "flex-direction": "row",
                                                  "align-items": "flex-start",
                                                  "padding": "16px",
                                                  "gap": "4px",

                                                  "width": "84px",
                                                  "height": "64px",

                                                  /* Teal / 50 */
                                                  "background": "#F0FDF9",

                                                  /* Teal / 600 */
                                                  "border": "2px solid #0E9384",
                                                  "border-radius": "12px",

                                                  /* Inside auto layout */
                                                  "flex": "none",
                                                  "order": 0,
                                                  "flex-grow": 0}} onClick={()=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}}>
                                                    <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                                    <div style={{"box-sizing": "border-box",

                                                      "width": "16px",
                                                      "height": "16px",

                                                      /* Teal / 600 */
                                                      "background": "#0E9384",

                                                      /* Teal / 600 */
                                                      "border": "1px solid #0E9384",
                                                      "border-radius": "8px",

                                                      /* Inside auto layout */
                                                      "flex": "none",
                                                      "order": 1,
                                                      "flex-grow": 0}}><img src={Check} style={{"position": "relative",
                                                        "left": "16.67%",
                                                        "right": "16.67%",
                                                        "top": "25%",
                                                        "bottom": "29.17%",                              
                                                        }} alt={"Check"}/></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            ) : (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                            /* Auto layout */
                                            "display": "flex",
                                            "flex-direction": "row",
                                            "align-items": "flex-start",
                                            "padding": "16px",
                                            "gap": "4px",

                                            "width": "84px",
                                            "height": "64px",

                                          /* Base/White */
                                          "background": "#FFFFFF",

                                          /* Gray/200 */
                                          "border": "1px solid #EAECF0",
                                          "border-radius": "12px",

                                            /* Inside auto layout */
                                            "flex": "none",
                                            "order": 0,
                                            "flex-grow": 0}} onClick={()=>{setChosenApps([...chosenApps, app.name])}}>
                                              <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                              <div style={{"box-sizing": "border-box",

                                                "width": "16px",
                                                "height": "16px",

                                                /* Base/White */
                                                "background": "#FFFFFF",

                                                /* Gray/200 */
                                                "border": "1px solid #D0D5DD",
                                                "border-radius": "8px",

                                                /* Inside auto layout */
                                                "flex": "none",
                                                "order": 1,
                                                "flex-grow": 0}}></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            )
                                          }
                                          
                                          
                                          </>
                                        )
                                      })
                                    }
                                  </SimpleGrid>
                                  </AccordionPanel>
                                </div>
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem marginBottom={"16px"}>
                          {({ isExpanded }) => (
                            <>
                                <div>
                                    <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text as={"b"} color={ isExpanded ? "#101828" : "#667085"} fontSize={"16px"}>Transport</Text>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                                    {
                                      apps.filter(app=>app.tags.includes("Transport")).map((app)=>{
                                        return (
                                          <>
                                          {
                                            chosenApps.includes(app.name) ? (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                                  /* Auto layout */
                                                  "display": "flex",
                                                  "flex-direction": "row",
                                                  "align-items": "flex-start",
                                                  "padding": "16px",
                                                  "gap": "4px",

                                                  "width": "84px",
                                                  "height": "64px",

                                                  /* Teal / 50 */
                                                  "background": "#F0FDF9",

                                                  /* Teal / 600 */
                                                  "border": "2px solid #0E9384",
                                                  "border-radius": "12px",

                                                  /* Inside auto layout */
                                                  "flex": "none",
                                                  "order": 0,
                                                  "flex-grow": 0}} onClick={()=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}}>
                                                    <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                                    <div style={{"box-sizing": "border-box",

                                                      "width": "16px",
                                                      "height": "16px",

                                                      /* Teal / 600 */
                                                      "background": "#0E9384",

                                                      /* Teal / 600 */
                                                      "border": "1px solid #0E9384",
                                                      "border-radius": "8px",

                                                      /* Inside auto layout */
                                                      "flex": "none",
                                                      "order": 1,
                                                      "flex-grow": 0}}><img src={Check} style={{"position": "relative",
                                                        "left": "16.67%",
                                                        "right": "16.67%",
                                                        "top": "25%",
                                                        "bottom": "29.17%",                              
                                                        }} alt={"Check"}/></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            ) : (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                            /* Auto layout */
                                            "display": "flex",
                                            "flex-direction": "row",
                                            "align-items": "flex-start",
                                            "padding": "16px",
                                            "gap": "4px",

                                            "width": "84px",
                                            "height": "64px",

                                          /* Base/White */
                                          "background": "#FFFFFF",

                                          /* Gray/200 */
                                          "border": "1px solid #EAECF0",
                                          "border-radius": "12px",

                                            /* Inside auto layout */
                                            "flex": "none",
                                            "order": 0,
                                            "flex-grow": 0}} onClick={()=>{setChosenApps([...chosenApps, app.name])}}>
                                              <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                              <div style={{"box-sizing": "border-box",

                                                "width": "16px",
                                                "height": "16px",

                                                /* Base/White */
                                                "background": "#FFFFFF",

                                                /* Gray/200 */
                                                "border": "1px solid #D0D5DD",
                                                "border-radius": "8px",

                                                /* Inside auto layout */
                                                "flex": "none",
                                                "order": 1,
                                                "flex-grow": 0}}></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            )
                                          }
                                          
                                          
                                          </>
                                        )
                                      })
                                    }
                                  </SimpleGrid>
                                  </AccordionPanel>
                                </div>
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem marginBottom={"16px"}>
                          {({ isExpanded }) => (
                            <>
                                <div>
                                    <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text as={"b"} color={ isExpanded ? "#101828" : "#667085"} fontSize={"16px"}>Health & Fitness</Text>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                                    {
                                      apps.filter(app=>app.tags.includes("Health")).map((app)=>{
                                        return (
                                          <>
                                          {
                                            chosenApps.includes(app.name) ? (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                                  /* Auto layout */
                                                  "display": "flex",
                                                  "flex-direction": "row",
                                                  "align-items": "flex-start",
                                                  "padding": "16px",
                                                  "gap": "4px",

                                                  "width": "84px",
                                                  "height": "64px",

                                                  /* Teal / 50 */
                                                  "background": "#F0FDF9",

                                                  /* Teal / 600 */
                                                  "border": "2px solid #0E9384",
                                                  "border-radius": "12px",

                                                  /* Inside auto layout */
                                                  "flex": "none",
                                                  "order": 0,
                                                  "flex-grow": 0}} onClick={()=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}}>
                                                    <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                                    <div style={{"box-sizing": "border-box",

                                                      "width": "16px",
                                                      "height": "16px",

                                                      /* Teal / 600 */
                                                      "background": "#0E9384",

                                                      /* Teal / 600 */
                                                      "border": "1px solid #0E9384",
                                                      "border-radius": "8px",

                                                      /* Inside auto layout */
                                                      "flex": "none",
                                                      "order": 1,
                                                      "flex-grow": 0}}><img src={Check} style={{"position": "relative",
                                                        "left": "16.67%",
                                                        "right": "16.67%",
                                                        "top": "25%",
                                                        "bottom": "29.17%",                              
                                                        }} alt={"Check"}/></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            ) : (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                            /* Auto layout */
                                            "display": "flex",
                                            "flex-direction": "row",
                                            "align-items": "flex-start",
                                            "padding": "16px",
                                            "gap": "4px",

                                            "width": "84px",
                                            "height": "64px",

                                          /* Base/White */
                                          "background": "#FFFFFF",

                                          /* Gray/200 */
                                          "border": "1px solid #EAECF0",
                                          "border-radius": "12px",

                                            /* Inside auto layout */
                                            "flex": "none",
                                            "order": 0,
                                            "flex-grow": 0}} onClick={()=>{setChosenApps([...chosenApps, app.name])}}>
                                              <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                              <div style={{"box-sizing": "border-box",

                                                "width": "16px",
                                                "height": "16px",

                                                /* Base/White */
                                                "background": "#FFFFFF",

                                                /* Gray/200 */
                                                "border": "1px solid #D0D5DD",
                                                "border-radius": "8px",

                                                /* Inside auto layout */
                                                "flex": "none",
                                                "order": 1,
                                                "flex-grow": 0}}></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            )
                                          }
                                          
                                          
                                          </>
                                        )
                                      })
                                    }
                                  </SimpleGrid>
                                  </AccordionPanel>
                                </div>
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem marginBottom={"16px"}>
                          {({ isExpanded }) => (
                            <>
                                <div>
                                    <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text as={"b"} color={ isExpanded ? "#101828" : "#667085"} fontSize={"16px"}>Misc</Text>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                                    {
                                      apps.filter(app=>app.tags.includes("Misc")).map((app)=>{
                                        return (
                                          <>
                                          {
                                            chosenApps.includes(app.name) ? (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                                  /* Auto layout */
                                                  "display": "flex",
                                                  "flex-direction": "row",
                                                  "align-items": "flex-start",
                                                  "padding": "16px",
                                                  "gap": "4px",

                                                  "width": "84px",
                                                  "height": "64px",

                                                  /* Teal / 50 */
                                                  "background": "#F0FDF9",

                                                  /* Teal / 600 */
                                                  "border": "2px solid #0E9384",
                                                  "border-radius": "12px",

                                                  /* Inside auto layout */
                                                  "flex": "none",
                                                  "order": 0,
                                                  "flex-grow": 0}} onClick={()=>{setChosenApps(chosenApps.filter(chosenApp=>chosenApp!==app.name))}}>
                                                    <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                                    <div style={{"box-sizing": "border-box",

                                                      "width": "16px",
                                                      "height": "16px",

                                                      /* Teal / 600 */
                                                      "background": "#0E9384",

                                                      /* Teal / 600 */
                                                      "border": "1px solid #0E9384",
                                                      "border-radius": "8px",

                                                      /* Inside auto layout */
                                                      "flex": "none",
                                                      "order": 1,
                                                      "flex-grow": 0}}><img src={Check} style={{"position": "relative",
                                                        "left": "16.67%",
                                                        "right": "16.67%",
                                                        "top": "25%",
                                                        "bottom": "29.17%",                              
                                                        }} alt={"Check"}/></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            ) : (
                                              <>
                                              <Tooltip label={`${app.name}`}>
                                              <Box style={{"box-sizing": "border-box",
                                            /* Auto layout */
                                            "display": "flex",
                                            "flex-direction": "row",
                                            "align-items": "flex-start",
                                            "padding": "16px",
                                            "gap": "4px",

                                            "width": "84px",
                                            "height": "64px",

                                          /* Base/White */
                                          "background": "#FFFFFF",

                                          /* Gray/200 */
                                          "border": "1px solid #EAECF0",
                                          "border-radius": "12px",

                                            /* Inside auto layout */
                                            "flex": "none",
                                            "order": 0,
                                            "flex-grow": 0}} onClick={()=>{setChosenApps([...chosenApps, app.name])}}>
                                              <img src={`/assets/apps/${getAppLogo(app.name)}`} alt={`${app.name} Logo`}/>
                                              <div style={{"box-sizing": "border-box",

                                                "width": "16px",
                                                "height": "16px",

                                                /* Base/White */
                                                "background": "#FFFFFF",

                                                /* Gray/200 */
                                                "border": "1px solid #D0D5DD",
                                                "border-radius": "8px",

                                                /* Inside auto layout */
                                                "flex": "none",
                                                "order": 1,
                                                "flex-grow": 0}}></div>
                                              </Box>
                                              </Tooltip>
                                              </>
                                            )
                                          }
                                          
                                          
                                          </>
                                        )
                                      })
                                    }
                                  </SimpleGrid>
                                  </AccordionPanel>
                                </div>
                            </>
                            
                          )}
                        </AccordionItem>
                      </Accordion>
                      </Box> 

                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 3 ? (
                      <>
                      <Box overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"70vh"} maxHeight={"70vh"}>
                      <Image src={privacyModal} alt="Privacy Icon" width={"48px"} marginBottom={{base: "24px", sm: "0px"}}/>
                      <Text as={"b"} fontSize={"2xl"} color={"#101828"}>Privacy disclaimer</Text>
                      <Text color={"#475467"} >Please note that this Personal AI chat service demo records each chat session and related details. The purpose of this recording is to improve the quality of our service and for development purposes.<br/> 
                      By using this demo, you acknowledge and agree to the recording and storage of your conversation history. Furthermore, any details provided or prompts entered hereafter will be sent to and processed by Prifina and OpenAI.<br/> 
                      We want you to know that any personal information collected will be kept confidential and will not be disclosed to any third party without your consent, except as required by law.<br/> 
                      If you have any concerns about the collection, use, or storage of your personal information, please do not use this service. If you have any questions or comments about our privacy policy or practices, please feel free to contact us.<br/> 
                      Thank you for using our Personal AI chat service.</Text>
                      </Box>
                      
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 3 ? (
                      <>
                        <div style={{"marginTop": "auto", "display": "flex", "flexDirection": "row", "gap": "10px", "marginBottom": "3vh"}}>
                          <Button border={"1px solid #D0D5DD"} backgroundColor={"#FFFFFF"} color={"#000000"} onClick={()=>{setOnboardingStep(0);onClose();}} width="100%">No Thanks</Button>
                          <Button backgroundColor={"#0E9384"} color={"#FFFFFF"} marginTop={"auto"} marginRight={"10px"}width="100%" onClick={()=>{setOnboardingStep(onboardingStep+1);onClose();initalMessage();}}>I'm Ok with this</Button>
                        </div>
                       
                      </>
                    ) : (
                      <Button marginTop={"auto"} marginRight={"3vw"} marginLeft={"1vw"} marginBottom={"3vh"} onClick={()=>
                        {
                          switch(onboardingStep){
                            case 0:
                              if (aIName === "" || selectedAvatar === "" || aIName === null || selectedAvatar === null ) {
                                setFailedSubmit(true)
                              } else {
                                setFailedSubmit(false)
                                setOnboardingStep(onboardingStep+1)
                              }
                              break
                            case 1:
                              if ( details.name === "" || details.name === null || 
                              details.job === "" || details.job === null || 
                              details.monthDOB === "" || details.monthDOB === null || details.monthDOB.match(/[^$,.\d]/) || parseInt(details.monthDOB) > 31 || parseInt(details.monthDOB) < 1 ||
                              details.dayDOB === "" || details.dayDOB === null || details.dayDOB.match(/[^$,.\d]/) || parseInt(details.dayDOB) > 31 || parseInt(details.dayDOB) < 1 ||
                              details.yearDOB === "" || details.yearDOB === null || details.yearDOB.match(/[^$,.\d]/) ||  parseInt(details.yearDOB) < 1900 || parseInt(details.yearDOB) > 2050 ||
                              details.country === "" || details.country === null || 
                              details.region === "" || details.region === null) {
                                setFailedSubmit(true)
                              } else {
                                setFailedSubmit(false)
                                setOnboardingStep(onboardingStep+1)
                              }
                              break
                            case 2:
                              setOnboardingStep(onboardingStep+1)
                              break
                            default:
                              break
                          }

                        }} backgroundColor={"#0E9384"} color={"#FFFFFF"}>Continue</Button>
                    )
                  }
                  {/* **** <- Page Indicator */}
                  <div style={{display: "flex", flexDirection: "row", marginBottom: "3vh", marginLeft: "auto", marginRight: "auto"}}>
                    {onboardingStep === 0 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
                    {onboardingStep === 1 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
                    {onboardingStep === 2 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
                    {onboardingStep === 3 ? (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#107569", "border-radius": "6px", marginRight: "1vw"}}/>
                    ) : (
                      <div style={{"width": "10px", "height": "10px", backgroundColor:"#EAECF0", "border-radius": "6px", marginRight: "1vw"}}/>
                    )}
                 </div>
                </div>
              </div>
              
              
            </ModalContent>
          </Modal>
          <Drawer placement={"left"} isOpen={isSideBarOpen} onClose={onSideBarClose} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent width={"85%"} padding={"16px"}>
            <DrawerCloseButton />
            <Box display={"flex"} flexDirection={"row"}>
              <img src={logo} style={{ display: 'inline-block', width: "30px",filter: "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))" }}/>
              <Text paddingLeft={"10px"} color='#0E9384' fontWeight="700" fontSize={"20px"}>Pri-AI</Text>
            </Box>
            {section === "chat"? (
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"}> Chat</Text>
                </div>
                
              ) : (
                <div onClick={()=>{setSection("chat")}} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"}> Chat</Text>
                </div>
              )}

              <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                <img src={FAQ} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"}> FAQ</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </div>

              {section === "about"? (
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"}> About this demo</Text>
              </div>
              ) : (
                <div onClick={()=>{setSection("about")}} style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"}> About this demo</Text>
                </div>
              )}
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                <CgSlack color='#475467' size={"22px"}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"22px"} fontWeight={"600"} position="absolute" left={"2rem"} fontSize={"16px"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}> LED Slack</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginLeft: "auto"}}/>
              </div>
              
              <Box gap={"20px"} display={"flex"} flexDirection={"column"} marginBottom={"auto"}>
                <Button size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} marginTop={"1vh"} onClick={()=>{setChatlog([]);setPrompt("");setShowWelcomeMessage(false);}}>Clear chat <RiDeleteBin6Line/></Button>
                <Button size='sm' backgroundColor={"#0e9384"} color={"#FFFFFF"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community<CgSlack/></Button>
                <Button size='sm'  color={"#107569"} variant={'ghost'} >Share<img src={share} /></Button>
              </Box>

              
              
              <div style={{padding: "20px 16px", backgroundColor: "#F0FDF9", border: "1px solid #99F6E0", borderRadius: "8px", marginLeft: "10px",marginBottom: "2vh"  }}>
                <Text fontWeight={"600"} color={"#107569"} as="b">{questionsUsed}/10 Questions used </Text>
                <Text fontWeight={"400"} color={"#134E48"} marginTop={"4px"} fontSize={"12px"}>For this demo session you are limited to 10 questions. </Text>
                <Progress value={10*questionsUsed} height={"8px"} marginTop={"16px"} borderRadius={"4px"} variant={"prifina"}/>
              </div>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px", marginLeft: "10px", paddingTop: "10px", borderTop: "1px solid #eaecf0" }}>
              <img src={`/assets/avatar/Unknown.svg`} ALT="Profile Pic" style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
              <Text paddingLeft={"5px"} fontWeight="600">{details.name}</Text>
              <img src={logout} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </div>
          </DrawerContent>
          </Drawer>
          <div style={{display:"flex", flexDirection:"row"}}>
            <Box id="sidebar" display={{base: "none", sm: "flex"}} style={{width: "19.5%", maxWidth: "270px", flexDirection:"column",  minHeight:"100vh",maxHeight:"100vh", paddingRight: "1rem", "border-right": "1px solid #eaecf0"}}>
              <div style={{display:"flex", flexDirection:"row", marginLeft: "10px",  marginTop: "10px"}}>
                <img src={logo} style={{ display: 'inline-block', filter: "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))" }}/>
                <Text paddingLeft={"10px"} color='#0E9384' fontWeight="700" fontSize={"20px"}>Pri-AI</Text>
              </div>
              
              {section === "chat"? (
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"}> Chat</Text>
                </div>
                
              ) : (
                <div onClick={()=>{setSection("chat")}} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"}> Chat</Text>
                </div>
              )}

              <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}} onClick={()=>{window.open("https://beta.prifina.com/priai.html", '_blank').focus();}}>
                <img src={FAQ} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"}> FAQ</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </div>

              {section === "about"? (
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"}> About this demo</Text>
              </div>
              ) : (
                <div onClick={()=>{setSection("about")}} style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"}> About this demo</Text>
                </div>
              )}
              
              
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer", marginBottom: "auto"}}>
                <CgSlack color='#475467' size={"22px"}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} position="absolute" left={"2rem"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}> LED Slack</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </div>
              <div style={{padding: "20px 16px", backgroundColor: "#F0FDF9", border: "1px solid #99F6E0", borderRadius: "8px", marginLeft: "10px",marginBottom: "2vh"  }}>
                <Text fontWeight={"600"} color={"#107569"} as="b">{questionsUsed}/10 Questions used </Text>
                <Text fontWeight={"400"} color={"#134E48"} marginTop={"4px"} fontSize={"12px"}>For this demo session you are limited to 10 questions. </Text>
                <Progress value={10*questionsUsed} height={"8px"} marginTop={"16px"} borderRadius={"4px"} variant={"prifina"}/>
              </div>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px", marginLeft: "10px", paddingTop: "10px", borderTop: "1px solid #eaecf0" }}>
              <img src={`/assets/avatar/Unknown.svg`} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
              <Text paddingLeft={"5px"} fontWeight="600">{details.name}</Text>
              <img src={logout} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </div>
              
              
            </Box>
            <div style={{flexDirection:"column", minWidth: "80.5%", width: "100%"}}>

            <Box style={{display:"flex", flexDirection:"row", alignItems: "center", paddingLeft: "1rem", marginTop: "10px", marginBottom: "10px"}}>
              <Box display={{base: "none", sm:"flex"}} width={"100%"} height={"100%"} alignItems={"center"}>
              {
                selectedAvatar === null || onboardingStep < 4 ? (
                  <>
                  </>
                ) : (
                  <>
                    <div style={{flex: "none", order: "0", flexGrow: "0", position: "relative"}}>
                    <Image src={`/assets/avatar/${selectedAvatar}`} alt="Avatar" style={{width: "40px", height: "40px"}}/>
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
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} onClick={()=>{setChatlog([]);setPrompt("");setShowWelcomeMessage(false);}}>Clear chat <RiDeleteBin6Line/></Button>
              <Button marginRight={"1rem"} size='sm' backgroundColor={"#0e9384"} color={"#FFFFFF"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community<CgSlack/></Button>
              <Button marginRight={"1rem"} size='sm'  color={"#107569"} variant={'ghost'}>Share<img src={share} /></Button>
              </Box>
              <Box display={{base: "flex", sm:"none"}} flexDirection={"row"} width={"100%"} alignItems={"center"}>
                <img src={logo} style={{ display: 'inline-block', filter: "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))" }}/>
                <Text paddingLeft={"10px"} color='#0E9384' fontWeight="700" fontSize={"20px"}>Pri-AI</Text>
                <Spacer/>
                <IconButton icon={<HamburgerIcon/>} marginRight={"1rem"} onClick={onSideBarOpen}/>
              </Box>
            </Box>
            {
              section === "about" ? (
                <>
                  <hr/>
                  <div style={{marginTop: "10px", marginLeft: "1.5rem", whiteSpace: "pre-wrap","overflow-y": "scroll", "scroll-behavior": "smooth", "min-height": "87vh","max-height": "87vh",}}>
                    <div style={{marginRight: "30px"}}>                    
                      <Text fontWeight={"600"} as={"b"} fontSize={"36px"} color={"#107569"} letterSpacing={"-0.02em"}>Pri-AI Demo v1.0.0</Text>
                      <Text fontSize={"20px"} color={"#134E48"}>This demo is designed to simulate the experience of having a personal AI assistant which has access to a wide range of your personal data from your applications and devices. This Pri-AI (Personal AI) is planned to be launched as a feature on Prifina, the first holistic personal data platform.</Text>
                      <Text fontWeight={"600"} fontSize={"24px"} color={"#107569"}>What can Pri-AI do?</Text>
                      <UnorderedList color={"#134E48"} fontSize={"20px"}>
                        <ListItem>Provide intuitive and easy-to-understand answers to your data-related questions</ListItem>
                        <ListItem>Uncover patterns in your spending habits, fitness progress, and behavior changes over time</ListItem>
                        <ListItem>Many more advanced features upcoming. Watch this space!</ListItem>
                      </UnorderedList>
                      <Text fontWeight={"600"} fontSize={"24px"} color={"#107569"}>Limitations </Text>
                      <UnorderedList color={"#134E48"} fontSize={"20px"}>
                        <ListItem>May occasionally provide incorrect or inappropriate responses. If this happens please leave feedback so we can improve the system.</ListItem>
                        <ListItem>As this is a demonstration and Pri-AI is not actually accessing your data answers will not be specific to you but rather plausible answers based on  assumptions.</ListItem>
                        <ListItem>This is a simulated experience based on limited data. The main goal is to demonstrate how you might interact with a data source and personal personals AI like this.</ListItem>
                        <ListItem>Although this is a demonstration you can rest assured that everything you see here here(and much more) is possible within Prifina’s personal data ecosystem</ListItem>
                      </UnorderedList>
                      <Accordion variant={"prifina"} allowToggle>
                        <AccordionItem>
                          {({ isExpanded }) => (
                            <>
                              {isExpanded ? (
                                <div style={{backgroundColor:"#F9FAFB", borderRadius:"16px"}}>
                                    <AccordionButton>
                                      <img src={close} alt="Close Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>What is Prifina?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
                                  <Text color={"#134E48"}>Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.</Text>
                                  </AccordionPanel>
                                </div>
                              ): (
                                <div>
                                    <AccordionButton>
                                      <img src={open} alt="Open Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>What is Prifina?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <Text color={"#134E48"}>Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.</Text>
                                  </AccordionPanel>
                                </div>
                              )}
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem>
                          {({ isExpanded }) => (
                            <>
                              {isExpanded ? (
                                <div style={{backgroundColor:"#F9FAFB", borderRadius:"16px"}}>
                                    <AccordionButton>
                                      <img src={close} alt="Close Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>What is holistic personal data?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
                                  <Text color={"#134E48"}>Your data is the key to unlocking new experiences, and our system makes it better. By bringing your data together from different sources and enhancing it, you'll have a holistic data source that can be used to create personalized experiences that meet your unique needs.</Text>
                                  </AccordionPanel>
                                </div>
                              ): (
                                <div>
                                    <AccordionButton>
                                      <img src={open} alt="Open Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>What is holistic personal data?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <Text color={"#134E48"}>Your data is the key to unlocking new experiences, and our system makes it better. By bringing your data together from different sources and enhancing it, you'll have a holistic data source that can be used to create personalized experiences that meet your unique needs.</Text>
                                  </AccordionPanel>
                                </div>
                              )}
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem>
                          {({ isExpanded }) => (
                            <>
                              {isExpanded ? (
                                <div style={{backgroundColor:"#F9FAFB", borderRadius:"16px"}}>
                                    <AccordionButton>
                                      <img src={close} alt="Close Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>How does Pri-AI work?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
                                  <Text color={"#134E48"}>At the core of each Prifina account are two things; your data and your own personal AI assistant. Your AI-powered personal assistant lives in your secure personal data cloud and connects the dots in your data for a holistic view of you. Pri-AI helps categorize and enrich incoming data into a reusable holistic data source and then gives you the ability to interact with your data via the AI Chatbot you see demoed here.</Text>
                                  </AccordionPanel>
                                </div>
                              ): (
                                <div>
                                    <AccordionButton>
                                      <img src={open} alt="Open Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>How does Pri-AI work?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <Text color={"#134E48"}>At the core of each Prifina account are two things; your data and your own personal AI assistant. Your AI-powered personal assistant lives in your secure personal data cloud and connects the dots in your data for a holistic view of you. Pri-AI helps categorize and enrich incoming data into a reusable holistic data source and then gives you the ability to interact with your data via the AI Chatbot you see demoed here.</Text>
                                  </AccordionPanel>
                                </div>
                              )}
                            </>
                            
                          )}
                        </AccordionItem>
                        <AccordionItem>
                          {({ isExpanded }) => (
                            <>
                              {isExpanded ? (
                                <div style={{backgroundColor:"#F9FAFB", borderRadius:"16px"}}>
                                    <AccordionButton>
                                      <img src={close} alt="Close Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>How is my data handled in this demo experience?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
                                  <Text color={"#134E48"}>This Personal AI chat service demo records each chat session and related details. The purpose of this recording is to improve the quality of our service and for development purposes. <br/>
                                  By using this demo, you acknowledge and agree to the recording and storage of your conversation history. Furthermore, any details provided or prompts entered hereafter will be sent to and processed by Prifina and OpenAI.<br/>
                                  We want you to know that any personal information collected will be kept confidential and will not be disclosed to any third party without your consent, except as required by law.<br/>
                                  If you have any concerns about the collection, use, or storage of your personal information, please do not use this service. If you have any questions or comments about our privacy policy or practices, please feel free to contact us.<br/>
                                  Thank you for using our Personal AI chat service.</Text>
                                  </AccordionPanel>
                                </div>
                              ): (
                                <div>
                                    <AccordionButton>
                                      <img src={open} alt="Open Button" style={{marginRight: "5px"}}/>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>How is my data handled in this demo experience?</Text>
                                      </Box>
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <Text color={"#134E48"}>This Personal AI chat service demo records each chat session and related details. The purpose of this recording is to improve the quality of our service and for development purposes. <br/>
                                  By using this demo, you acknowledge and agree to the recording and storage of your conversation history. Furthermore, any details provided or prompts entered hereafter will be sent to and processed by Prifina and OpenAI.<br/>
                                  We want you to know that any personal information collected will be kept confidential and will not be disclosed to any third party without your consent, except as required by law.<br/>
                                  If you have any concerns about the collection, use, or storage of your personal information, please do not use this service. If you have any questions or comments about our privacy policy or practices, please feel free to contact us.<br/>
                                  Thank you for using our Personal AI chat service.</Text>
                                  </AccordionPanel>
                                </div>
                              )}
                            </>
                            
                          )}
                        </AccordionItem>
                      </Accordion>
                    </div>

                  </div>
                </> 
              ) : (
                <>
                  {
                    onboardingStep === 4 ? (
                        <div id="chatlog" style={{backgroundColor: "#fcfcfd",whiteSpace: "pre-wrap","overflow-y": "scroll", "scroll-behavior": "smooth", "min-height": "75vh","max-height": "75vh", "border-left": "1px solid #eaecf0", "border-top": "1px solid #eaecf0", "display": "flex", "flexDirection": "column"}}>
                          <div style={{marginTop:"auto"}}/>
                          {
                            showWelcomeMessage ? (
                              <>
                              <div style={{"width": "100%", "height": "20px", "border-bottom": "3px solid #e0faf5", "text-align": "center", marginBottom:"8px"}}>
                              <Text as={"b"} display={"inline-block"} color={"#2a9f92"} fontSize={"xs"} marginLeft={"auto"} marginRight={"auto"} paddingTop={"9px"} paddingRight={"5px"} paddingLeft={"5px"} width={"fit-content"} backgroundColor={"#fcfcfd"}>Today</Text>
                              </div>
                              <div className='response' style={{backgroundColor: "#FFFFFF", paddingLeft: "3vw",paddingRight: "10vw", paddingBottom: "2vh", paddingTop: "1vh"}}>
                                <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                                <Image src={`/assets/avatar/${selectedAvatar}`} alt="Avatar" width={{base: "30px", sm: "40px"}} marginRight={{base: "2.5vw", sm: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "-7px"}}/>
                                <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #f0f1f4", width: "100%", alignItems: "center"}}>
                                <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>{aIName}</Text>
                                <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{loginTime}</Text>
                                </div>
                                </Box>
                                
                                <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw", sm: "3.5vw"}} paddingRight={"1vw"}>
                                👋 Welcome to the Private Al demo by Prifina!<br/>
                                This demo is designed to simulate having access to all of your personal data and information available in your private data cloud, along with data from various common applications and services typically used by consumers. This includes your emails, social media accounts, wearables, calendar, smart home devices, and other public data sources. By combining these sources, we're able to provide you with the best possible answers. <br/>
                                In addition, this demo utilizes application interfaces to interact with your applications and other external services, which means it can not only answer any question you may have, but it can also take any action you ask it to do. <br/>
                                We've also customized this demo based on the personalization details you provided, so you can expect more relevant and personalized responses. <br/>
                                So, go ahead and ask your first question! We're excited to show you how our Private Al demo can provide you with realistic answers and help simplify your life. 
                                </Text>

                                
                              </div>
                              {showWelcomeOneMoreMessage?(
                                <>
                                  <div className='response' style={{backgroundColor: "#FFFFFF", paddingLeft: "3vw",paddingRight: "10vw", paddingBottom: "2vh", paddingTop: "1vh"}}>
                                    <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                                    <Image src={`/assets/avatar/${selectedAvatar}`} alt="Avatar" width={{base: "30px", sm: "40px"}} marginRight={{base: "2.5vw", sm: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "-7px"}}/>
                                    <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #f0f1f4", width: "100%", alignItems: "center"}}>
                                    <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>{aIName}</Text>
                                    <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{loginTime}</Text>
                                    </div>
                                    </Box>
                                    
                                    <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw", sm: "3.5vw"}} paddingRight={"1vw"}>
                                    ☝️Oh, One more thing before you get started. For this Demo, each session is limited 10 questions, you can see your question count in the navigation menu.<br/>
                                    Ok, go ahead and ask your first question! We're excited to show you how our Private AI demo can provide you with realistic answers and help simplify your life.
                                    </Text>
                                    
                                  </div>
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
                                {/* <div style={{"display": "flex","flexDirection": "row", "justifyContent": "space-between"}}> */}
                                {/* <span>{exchange.response.text}</span>
                                <div>
                                {exchange.response.helpful===true ? (
                                  <Button colorScheme={"green"} onClick={()=>{feedbackResponse(exchange.response.id, null)}}>Upvote</Button>
                                ):(
                                  <Button colorScheme={"gray"} onClick={()=>{feedbackResponse(exchange.response.id, true)}}>Upvote</Button>
                                )}
                                {exchange.response.helpful===false ? (
                                  <Button colorScheme={"red"} onClick={()=>{feedbackResponse(exchange.response.id, null)}}>Downvote</Button>
                                ):(
                                  <Button colorScheme={"gray"} onClick={()=>{feedbackResponse(exchange.response.id, false)}}>Downvote</Button>
                                )} */}
                                {/* </div> */}
                                <div className='prompt' style={{backgroundColor: "#f6fefc", paddingLeft: "3vw",paddingRight: "10vw", width:"100%", paddingBottom: "3vh", paddingTop: "1.5vh"}}>
                                <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                                <Image src={`/assets/avatar/Unknown.svg`} alt="Avatar" width={{base: "30px", sm: "40px"}} marginRight={{base: "2.5vw", sm: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "-7px"}}/>
                                <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #2ED3B7", width: "100%", alignItems: "center"}}>
                                <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>You ({details.name})</Text>
                                <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{timeToString(exchange.prompt.time)}</Text>
                                </div>
                                </Box>
                                <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw", sm: "3.5vw"}} paddingRight={"1vw"}>
                                {exchange.prompt.text}
                                </Text>
                                </div>
                                
                                <div className='response' style={{backgroundColor: "#FFFFFF", paddingLeft: "3vw",paddingRight: "10vw", paddingBottom: "2vh", paddingTop: "1vh"}}>
                                <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                                <Image src={`/assets/avatar/${selectedAvatar}`} alt="Avatar" width={{base: "30px", sm: "40px"}} marginRight={{base: "2.5vw", sm: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "-7px"}}/>
                                <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #f0f1f4", width: "100%", alignItems: "center"}}>
                                <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>{aIName}</Text>
                                <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{timeToString(exchange.response.time)}</Text>
                                </div>
                                </Box>
                                
                                <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw", sm: "3.5vw"}} paddingRight={"1vw"}>
                                {exchange.response.text}
                                </Text>
                                <Box display={"flex"} flexDirection={"row"} backgroundColor={"#f9fafb"} marginTop={"1vh"} marginBottom={"1vh"} paddingTop={"1vh"} paddingBottom={"1vh"} borderRadius={"0px 5px 5px 5px"} marginLeft={{base: "7vw", sm: "3vw"}}>
                                <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "2.5vw", sm: "0.5vw"}} marginRight={"auto"}>How was this response?</Text>
                                <Button variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} paddingRight={"5px"} marginRight={"5px"} marginTop={"auto"} marginBottom={"auto"} minWidth={"0vw"}><FiThumbsUp color={"#107569"}/></Button>
                                <Button variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} marginTop={"auto"} marginBottom={"auto"} paddingRight={"5px"} minWidth={"0vw"}><FiThumbsDown color={"#107569"}/></Button>
                                </Box>                          
                                </div>
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
                                <div className='response' style={{backgroundColor: "#FFFFFF", paddingLeft: "3vw",paddingRight: "10vw", paddingBottom: "2vh", paddingTop: "1vh"}}>
                                <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                                <Image src={`/assets/avatar/${selectedAvatar}`} alt="Avatar" width={{base: "30px", sm: "40px"}} marginRight={{base: "2.5vw", sm: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "-7px"}}/>
                                <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #f0f1f4", width: "100%", alignItems: "center"}}>
                                <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>{aIName}</Text>
                                <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{timeToString(chatlog[questionsUsed-1].response.time)}</Text>
                                </div>
                                </Box>
                                
                                <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw", sm: "3.5vw"}} paddingRight={"1vw"} marginBottom={"1vh"}>
                                Thank you for trying out our Pri-AI (personal AI) demo! We hope you found it helpful and informative.<br/>
                                If you enjoyed this experience, please share it with your friends and don’t forget to check back for updates! <br/>
                                Pri-AI is created with 💖 by the Prifina team. <br/>
                                At Prifina, we're committed to empowering people with their personal data to live happier and healthier lives. Pri-AI is just one piece of the Prifina puzzle.<br/>  
                                👉 Learn more about Prifina at https://www.prifina.com/<br/>
                                👉 Get involved while you wait for Pri-AI to launch by joining our Slack communityLiberty.Equality.Data.
                                </Text>
                                <Box paddingLeft={{base: "9.5vw", sm: "3.5vw"}} gap={"10px"} display={"flex"} flexDirection={{base: "column",sm: "row"}}>
                                  <Button borderRadius={"8px"} backgroundColor={"#F0FDF9"}><Text fontWeight={"600"} color={"#107569"} marginRight={"5px"}>Start a new chat</Text><ChatJS color='#107569' boxSize={6} /></Button>
                                  <Button borderRadius={"8px"} backgroundColor={"#0E9384"}><Text fontWeight={"600"} color={"#FFFFFF"} marginRight={"5px"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community</Text> <CgSlack color={"#FFFFFF"} size={"22px"}/></Button>
                                </Box>
                                </div>
                              </>
                            ) : (
                              <>
                              </>
                            )
                          }
                      </div>
                    ) : (
                      <>
                        <div id="chatlog" style={{backgroundColor: "#F6FEFC",whiteSpace: "pre-wrap","overflow-y": "scroll", "scroll-behavior": "smooth", "min-height": "77vh","max-height": "77vh", "border-left": "1px solid #eaecf0", "border-top": "1px solid #eaecf0", "display": "flex", "flexDirection": "column", justifyContent: "center", "alignItems": "center", "textAlign": "center"}}>
                          <img src={Illustration}/>
                          <Text as="b" fontSize='lg'>Finish Setting up your AI</Text>
                          <Text maxWidth={"20vw"} color="#475467">To work properly your AI needs to know more about you. Complete the onboarding to continue.</Text>
                          <div>
                            <Button width={"fit-content"} backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} marginRight={"8px"}>Exit Demo</Button>
                            <Button width={"fit-content"} color={"#FFFFFF"} backgroundColor={"#0E9384"} marginLeft={"8px"} onClick={()=>{onOpen()}}><RiLoginCircleLine size={"1.3em"} style={{transform: 'rotate(315deg)' }} />Onboarding</Button>
                          </div>
                        </div>
                      </>

                    )
                  }
                  <hr/>
                  <Flex minWidth='max-content' alignItems='center' height={"14%"}>
                      <Textarea marginLeft={"3%"} width={"85%"} rows={1} resize={"none"} value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} placeholder='Here is a sample placeholder' onKeyDown={(event)=>{if(event.key==="Shift"&&!shiftDown){setShiftDown(true)}}} onKeyUp={async (event)=>{if(event.key==="Enter"&&!shiftDown){console.log(await getResponse())}else if(event.key==="Shift"){setShiftDown(false)}}} isDisabled={loading||onboardingStep<4||questionsUsed>=10} autoFocus={true} />
                      <Button marginLeft={"1%"} marginRight={"auto"} backgroundColor={"#0e9384"} paddingLeft={"auto"} paddingRight={"auto"} type={'submit'} onClick={async ()=>{console.log(await getResponse())}} isDisabled={loading||onboardingStep<4||questionsUsed>=10}><TbSend size={"1.3em"} color={"#FFFFFF"}/></Button>
                  </Flex>
                </>
              )
            }
            
            
            
            
            {/* <Textarea rows={1} width="100%" resize={"none"} marginTop={"0.5rem"} value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} placeholder='Here is a sample placeholder' onKeyDown={(event)=>{if(event.key==="Shift"&&!shiftDown){setShiftDown(true)}}} onKeyUp={async (event)=>{console.log(prompt);console.log(chatlog);if(event.key==="Enter"&&!shiftDown){console.log("await getResponse()")}else if(event.key==="Shift"){setShiftDown(false)}}} isDisabled={loading} autoFocus={true} />
            <Button style={{"marginTop": "0.5rem"}} type={'submit'} onClick={async ()=>{console.log(await getResponse())}} isDisabled={loading}>Submit</Button>
            <Button style={{"marginTop": "0.5rem", "marginLeft": "0.5rem"}} colorScheme={"red"} onClick={()=>{setChatlog([]);setPrompt("");}}>Clear</Button>
            <Button style={{"marginTop": "0.5rem", "marginLeft": "0.5rem"}} colorScheme={"red"} onClick={()=>{console.log(chatlog)}}>Chatlog</Button>
                 */}
            </div>
          </div>
        </>
      </div>
      </>
  );
}

export default App;
