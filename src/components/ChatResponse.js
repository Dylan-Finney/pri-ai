import {Box, Image, Text, Button} from "@chakra-ui/react"
import {FiExternalLink, FiThumbsUp, FiThumbsDown} from 'react-icons/fi'; 
import { timeToString } from "./utils";
import {chat as ChatJS} from "./chat"
import { CgSlack } from 'react-icons/cg';
import NextImage from "next/image"
export default function ChatResponse(props) {
    return (
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
                    <Box display={"flex"} flexDirection={"row"} backgroundColor={"#f9fafb"} marginTop={"1vh"} marginBottom={"1vh"} paddingTop={"1vh"} paddingBottom={"1vh"} borderRadius={"0px 5px 5px 5px"} marginLeft={{base: "25px",sm:"45px", lg: "47px"}}>
                    <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "2.5vw", sm: "5.5px", lg: "8.5px"}} marginRight={"auto"}>How was this response?</Text>
                    <Button variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} paddingRight={"5px"} marginRight={"5px"} marginTop={"auto"} marginBottom={"auto"} minWidth={"0vw"}><FiThumbsUp color={"#107569"}/></Button>
                    <Button variant='ghost' height={"fit-content"} width={"fit-content"} paddingLeft={"5px"} marginTop={"auto"} marginBottom={"auto"} paddingRight={"5px"} minWidth={"0vw"}><FiThumbsDown color={"#107569"}/></Button>
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
    )
}