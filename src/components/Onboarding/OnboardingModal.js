/* eslint-disable react/no-unescaped-entities */
import PageIndicator from "./PageIndicator"
import { Context, useContext, useEffect, useState } from "react"
import SetupAI from "./SetupAI"
import OnboardingSidebar from "./OnboardingSidebar"
import Train from "./Train"
import Personalize from "./Personalize"
import { UserContext } from "../App"
import NextImage from "next/image"
const privacyModal = "/assets/privacy_modal.svg"


const {Input,useMediaQuery, Flex, TagLabel, Tag, Textarea, Button, useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,Icon,ModalBody,Lorem,ModalFooter, Spinner,Text, Spacer, Box, SimpleGrid, Tooltip, Progress, ChakraProvider, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, UnorderedList, ListItem, Editable, EditablePreview, EditableInput, useEditableControls, ButtonGroup, IconButton, CheckboxIcon, FormErrorMessage, DrawerOverlay, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, Image, FormControl    } = require("@chakra-ui/react")

export default function OnboardingModal(props){
    const [onboardingStep, setOnboardingStep] = useState(0)
    const [failedSubmit, setFailedSubmit] = useState(false)
    const [aIName, , details, , selectedAvatar] = useContext(UserContext)
    useEffect(()=>{
        setFailedSubmit(false)
        switch(onboardingStep){
            case 4:
                props.onFinish()
                break
            default:
                break
        }
    }, [onboardingStep, props])
    return (
        <Modal closeOnOverlayClick={false} motionPreset="slideInBottom" isOpen={props.isOpen} onClose={props.onClose} size={"full"}>
            <ModalOverlay />
            <ModalContent style={{borderRadius: "10px", border: "0px solid transparent"}} width={{base: "100%",sm:"85%"}} height={{base: "100%",sm:"5%"}} minHeight={{base: "100%",sm:"98vh"}} marginTop={{base: "0vh",sm:"1vh"}} padding={{base: "16px", sm: "0px"}}>
              <ModalCloseButton onClick={()=>{setOnboardingStep(0); props.onClose();}} />
              <div style={{display: "flex", flexDirection: "row", "height": "100%"}}>
                {/* Left Screen of Modal */}
                <OnboardingSidebar onboardingStep={onboardingStep}/>
                {/* Right Screen of Modal */}
                <div style={{backgroundColor:"#FFFFFF", flex: 5, paddingTop: "5vh", paddingLeft: "1vw", display: "flex", flexDirection: "column", paddingRight: "10px", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", border: "10px solid transparent"}}>
                  {
                    onboardingStep === 0 ? (
                      <>
                        <SetupAI failedSubmit={failedSubmit} />
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 1 ? (
                      <>
                        <Personalize failedSubmit={failedSubmit}/>
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 2 ? (
                      <>
                        <Train />
                      </>
                    ) : (
                      <></>
                    )
                  }
                  {
                    onboardingStep === 3 ? (
                      <>
                      <Box overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"70vh"} maxHeight={"70vh"}>
                      <Box marginBottom={{base: "24px", sm: "0px"}}>
                        <NextImage
                        src={privacyModal}
                        alt={"Privacy Icon"}
                        width={48}
                        height={48}
                        />
                      </Box>
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
                          <Button border={"1px solid #D0D5DD"} backgroundColor={"#FFFFFF"} color={"#000000"} onClick={()=>{setOnboardingStep(0);props.onClose();}} width="100%">No Thanks</Button>
                          <Button backgroundColor={"#0E9384"} color={"#FFFFFF"} marginTop={"auto"} marginRight={"10px"}width="100%" onClick={()=>{setOnboardingStep(onboardingStep+1);props.onClose();}}>I'm Ok with this</Button>
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
                              if ( details.name === "" || details.name === null) {
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
                  <PageIndicator step={onboardingStep}/>
                </div>
              </div>
              
              
            </ModalContent>
          </Modal>
    )
}