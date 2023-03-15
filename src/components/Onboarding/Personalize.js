// import { Context } from "./App"
import { useContext, useRef } from "react"
import {Box, Image, Text, FormControl, Input, SimpleGrid, Flex, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel} from "@chakra-ui/react"
import { getCountryLogo } from "../utils"
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { MdOutlineVerifiedUser,MdCheck,MdSearch } from 'react-icons/md';
import NextImage from "next/image";
import { UserContext } from "../App";
import AppList from "./AppList";
const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const logoIcon = "/assets/logo_modal.svg"
const settingsIcon = "/assets/settings.svg"
const zapIcon = "/assets/zap.svg"
export default function Personalize(props){
    const [,, details,setDetails] = useContext(UserContext);
    const nameInput = useRef();
    const emailInput = useRef();
    const jobInput = useRef(); 

    return (
        <>
        <Flex flexDirection={"column"}>
          <Box marginLeft={"10px"} marginTop={"15px"} >
            <Box width={"48px"}  marginLeft={"-10px"} marginBottom={{base: "0x", sm: "0px"}}>
              <NextImage
                src={logoIcon}
                alt={`Logo Icon`}
                width={48}
                height={100}
              />
            </Box>
            <Text as={"b"} fontSize={"18px"} fontWeight={"600"} color={"#101828"}>Basic information</Text>
            <Text color={"#475467"} fontSize={"14px"} fontWeight={"400"}>Give your Pri-AI some basic information about yourself so that it can provide you with a more personalized experience.</Text>
          </Box>
          <Box marginTop={"10px"} width={"100%"} height={"1px"} backgroundColor={"#EAECF0"}/>
          <Box flexGrow={1} maxHeight={"calc(100vh - 310px)"} width={"100%"} overflowY={"auto"} scrollBehavior={"smooth"}>
          <Flex flexDir={"column"} >
            <Box marginLeft={"10px"}>
            <FormControl isInvalid={details.name==="" || (props.failedSubmit && details.name === null)}>
              <Text marginTop={"16px"} color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Full name*</Text>
              <Input  type={"text"} marginLeft={"1px"} placeholder="Theresa Webb" maxWidth={"calc(100% - 5px)"} height={"40px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, name: e.target.value})}} ></Input>
            {/* <FormErrorMessage display={details.name==="" || (failedSubmit && details.name === null)? "block" : "none"}>Please provide name</FormErrorMessage> */}
            </FormControl>
            <FormControl isInvalid={details.job==="" || (props.failedSubmit && details.job === null)}>
              <Text marginTop={"16px"} color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Job title*</Text>
              <Input type={"text"} marginLeft={"1px"} placeholder="Teacher" maxWidth={"calc(100% - 5px)"} height={"40px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, job: e.target.value})}}></Input>
            {/* <FormErrorMessage display={details.job==="" || (failedSubmit && details.job === null)? "block" : "none"}>Please provide job</FormErrorMessage> */}
            </FormControl>
            <FormControl isInvalid={details.email==="" || (props.failedSubmit && details.email === null)}>
              <Text marginTop={"16px"} color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Email address*</Text>
              <Input type={"email"} marginLeft={"1px"} placeholder="t.webb@example.com" width={"100%"} maxWidth={"calc(100% - 5px)"} height={"40px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, email: e.target.value})}}></Input>
            {/* <FormErrorMessage display={details.email==="" || (failedSubmit && details.email === null)? "block" : "none"}>Please provide email</FormErrorMessage> */}
            </FormControl>
            </Box>
            <Box marginTop={"16px"} width={"90%"} marginLeft={"auto"} marginRight={"auto"} height={"1px"} backgroundColor={"#EAECF0"}/>
            <Accordion variant={"prifina"} marginTop={"16px"} marginBottom={"16px"} allowToggle>
              <AccordionItem>
                  <AccordionButton marginLeft={"10px"} maxWidth={"calc(100% - 15px)"}  backgroundColor={"#F2F4F7"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                    <Box style={{marginRight: "5px"}}>
                      <NextImage
                      src={settingsIcon}
                      alt={`Settings Button`}
                      width={22}
                      height={23}
                      />
                    </Box>
                    <Box as="span" flex='1' textAlign='left'>
                      <Text fontWeight={400} color={"#667085"}>Advanced personalization</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                <AccordionPanel marginTop={"17px"} padding={0}>
                <Text as={"b"} marginLeft={"10px"}  fontSize={"18px"} fontWeight={"600"} color={"#101828"}>Advanced settings (optional)</Text>
                <Text marginTop={"4px"} marginLeft={"10px"} color={"#475467"} fontSize={"16px"} fontWeight={"400"}>Data is powers your AI, the more you add the better results you will get. Tell your AI more about yourself below.</Text>
                <Box marginTop={"16px"} width={"100%"} marginLeft={"auto"} marginRight={"auto"} height={"1px"} backgroundColor={"#EAECF0"}/>
                <SimpleGrid marginLeft={"10px"} marginTop={"16px"} columns={2} >
                  <div style={{"display": "flex", flexDirection: "column", order: 5, width: "95%"}}>
                  <FormControl isInvalid={details.country==="" || (props.failedSubmit && details.country === null)}>
                    <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Country</Text>
                    <div>
                      {
                        details.country === "" || details.country === null ? (
                          <>
                          </>
                        ) : (
                          <Box style={{display: "inline-flex", float: "left", "pointer-events": "none", marginRight: "-40px", marginLeft: "10px", marginTop: "11px"}}>
                            <NextImage
                              src={`/assets/country/${getCountryLogo(details.country)}`}
                              alt={`${details.country} Country Logo`}
                              width={20}
                              height={100}
                            />
                          </Box>
                        )
                      }
                    
                    
                    <CountryDropdown 
                      classes='dropdown'
                      value={details.country}
                      onChange={(val) => setDetails({...details, country: val})} 
                      whitelist={["US"]}
                      priorityOptions={["US"]}
                      showDefaultOption
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
                        "height": "44px",

                        "color": details.country === "" ? "#667085" : "#1a202c",
                        
                        /* Gray/100 */
                        "background": "#F2F4F7",
                        
                        /* Gray/300 */
                        "border": details.country === "" || (props.failedSubmit && details.country === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                        
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
                  <div style={{"display": "flex", flexDirection: "column", order: 6, width: "95%"}}>
                  <FormControl isInvalid={details.region==="" || (props.failedSubmit && details.region === null)}>
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
                      "height": "44px",

                      "color": details.region === "" ? "#667085" : "#1a202c",
                      
                      /* Gray/100 */
                      "background": "#F2F4F7",
                      
                      /* Gray/300 */
                      "border": details.region === "" || (props.failedSubmit && details.region === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                      
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
            <Accordion variant={"prifina"} marginTop={"16px"} allowToggle>
              <AccordionItem>
                <AccordionButton  marginLeft={"10px"} maxWidth={"calc(100% - 15px)"}backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                  <Box style={{marginRight: "5px"}}>
                    <NextImage
                      src={zapIcon}
                      alt={`Zap Icon`}
                      width={22}
                      height={23}
                    />
                  </Box>
                  <Box as="span" flex='1' textAlign='left'>
                      <Text fontWeight={400} color={"#667085"}>Your data profile </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel marginTop={"16px"} padding={0}>
                      <AppList/>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
          </Box>
        </Flex>
        </>
    )
}