// import { Context } from "./App"
import { useContext } from "react"
import {Box, Image, Text, FormControl, Input, SimpleGrid} from "@chakra-ui/react"
import { getCountryLogo } from "../utils"
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { MdOutlineVerifiedUser,MdCheck,MdSearch } from 'react-icons/md';
import NextImage from "next/image";
import { UserContext } from "../App";
const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const yourselfModal = "/assets/yourself_modal.svg"
export default function Personalize(props){
    const [,, details,setDetails] = useContext(UserContext);
    return (
        <>
        <Box overflowY={"auto"} scrollBehavior={"smooth"} minHeight={"70vh"} maxHeight={"70vh"} marginRight={"20px"}>
                      <Box width={"48px"} marginBottom={{base: "24px", sm: "0px"}}>
                        <NextImage
                          src={yourselfModal}
                          alt={`Personalize Icon`}
                          width={48}
                          height={100}
                        />
                      </Box>
                      <Text as={"b"} fontSize={"2xl"} color={"#101828"}>Tell us about yourself</Text>
                      <Text color={"#475467"}>Give us some information about yourself so we can better personalize your experience</Text>
                      <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: 1, lg: 10}}>
                        <Box flexDirection={"column"} style={{"display": "flex", order: 1}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Full name</Text>
                        <FormControl isInvalid={details.name==="" || (props.failedSubmit && details.name === null)}>
                        <Input type={"text"} placeholder="Theresa Webb" maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, name: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.name==="" || (failedSubmit && details.name === null)? "block" : "none"}>Please provide name</FormErrorMessage> */}
                        </FormControl>
                        </Box>
                        <div style={{"display": "flex", flexDirection: "column", order: 2}}>
                        <FormControl isInvalid={details.job==="" || (props.failedSubmit && details.job === null)}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Job title</Text>
                        <Input type={"text"} placeholder="Teacher" maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, job: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.job==="" || (failedSubmit && details.job === null)? "block" : "none"}>Please provide job</FormErrorMessage> */}
                        </FormControl>
                        </div>
                        <Box order={{base: 4, lg: 3}} style={{"display": "flex", flexDirection: "column"}}>
                        
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Date of birth</Text>
                        <div style={{"display": "flex", flexDirection: "row"}}>
                        <FormControl width={"fit-content"}  isInvalid={details.monthDOB==="" || parseInt(details.monthDOB) > 31 || parseInt(details.monthDOB) < 1 ||(props.failedSubmit && (details.monthDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Month</Text>
                        <Input type={"number"} placeholder="02" width={"52px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}  onChange={(e)=>{setDetails({...details, monthDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        <FormControl width={"fit-content"} isInvalid={details.dayDOB==="" || parseInt(details.dayDOB) > 31 || parseInt(details.dayDOB) < 1 || (props.failedSubmit && (details.dayDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} onChange={(e)=>{setDetails({...details, dayDOB: e.target.value})}}>Day</Text>
                        <Input type={"number"} placeholder="19" width={"52px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, dayDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        <FormControl width={"fit-content"}  isInvalid={details.yearDOB==="" || parseInt(details.yearDOB) > 2050 || parseInt(details.yearDOB) < 1900 ||(props.failedSubmit && (details.yearDOB===null))}>
                        <div style={{"display": "flex", flexDirection: "column"}}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}  >Year</Text>
                        <Input type={"number"} placeholder="1985" width={"69px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}  onChange={(e)=>{setDetails({...details, yearDOB: e.target.value})}}></Input>
                        </div>
                        </FormControl>
                        </div>
                        {/* <FormErrorMessage display={details.dayDOB==="" || details.monthDOB==="" || details.yearDOB==="" || (failedSubmit && (details.dayDOB===null || details.monthDOB===null || details.yearDOB===null))? "block" : "none"}>Please correctly provide date of birth month, day, year.</FormErrorMessage> */}
                        
                        </Box>
                       
                        <Box order={{base: 3, lg: 4}} paddingTop={{base: "0px", sm: "21px"}} style={{"display": "flex", flexDirection: "column"}}>
                        <FormControl isInvalid={details.email==="" || (props.failedSubmit && details.email === null)}>
                        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"} >Email address</Text>
                        <Input type={"email"} placeholder="t.webb@example.com" width={"100%"} maxWidth={"336px"} height={"44px"} background={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"} onChange={(e)=>{setDetails({...details, email: e.target.value})}}></Input>
                        {/* <FormErrorMessage display={details.email==="" || (failedSubmit && details.email === null)? "block" : "none"}>Please provide email</FormErrorMessage> */}
                        </FormControl>
                        </Box>
                        <div style={{"display": "flex", flexDirection: "column", order: 5}}>
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
                            "max-width": "336px",
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
                        <div style={{"display": "flex", flexDirection: "column", order: 6}}>
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
                            "max-width": "336px",
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
                      </Box>
        </>
    )
}