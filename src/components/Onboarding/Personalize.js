// import { Context } from "./App"
import { useContext, useEffect, useRef, useState } from "react"
import {Box, Image, Text, FormControl, Input, SimpleGrid, Flex, Accordion, AccordionItem, AccordionIcon, AccordionButton, AccordionPanel, Button, Spacer} from "@chakra-ui/react"
import { getCountryLogo } from "../utils"
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { MdOutlineVerifiedUser,MdCheck,MdSearch } from 'react-icons/md';
import NextImage from "next/image";
import { AppContext, UserContext } from "../App";
import AppList from "./AppList";
import { Controller, useForm } from "react-hook-form";
import validator from 'validator';
import AppItem from "./AppItem";
const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const logoIcon = "/assets/logo_modal.svg"
const settingsIcon = "/assets/settings.svg"
const zapIcon = "/assets/zap.svg"

export default function Personalize(props){
    const [,, details,setDetails] = useContext(UserContext);
    const [ apps, mergeChosenApps ] = useContext(AppContext);
    const [tempDetails, setTempDetails] = useState({
      name: null,
      dayDOB: null,
      monthDOB: null,
      yearDOB: null,
      country: "United States",
      region: "California",
      job: null,
      email: null
    })
    const [name, setName] = useState("")

    const validate = () => {
      if ( details.name === "" || details.job === "" || details.email === "" || details.country === "" || details.region === "" || details.name === null || details.job === null || details.email === null || details.country === null || details.region === null ) {
        setFailedSubmit(true)
      } else {
        setFailedSubmit(false)
        setOnboardingStep(onboardingStep+1)
      }
    }
    const { register,control, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => {
      setDetails({...details, "name": data.name, "job": data.job, "email": data.email});
      mergeChosenApps([...data.apps_social,...data.apps_health,...data.apps_transport,...data.apps_misc])
      props.next();
    }
    

    useEffect(()=>{
      if (props.isInvalid === false){
        setDetails(tempDetails);
      }
    }, [props])


    return (
        <>
        <form style={{height: "100%", display: "contents"}} onSubmit={handleSubmit(onSubmit)}>
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
          <Box flexGrow={1} maxHeight={"calc(100vh - 293px)"} width={"100%"} overflowY={"auto"} scrollBehavior={"smooth"}>
          <Flex flexDir={"column"} >
            <Box marginLeft={"10px"}>
                <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Full name*</Text>
                <Spacer/>
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"} >{errors.name?.message}</Text>
                </Flex>
                <input {...register("name",{
                  required: "This is required",
                  maxLength: {
                    value: 50,
                    message: "Max Length is 50"
                  }
                })} aria-invalid={errors.name?.type === 'required' ? "true" : "false"} placeholder={"Theresa Webb"} style={{marginLeft:"1px", paddingLeft: "0.5rem", width: "100%", maxWidth:"calc(100% - 5px)", height:"40px", backgroundColor:"#FFFFFF", border:`${errors.name ? "2px solid #cc0000" : "1px solid #D0D5DD"}`, boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)", borderRadius:"8px"}}/>
                <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Job title*</Text>
                <Spacer/>
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"} >{errors.job?.message}</Text>
                </Flex>
                <input {...register("job",{
                  required: "This is required",
                  maxLength: {
                    value: 50,
                    message: "Max Length is 50"
                  }
                })} aria-invalid={errors.name?.type === 'required' ? "true" : "false"} placeholder={"Teacher"} style={{marginLeft:"1px", paddingLeft: "0.5rem", width: "100%", maxWidth:"calc(100% - 5px)", height:"40px", backgroundColor:"#FFFFFF", border:`${errors.job ? "2px solid #cc0000" : "1px solid #D0D5DD"}`, boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)", borderRadius:"8px"}}/>
                <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Email address*</Text>
                <Spacer/>
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"} >{errors.email?.message}</Text>
                </Flex>
                <Controller
                  control={control}
                  defaultValue={""}
                  rules={{
                    required: "This is required",
                    maxLength: {
                      value: 50,
                      message: "Max Length is 50"
                    },
                    validate: {
                      isEmail: v => validator.isEmail(v) || "Must be in email format"
                    }
                  }}
                  render={({ field: { onChange,value } }) => (
                    <Input onChange={onChange} value={value} aria-invalid={errors.name?.type === 'required' ? "true" : "false"} placeholder={"t.webb@example.com"} style={{marginLeft:"1px", paddingLeft: "0.5rem", width: "100%", maxWidth:"calc(100% - 5px)", height:"40px", backgroundColor:"#FFFFFF", border:`${errors.email ? "2px solid #cc0000" : "1px solid #D0D5DD"}`, boxShadow:"0px 1px 2px rgba(16, 24, 40, 0.05)", borderRadius:"8px"}} />
                  )}
                  name="email"
                />

              {/* <BasicInfo register={(temp)=>{return register(temp)}} isInvalid={props.isInvalid} details={tempDetails} setDetails={(details)=>{setTempDetails(details)}} onDataChanged={(tempDetails) => console.log(tempDetails)} /> */}
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
                  <FormControl isInvalid={tempDetails.country==="" || (props.failedSubmit && tempDetails.country === null)}>
                    <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Country</Text>
                    <div>
                      {
                        tempDetails.country === "" || tempDetails.country === null ? (
                          <>
                          </>
                        ) : (
                          <Box style={{display: "inline-flex", float: "left", "pointer-events": "none", marginRight: "-40px", marginLeft: "10px", marginTop: "11px"}}>
                            <NextImage
                              src={`/assets/country/${getCountryLogo(tempDetails.country)}`}
                              alt={`${tempDetails.country} Country Logo`}
                              width={20}
                              height={100}
                            />
                          </Box>
                        )
                      }
                    
                    
                    <CountryDropdown 
                      classes='dropdown'
                      value={tempDetails.country}
                      onChange={(val) => setTempDetails({...tempDetails, country: val})} 
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

                        "color": tempDetails.country === "" ? "#667085" : "#1a202c",
                        
                        /* Gray/100 */
                        "background": "#F2F4F7",
                        
                        /* Gray/300 */
                        "border": tempDetails.country === "" || (props.failedSubmit && tempDetails.country === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                        
                        /* Shadow/xs */
                        "box-shadow": "0px 1px 2px rgba(16, 24, 40, 0.05)",
                        "border-radius": "8px",
                        
                        /* Inside auto layout */
                        "flex": "none",
                        "order": "1",
                        "align-self": "stretch",
                        "flex-grow": "0"}}/>
                    </div>
                    {/* <FormErrorMessage display={tempDetails.country==="" || (failedSubmit && tempDetails.country === null)? "block" : "none"}>Please provide country</FormErrorMessage> */}
                  </FormControl>
                  </div>
                  <div style={{"display": "flex", flexDirection: "column", order: 6, width: "95%"}}>
                  <FormControl isInvalid={tempDetails.region==="" || (props.failedSubmit && tempDetails.region === null)}>
                  <div>
                  <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >State</Text>
                  <MdSearch
                  size={"1.5rem"}
                  style={{float: "left", "pointer-events": "none", marginRight: "-40px", marginLeft: "10px", marginTop: "11px"}}
                  />
                  <RegionDropdown
                  country={tempDetails.country}
                  value={tempDetails.region}
                  onChange={(val) => setTempDetails({...tempDetails, region: val})} 
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

                      "color": tempDetails.region === "" ? "#667085" : "#1a202c",
                      
                      /* Gray/100 */
                      "background": "#F2F4F7",
                      
                      /* Gray/300 */
                      "border": tempDetails.region === "" || (props.failedSubmit && tempDetails.region === null ) ?  "1px solid #e43e3e" : "1px solid #D0D5DD",
                      
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
                  {/* <FormErrorMessage display={tempDetails.region==="" || (failedSubmit && tempDetails.region === null)? "block" : "none"}>Please provide region</FormErrorMessage> */}
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
                        <Controller
                          control={control}
                          defaultValue={[]}
                          render={({ field: { onChange, value} }) => (
                          <>
                            <AppItem onChange={onChange} value={value} title={"Social & Streaming"} apps={apps.filter(app=>app.tags.includes("Social"))} />
                          </>
                            
                          )}
                          name="apps_social"
                        />
                        <Controller
                          control={control}
                          defaultValue={[]}
                          render={({ field: { onChange,value } }) => (
                          <>
                            <AppItem onChange={onChange} value={value} title={"Health & Fitness"} apps={apps.filter(app=>app.tags.includes("Health"))} />
                          </>
                            
                          )}
                          name="apps_health"
                        />
                        <Controller
                          control={control}
                          defaultValue={[]}
                          render={({ field: { onChange,value } }) => (
                          <>
                            <AppItem onChange={onChange} value={value} title={"Transport"} apps={apps.filter(app=>app.tags.includes("Transport"))} />
                          </>
                            
                          )}
                          name="apps_transport"
                        />
                        <Controller
                          control={control}
                          defaultValue={[]}
                          render={({ field: { onChange,value } }) => (
                          <>
                            <AppItem onChange={onChange} value={value} title={"Misc"} apps={apps.filter(app=>app.tags.includes("Misc"))}  />
                          </>
                            
                          )}
                          name="apps_misc"
                        />
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
          </Box>
        </Flex>
        <Box width={"100%"} marginTop={"auto"} paddingLeft={"100px"} height={"1px"} backgroundColor={"#EAECF0"}/>
        <div style={{"marginTop": "20px","display": "flex", "flexDirection": "row", "gap": "10px", "marginBottom": "3vh"}}>
          <Button border={"1px solid #D0D5DD"} backgroundColor={"#FFFFFF"} color={"#000000"} onClick={()=>{props.goBack()}} width="100%">No Thanks</Button>
          <Button type="submit" backgroundColor={"#0E9384"} color={"#FFFFFF"} marginTop={"auto"} marginRight={"10px"} width="100%">Continue</Button>
            {/* <input type="submit"/> */}
        </div>
        </form>
        </>
    )
}