import {Box, Image, Text, Button} from "@chakra-ui/react"
import {FiExternalLink, FiThumbsUp, FiThumbsDown} from 'react-icons/fi'; 
import { timeToString } from "./utils";
import NextImage from "next/image"
export default function ChatPrompt(props) {
    return (
        <div className='prompt' style={{backgroundColor: "#f6fefc", paddingLeft: "3vw",paddingRight: "10vw", width:"100%", paddingBottom: "3vh", paddingTop: "1.5vh"}}>
        <Box display={"flex"} flexDirection={"row"} marginBottom={{base: "2vh", sm: "0vh"}}>
        <Box width={"40px"} marginRight={{base: "2.5vw", sm: "1.5vw", md: "0.5vw"}} marginBottom={{base: "-2vh", sm: "-1vh"}} position={"relative"} bottom={{base: "6px", sm: "0px", md: "-7px"}}>
            <NextImage
            src={`/assets/avatar/Unknown.svg`}
            alt="Profile pic"
            width={40}
            height={40}
            />
        </Box>
        <div style={{display:"flex", flexDirection: "row", "border-bottom": "1px solid #2ED3B7", width: "100%", alignItems: "center"}}>
        <Text as={"b"} fontSize={"sm"} color={"#107569"} display={"inline-block"} marginRight={"auto"}>You ({props.name})</Text>
        <Text fontSize={"xs"} color={"#215852"} marginTop={"auto"} marginBottom={"auto"}>{timeToString(props.prompt.time)}</Text>
        </div>
        </Box>
        <Text fontSize={"sm"} color={"#215852"} paddingLeft={{base: "9.5vw",sm:"50px", lg: "55px"}}paddingRight={"1vw"}>
        {props.prompt.text}
        </Text>
        </div>
    )
    
} 