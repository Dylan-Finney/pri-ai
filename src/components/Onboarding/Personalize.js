// import { Context } from "./App"
import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Image,
  Text,
  FormControl,
  Input,
  SimpleGrid,
  Flex,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Button,
  Spacer,
  Editable,
  EditablePreview,
  EditableC,
  EditableInput,
  Textarea,
  InputGroup,
} from "@chakra-ui/react";
import { getCountryLogo } from "../utils";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { MdOutlineVerifiedUser, MdCheck, MdSearch } from "react-icons/md";
// import { Image } from "@chakra-ui/react";
import { AppContext, UserContext } from "../App";
import AppList from "./AppList";
import { Controller, useForm } from "react-hook-form";
import validator from "validator";
import AppItem from "./AppItem";
const logoIcon = "/assets/logo_modal.svg";
const settingsIcon = "/assets/settings.svg";
const zapIcon = "/assets/zap.svg";

export default function Personalize(props) {
  const [, , details, setDetails] = useContext(UserContext);
  const [apps, mergeChosenApps] = useContext(AppContext);
  const [tempDetails, setTempDetails] = useState({
    name: null,
    dayDOB: null,
    monthDOB: null,
    yearDOB: null,
    country: "United States",
    region: "California",
    job: null,
    email: null,
  });
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [email, setEmail] = useState("");
  const [chosenApps, setChosenApps] = useState({
    Social: [],
    Health: [],
    Transport: [],
    Misc: [],
  });
  const [errors, setErrors] = useState({
    name: undefined,
    email: undefined,
    job: undefined,
  });

  const validate = () => {
    if (
      details.name === "" ||
      details.job === "" ||
      details.email === "" ||
      details.country === "" ||
      details.region === "" ||
      details.name === null ||
      details.job === null ||
      details.email === null ||
      details.country === null ||
      details.region === null
    ) {
      // setFailedSubmit(true);
    } else {
      // setFailedSubmit(false);
      onSubmit(details);
      setOnboardingStep(onboardingStep + 1);
    }
  };
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   watch,
  //   formState: { errors2 },
  // } = useForm();
  const onSubmit = (data) => {
    setDetails({
      ...details,
      name: data.name,
      job: data.job,
      email: data.email,
    });
    mergeChosenApps([
      ...data.apps_social,
      ...data.apps_health,
      ...data.apps_transport,
      ...data.apps_misc,
    ]);
    props.next();
  };

  useEffect(() => {
    if (props.isInvalid === false) {
      setDetails(tempDetails);
    }
  }, [props]);

  return (
    <>
      <Flex flexDirection={"column"}>
        <Box marginLeft={"10px"} marginTop={"15px"}>
          <Box
            width={"48px"}
            marginLeft={"-10px"}
            marginBottom={{ base: "0x", sm: "0px" }}
          >
            <Image
              src={logoIcon}
              alt={`Logo Icon`}
              htmlWidth={48}
              htmlHeight={100}
            />
          </Box>
          <Text as={"b"} fontSize={"18px"} fontWeight={"600"} color={"#101828"}>
            Basic information
          </Text>
          <Text color={"#475467"} fontSize={"14px"} fontWeight={"400"}>
            Give your Pri-AI some basic information about yourself so that it
            can provide you with a more personalized experience.
          </Text>
        </Box>
        <Box
          marginTop={"10px"}
          width={"100%"}
          height={"1px"}
          backgroundColor={"#EAECF0"}
        />
        <Box
          flexGrow={1}
          maxHeight={"calc(100vh - 293px)"}
          width={"100%"}
          overflowY={"auto"}
          scrollBehavior={"smooth"}
        >
          <Flex flexDir={"column"}>
            <Box marginLeft={"10px"}>
              <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}>
                  Full name*
                </Text>
                <Spacer />
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"}>
                  {errors.name?.message}
                </Text>
              </Flex>
              <InputGroup>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={"Theresa Webb"}
                  marginLeft={"1px"}
                  paddingRight={"0.5rem"}
                  width={"100%"}
                  maxWidth={"calc(100% - 5px)"}
                  height={"40px"}
                  backgroundColor={"white"}
                  border={`${
                    errors.name !== undefined
                      ? "2px solid #cc0000"
                      : "1px solid #D0D5DD"
                  }`}
                  boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  borderRadius={"8px"}
                />
              </InputGroup>

              <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}>
                  Job title*
                </Text>
                <Spacer />
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"}>
                  {errors.job?.message}
                </Text>
              </Flex>
              <InputGroup>
                <Input
                  value={job}
                  onChange={(event) => setJob(event.target.value)}
                  placeholder={"Theresa Webb"}
                  marginLeft={"1px"}
                  paddingRight={"0.5rem"}
                  width={"100%"}
                  maxWidth={"calc(100% - 5px)"}
                  height={"40px"}
                  backgroundColor={"white"}
                  border={`${
                    errors.job !== undefined
                      ? "2px solid #cc0000"
                      : "1px solid #D0D5DD"
                  }`}
                  boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  borderRadius={"8px"}
                />
              </InputGroup>

              <Flex flexDir={"row"} marginTop={"16px"}>
                <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}>
                  Email address*
                </Text>
                <Spacer />
                <Text color={"#cc0000"} fontSize={"14px"} fontWeight={"500"}>
                  {errors.email?.message}
                </Text>
              </Flex>
              <InputGroup>
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={"Theresa Webb"}
                  marginLeft={"1px"}
                  paddingRight={"0.5rem"}
                  width={"100%"}
                  maxWidth={"calc(100% - 5px)"}
                  height={"40px"}
                  backgroundColor={"white"}
                  border={`${
                    errors.email !== undefined
                      ? "2px solid #cc0000"
                      : "1px solid #D0D5DD"
                  }`}
                  boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  borderRadius={"8px"}
                />
              </InputGroup>
              {/* <BasicInfo register={(temp)=>{return register(temp)}} isInvalid={props.isInvalid} details={tempDetails} setDetails={(details)=>{setTempDetails(details)}} onDataChanged={(tempDetails) => console.log(tempDetails)} /> */}
            </Box>
            <Box
              marginTop={"16px"}
              width={"90%"}
              marginLeft={"auto"}
              marginRight={"auto"}
              height={"1px"}
              backgroundColor={"#EAECF0"}
            />
            <Accordion
              variant={"prifina"}
              marginTop={"16px"}
              marginBottom={"16px"}
              allowToggle
            >
              <AccordionItem>
                <AccordionButton
                  marginLeft={"10px"}
                  maxWidth={"calc(100% - 15px)"}
                  backgroundColor={"#F2F4F7"}
                  border={"1px solid #D0D5DD"}
                  boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                  borderRadius={"8px"}
                >
                  <Box style={{ marginRight: "5px" }}>
                    <Image
                      src={settingsIcon}
                      alt={`Settings Button`}
                      htmlWidth={22}
                      htmlHeight={23}
                    />
                  </Box>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight={400} color={"#667085"}>
                      Advanced personalization
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel marginTop={"17px"} padding={0}>
                  <Text
                    as={"b"}
                    marginLeft={"10px"}
                    fontSize={"18px"}
                    fontWeight={"600"}
                    color={"#101828"}
                  >
                    Advanced settings (optional)
                  </Text>
                  <Text
                    marginTop={"4px"}
                    marginLeft={"10px"}
                    color={"#475467"}
                    fontSize={"16px"}
                    fontWeight={"400"}
                  >
                    Data is powers your AI, the more you add the better results
                    you will get. Tell your AI more about yourself below.
                  </Text>
                  <Box
                    marginTop={"16px"}
                    width={"100%"}
                    marginLeft={"auto"}
                    marginRight={"auto"}
                    height={"1px"}
                    backgroundColor={"#EAECF0"}
                  />
                  <SimpleGrid
                    marginLeft={"10px"}
                    marginTop={"16px"}
                    columns={2}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        order: 5,
                        width: "95%",
                      }}
                    >
                      {/* <FormControl
                        isInvalid={
                          tempDetails.country === "" ||
                          (props.failedSubmit && tempDetails.country === null)
                        }
                      > */}
                      <Text
                        color={"#344054"}
                        fontSize={"14px"}
                        fontWeight={"500"}
                      >
                        Country
                      </Text>
                      <div>
                        {tempDetails.country === "" ||
                        tempDetails.country === null ? (
                          <></>
                        ) : (
                          <Box
                            style={{
                              display: "inline-flex",
                              float: "left",
                              "pointer-events": "none",
                              marginRight: "-40px",
                              marginLeft: "10px",
                              marginTop: "11px",
                            }}
                          >
                            <Image
                              src={`/assets/country/${getCountryLogo(
                                tempDetails.country
                              )}`}
                              alt={`${tempDetails.country} Country Logo`}
                              htmlWidth={20}
                              htmlHeight={100}
                            />
                          </Box>
                        )}

                        <CountryDropdown
                          classes="dropdown"
                          value={tempDetails.country}
                          onChange={(val) =>
                            setTempDetails({ ...tempDetails, country: val })
                          }
                          whitelist={["US"]}
                          priorityOptions={["US"]}
                          showDefaultOption
                          style={{
                            "box-sizing": "border-box",
                            appearance: "none",

                            /* Auto layout */
                            display: "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            padding: "10px 14px",
                            "padding-left": "40px",
                            gap: "8px",

                            width: "100%",
                            height: "44px",

                            color:
                              tempDetails.country === ""
                                ? "#667085"
                                : "#1a202c",

                            /* Gray/100 */
                            background: "#F2F4F7",

                            /* Gray/300 */
                            border:
                              tempDetails.country === "" ||
                              (props.failedSubmit &&
                                tempDetails.country === null)
                                ? "1px solid #e43e3e"
                                : "1px solid #D0D5DD",

                            /* Shadow/xs */
                            "box-shadow": "0px 1px 2px rgba(16, 24, 40, 0.05)",
                            "border-radius": "8px",

                            /* Inside auto layout */
                            flex: "none",
                            order: "1",
                            "align-self": "stretch",
                            "flex-grow": "0",
                          }}
                        />
                      </div>
                      {/* <FormErrorMessage display={tempDetails.country==="" || (failedSubmit && tempDetails.country === null)? "block" : "none"}>Please provide country</FormErrorMessage> */}
                      {/* </FormControl> */}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        order: 6,
                        width: "95%",
                      }}
                    >
                      {/* <FormControl
                        isInvalid={
                          tempDetails.region === "" ||
                          (props.failedSubmit && tempDetails.region === null)
                        }
                      > */}
                      <div>
                        <Text
                          color={"#344054"}
                          fontSize={"14px"}
                          fontWeight={"500"}
                        >
                          State
                        </Text>
                        <MdSearch
                          size={"1.5rem"}
                          style={{
                            float: "left",
                            "pointer-events": "none",
                            marginRight: "-40px",
                            marginLeft: "10px",
                            marginTop: "11px",
                          }}
                        />
                        <RegionDropdown
                          country={tempDetails.country}
                          value={tempDetails.region}
                          onChange={(val) =>
                            setTempDetails({ ...tempDetails, region: val })
                          }
                          style={{
                            "box-sizing": "border-box",
                            appearance: "none",

                            /* Auto layout */
                            display: "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            padding: "10px 14px",
                            "padding-left": "40px",
                            gap: "8px",

                            width: "100%",
                            height: "44px",

                            color:
                              tempDetails.region === "" ? "#667085" : "#1a202c",

                            /* Gray/100 */
                            background: "#F2F4F7",

                            /* Gray/300 */
                            border:
                              tempDetails.region === "" ||
                              (props.failedSubmit &&
                                tempDetails.region === null)
                                ? "1px solid #e43e3e"
                                : "1px solid #D0D5DD",

                            /* Shadow/xs */
                            "box-shadow": "0px 1px 2px rgba(16, 24, 40, 0.05)",
                            "border-radius": "8px",

                            /* Inside auto layout */
                            flex: "none",
                            order: "1",
                            "align-self": "stretch",
                            "flex-grow": "0",
                          }}
                        />
                      </div>
                      {/* <FormErrorMessage display={tempDetails.region==="" || (failedSubmit && tempDetails.region === null)? "block" : "none"}>Please provide region</FormErrorMessage> */}
                      {/* </FormControl> */}
                    </div>
                  </SimpleGrid>
                  <Accordion variant={"prifina"} marginTop={"16px"} allowToggle>
                    <AccordionItem>
                      <AccordionButton
                        marginLeft={"10px"}
                        maxWidth={"calc(100% - 15px)"}
                        backgroundColor={"#FFFFFF"}
                        border={"1px solid #D0D5DD"}
                        boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"}
                        borderRadius={"8px"}
                      >
                        <Box style={{ marginRight: "5px" }}>
                          <Image
                            src={zapIcon}
                            alt={`Zap Icon`}
                            htmlWidth={22}
                            htmlHeight={23}
                          />
                        </Box>
                        <Box as="span" flex="1" textAlign="left">
                          <Text fontWeight={400} color={"#667085"}>
                            Your data profile{" "}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel marginTop={"16px"} padding={0}>
                        <AppItem
                          // onChange={onChange}
                          // value={value}
                          title={"Social & Streaming"}
                          activeApps={chosenApps.Social}
                          onPress={(appName) => {
                            if (!chosenApps.Social.includes(appName)) {
                              setChosenApps({
                                ...chosenApps,
                                Social: [...chosenApps.Social, appName],
                              });
                            } else {
                              setChosenApps({
                                ...chosenApps,
                                Social: chosenApps.Social.filter(
                                  (socialAppName) => socialAppName !== appName
                                ),
                              });
                            }
                          }}
                          apps={apps.filter((app) =>
                            app.tags.includes("Social")
                          )}
                        />
                        <AppItem
                          // onChange={onChange}
                          // value={value}
                          title={"Health & Fitness"}
                          activeApps={chosenApps.Social}
                          onPress={(appName) => {
                            if (!chosenApps.Health.includes(appName)) {
                              setChosenApps({
                                ...chosenApps,
                                Health: [...chosenApps.Health, appName],
                              });
                            } else {
                              setChosenApps({
                                ...chosenApps,
                                Health: chosenApps.Health.filter(
                                  (healthAppName) => healthAppName !== appName
                                ),
                              });
                            }
                          }}
                          apps={apps.filter((app) =>
                            app.tags.includes("Health")
                          )}
                        />
                        <AppItem
                          // onChange={onChange}
                          // value={value}
                          title={"Transport"}
                          activeApps={chosenApps.Transport}
                          onPress={(appName) => {
                            if (!chosenApps.Transport.includes(appName)) {
                              setChosenApps({
                                ...chosenApps,
                                Transport: [...chosenApps.Transport, appName],
                              });
                            } else {
                              setChosenApps({
                                ...chosenApps,
                                Transport: chosenApps.Transport.filter(
                                  (socialAppName) => socialAppName !== appName
                                ),
                              });
                            }
                          }}
                          apps={apps.filter((app) =>
                            app.tags.includes("Transport")
                          )}
                        />
                        <AppItem
                          // onChange={onChange}
                          // value={value}
                          title={"Misc"}
                          activeApps={chosenApps.Misc}
                          onPress={(appName) => {
                            if (!chosenApps.Misc.includes(appName)) {
                              setChosenApps({
                                ...chosenApps,
                                Misc: [...chosenApps.Misc, appName],
                              });
                            } else {
                              setChosenApps({
                                ...chosenApps,
                                Misc: chosenApps.Misc.filter(
                                  (socialAppName) => socialAppName !== appName
                                ),
                              });
                            }
                          }}
                          apps={apps.filter((app) => app.tags.includes("Misc"))}
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
      <Box
        width={"100%"}
        marginTop={"auto"}
        paddingLeft={"100px"}
        height={"1px"}
        backgroundColor={"#EAECF0"}
      />
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginBottom: "3vh",
        }}
      >
        <Button
          border={"1px solid #D0D5DD"}
          backgroundColor={"#FFFFFF"}
          color={"#000000"}
          onClick={() => {
            props.goBack();
          }}
          width="100%"
        >
          No Thanks
        </Button>
        <Button
          // type="submit"
          onClick={() => {
            // console.log({
            //   tempDetails,
            //   apps,
            //   name,
            //   job,
            //   email,
            //   chosenApps,
            // });
            var nameError;
            var emailError;
            var jobError;
            if (!name) {
              nameError = { message: "Name must not be empty" };
            } else if (name.length > 100) {
              nameError = {
                message: "Name must be less than 100 characters",
              };
            }

            if (!job) {
              jobError = { message: "Job must not be empty" };
            } else if (job.length > 100) {
              jobError = {
                message: "Job must be less than 100 characters",
              };
            }

            if (!email) {
              emailError = {
                message: "Email must not be empty",
              };
            } else if (email.length > 100) {
              emailError = {
                message: "Email must be less than 100 characters",
              };
            } else if (
              !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
            ) {
              emailError = {
                message: "Email must be in valid format",
              };
            }
            if (
              nameError === undefined &&
              jobError === undefined &&
              emailError === undefined
            ) {
              // console.log({
              //   ...details,
              //   region: tempDetails.region,
              //   name,
              //   job,
              //   email,
              // });
              setDetails({
                ...details,
                region: tempDetails.region,
                name,
                job,
                email,
              });
              mergeChosenApps([
                ...chosenApps.Social,
                ...chosenApps.Health,
                ...chosenApps.Transport,
                ...chosenApps.Misc,
              ]);
              props.next();
            } else {
              setErrors({
                name: nameError,
                email: emailError,
                job: jobError,
              });
            }
          }}
          backgroundColor={"#0E9384"}
          color={"#FFFFFF"}
          marginTop={"auto"}
          marginRight={"10px"}
          width="100%"
        >
          Continue
        </Button>
        {/* <input type="submit"/> */}
      </div>
    </>
  );
}
