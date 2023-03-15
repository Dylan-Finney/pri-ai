
import { useContext, useState } from "react"
import {Box, Image, Text, FormControl, Input, SimpleGrid} from "@chakra-ui/react"
const trainModal = "/assets/train_modal.svg"
import AppButton from "./AppButton"
import AppList from "./AppList"
import { getAppLogo } from "../utils";
import { AppContext } from "../App";
import NextImage from "next/image"
const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const yourselfModal = "/assets/yourself_modal.svg"

export default function Train(props){
    const [chosenTrainTab, setChosenTrainTab] = useState("Social")
    const [apps, chosenApps, add, remove] = useContext(AppContext);
    return (
        <>
        <Box marginBottom={{base: "24px", sm: "0px"}}>
          <NextImage
          src={trainModal}
          alt={"Train Icon"}
          width={48}
          height={48}
          />
        </Box>
        <Text as={"b"} fontSize={"2xl"} color={"#101828"}>Train your AI</Text>
        <Text color={"#475467"}>Data is powers your AI, the more you add the better results you will get. Select the apps you use below to train your AI!</Text>
        <Box display={{base: "none", sm:"block"}} height={"fit-content"} overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"38%"} maxHeight={"60%"}  marginBottom={"10px"}>
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
          <SimpleGrid column={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
          {
            apps.filter(app=>app.tags.includes(chosenTrainTab)).map((app)=>{
              return (
                <>
                {
                  chosenApps.includes(app.name) ? (
                      <>
                      <AppButton name={app.name} source={getAppLogo(app.name)} checked={true} click={()=>{remove(app)}}/>
                    </>
                  ) : (
                    <>
                      <AppButton name={app.name} source={getAppLogo(app.name)} checked={false} click={()=>{add(app)}}/>
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
            <AppList/>
            <Text>Test</Text>
        </Box> 
      </>
    )
}