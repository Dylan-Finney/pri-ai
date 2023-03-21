import {Box, Image, Text, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, Flex, Input, Textarea, Spacer} from "@chakra-ui/react"
import {FiExternalLink, FiThumbsUp, FiThumbsDown} from 'react-icons/fi'; 
import { timeToString } from "./utils";
import {chat as ChatJS} from "./chat"
import { CgSlack } from 'react-icons/cg';
import NextImage from "next/image"
import { useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";

function FeedbackInput({ control, name, errors,helpful }) {
    const {
      field,
      fieldState: { invalid, isTouched, isDirty },
      formState: { touchedFields, dirtyFields }
    } = useController({
      name,
      control,
      rules: { maxLength: {value: 2000, message: "Max length is 2000"} },
    });
    return (<>
        <Textarea 
            cols={3}
            onChange={field.onChange} // send value to hook form 
            onBlur={field.onBlur} // notify when input is touched/blur
            value={field.value} // input value
            name={field.name} // send down the input name
            inputRef={field.ref} // send input ref, so we can focus on input when error appear
            placeholder={helpful ? "What did you like about this response?" : "What did you not like about this response?"}
        />
        <Flex flexDir={"row"}>
        <Text fontSize={"14px"} color={errors?.type === "maxLength" ? "#cc0000" : "#000000"} fontWeight={"500"}>{field.value ? field.value.length : "0"}/2000</Text>
        <Spacer/>
        <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"}  alignSelf={"end"} >{errors?.message}</Text>
        </Flex>
      </>
    );
  }

export default function ChatResponse(props) {
    const  {isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose} = useDisclosure()
    const [helpful, setHelpful] = useState(null)
    const { register,control, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data);
        props.submitFeedback(helpful,data.feedbackDetails)
        onFeedbackClose();
      }
    
    return (
        <>
        <Modal closeOnOverlayClick={false} motionPreset="slideInBottom" isOpen={isFeedbackOpen} onClose={()=>{reset({
              feedbackDetails: ''
            });onFeedbackClose()}} size={"3xl"}>
            <ModalOverlay />
            <ModalContent style={{overflowX: "hidden", borderRadius: "10px", border: "0px solid transparent"}} width={"700px"} height={"fit-content"} minHeight={"0vh"} marginTop={"auto"} marginBottom={"auto"} padding={"35px"}>
              <ModalCloseButton onClick={()=>{onFeedbackClose();}} />
                <Flex alignContent={"center"} marginBottom="10px">
                    {
                        helpful ? (
                            <>
                                <Flex backgroundColor={"#90EE90 "} minWidth={"30px"} minHeight={"30px"} maxWidth={"30px"} maxHeight={"30px"} border={"1px solid #777777"} borderRadius={"30px"} alignItems={"center"} justifyContent={"center"}>
                                 <FiThumbsUp color={"#008000"}/>
                                </Flex>
                            </>
                        ) : (
                            <>
                                <Flex backgroundColor={"#FFC0CB"} width={"30px"} height={"30px"} border={"1px solid #777777"} borderRadius={"30px"} alignItems={"center"} justifyContent={"center"}>
                                    <FiThumbsDown color={"#FF0000 "}/>
                                </Flex>
                            </>
                        )
                    }
                    <Text marginLeft={"10px"}>Provide additonal feedback</Text>
                </Flex>
                <form style={{height: "100%", display: "contents"}} onSubmit={handleSubmit(onSubmit)}>
                <FeedbackInput control={control} name={"feedbackDetails"} errors={errors.feedbackDetails} helpful={helpful}/>

                
                {/* <textarea {...register("feedbackDetails", {
                    maxLength: {
                        value: 2000,
                        message: "Max Length is 2000"
                    }
                })}/> */}
                <Button marginTop={"10px"} type={"submit"} isDisabled={props.saving} alignSelf={"end"}>Submit feedback</Button>
                </form>
                
                
                
            </ModalContent>
        </Modal>
        <div className='response' style={{backgroundColor: "#FFFFFF", paddingLeft: "3vw",paddingRight: "10vw", paddingBottom: "2vh", paddingTop: "1vh"}}>
            <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
                <Box marginRight={{base: "2.5vw", sm: "1.5vw", md: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "0px", md: "-7px"}}>
                    <NextImage
                    src={`/assets/avatar/${props.selectedAvatar}`}
                    alt="Avatar"
                    width={40}
                    height={40}
                    />
                </Box>
                <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #f0f1f4", width: "100%", alignItems: "center"}}>
                    <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>{props.aIName}</Text>
                    <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{timeToString(props.response.time)}</Text>
                </div>
            </Box>
            
            <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw",sm:"50px", lg: "55px"}}paddingRight={"1vw"}>
            {props.response.text}
            </Text>
            {
                props.feedback === false ? (
                    <>
                    </>
                ) : (
                    <Box display={"flex"} flexDirection={"row"} backgroundColor={"#f9fafb"} marginTop={"1vh"} marginBottom={"1vh"} paddingTop={"1vh"} paddingBottom={"1vh"} borderRadius={"0px 5px 5px 5px"} marginLeft={{base: "32px",sm:"45px", lg: "47px"}}>
                    <Text as={"i"} fontSize={"0.75rem"} color={"#465756"} paddingLeft={{base: "2.5vw", sm: "5.5px", lg: "8.5px"}} marginRight={"auto"}>How was this response?</Text>
                    <Button visibility={props.response.helpful===false ? "hidden" : "unset"} isDisabled={props.response.helpful===true}  onClick={()=>{onFeedbackOpen();setHelpful(true);}} variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} paddingRight={"5px"} marginRight={"5px"} marginTop={"auto"} marginBottom={"auto"} minWidth={"0vw"}><FiThumbsUp color={"#107569"}/></Button>
                    <Button visibility={props.response.helpful===true ? "hidden" : "unset"} isDisabled={props.response.helpful===false}  onClick={()=>{onFeedbackOpen();setHelpful(false);}} variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} marginTop={"auto"} marginBottom={"auto"} paddingRight={"5px"} minWidth={"0vw"}><FiThumbsDown color={"#107569"}/></Button>
                </Box>      
                )
            }
            {
                props.end === true ? (
                    <Box marginLeft={{base: "25px",sm:"45px", lg: "47px"}} gap={"10px"} display={"flex"} flexDirection={{base: "column",sm: "row"}}>
                        <Button borderRadius={"8px"} backgroundColor={"#F0FDF9"}><Text fontWeight={"600"} color={"#107569"} marginRight={"5px"}>Start a new chat</Text><ChatJS color='#107569' boxSize={6} /></Button>
                        <Button borderRadius={"8px"} backgroundColor={"#0E9384"}><Text fontWeight={"600"} color={"#FFFFFF"} marginRight={"5px"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community</Text> <CgSlack color={"#FFFFFF"} size={"22px"}/></Button>
                    </Box>
                )  : (
                    <>
                    </>
                )
            }
                               
        </div>
        </>
    )
}