import { Box, Text, Progress, Button } from "@chakra-ui/react";
import { CgSlack } from 'react-icons/cg';
import {RiCloseCircleFill, RiDeleteBin6Line, RiLoginCircleLine} from 'react-icons/ri'; 
const external = "/assets/external.svg"
const about = "/assets/about.svg"
const chat = "/assets/chat.svg"
const FAQ = "/assets/FAQ.svg"
const logo = "/assets/logo.svg"
const logout = "/assets/logout.svg"
const share = "/assets/share.svg"

export default function Sidebar(props) {
    return (
        <Box id="sidebar" display={ props.display ? props.display : "flex"} width={{base: "100%", sm: "19.5%"}} maxWidth={{base: "100%", sm: "270px"}} flexDirection={"column"} minHeight={{base: "100%", sm: "100vh"}} maxHeight={{base: "100%", sm: "100vh"}} paddingRight={{base: "0rem", sm: "1rem"}} borderRight={{base: "", sm: "1px solid #eaecf0"}}>
              <Box style={{display:"flex", flexDirection:"row", marginLeft: "10px",  marginTop: "10px"}}>
                <img src={logo} style={{ display: 'inline-block', filter: "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))" }}/>
                <Text paddingLeft={"10px"} color='#0E9384' fontWeight="700" fontSize={"20px"}>Pri-AI</Text>
              </Box>
              
              {props.section === "chat"? (
                <Box style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} textAlign={"left"} left={"2rem"}> Chat</Text>
                </Box>
                
              ) : (
                <Box onClick={()=>{props.changeSection("chat")}} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: "10vh", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={chat} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} textAlign={"left"} left={"2rem"}> Chat</Text>
                </Box>
              )}

              <Box style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}} onClick={()=>{window.open("https://beta.prifina.com/priai.html", '_blank').focus();}}>
                <img src={FAQ} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"6px"} fontWeight={"600"} textAlign={"left"} left={"2rem"}> FAQ</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </Box>

              {props.section === "about"? (
                <Box style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", backgroundColor:"#f9fafb", borderRadius:"25px"}}>
                <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                <Text as='b' marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} textAlign={"left"} left={"2rem"} > About this demo</Text>
              </Box>
              ) : (
                <Box onClick={()=>{props.changeSection("about")}} style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer"}}>
                  <img src={about} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
                  <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"3px"} fontWeight={"600"} left={"2rem"} textAlign={"left"}> About this demo</Text>
                </Box>
              )}
            <Box style={{display: "flex", flexDirection: "row", alignItems: "center", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px", borderRadius:"25px", cursor: "pointer", marginBottom: "auto"}}>
                <CgSlack color='#475467' size={"22px"} style={{flexShrink: "0"}}/>
                <Text marginTop={"auto"} marginBottom={"auto"} marginLeft={"4px"} fontWeight={"600"} left={"2rem"} textAlign={"left"}onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}> LED Slack</Text>
                <img src={external} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
            </Box>

            <Box gap={"20px"} display={{base:"flex", sm: "none"}} flexDirection={"column"} marginBottom={"auto"}>
                <Button size='sm' backgroundColor={"#f0fdf9"} color={"#107569"} marginTop={"1vh"} onClick={()=>{props.clear()}}>Clear chat <RiDeleteBin6Line/></Button>
                <Button size='sm' backgroundColor={"#0e9384"} color={"#FFFFFF"} onClick={()=>{window.open("https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ", '_blank').focus();}}>Join the community<CgSlack/></Button>
                <Button size='sm'  color={"#107569"} variant={'ghost'} >Share<img src={share} /></Button>
              </Box>
              
              

              <Box style={{padding: "20px 16px", backgroundColor: "#F0FDF9", border: "1px solid #99F6E0", borderRadius: "8px", marginLeft: "10px",marginBottom: "2vh"  }}>
                <Text fontWeight={"600"} color={"#107569"} as="b">{props.questionsUsed}/10 Questions used </Text>
                <Text fontWeight={"400"} color={"#134E48"} marginTop={"4px"} fontSize={"12px"}>For this demo session you are limited to 10 questions. </Text>
                <Progress value={10*props.questionsUsed} height={"8px"} marginTop={"16px"} borderRadius={"4px"} variant={"prifina"}/>
              </Box>
              <Box style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px", marginLeft: "10px", paddingTop: "10px", borderTop: "1px solid #eaecf0" }}>
              <img src={`/assets/avatar/Unknown.svg`} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto"}}/>
              <Text paddingLeft={"5px"} fontWeight="600">{props.name}</Text>
              <img src={logout} style={{ display: 'inline-block', marginTop: "auto", marginBottom: "auto", marginLeft: "auto"}}/>
              </Box>
              
              
            </Box>
    )
}