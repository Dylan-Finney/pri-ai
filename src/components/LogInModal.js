/* eslint-disable react/no-unescaped-entities */

import HOTP from "@/utils/HOTP";
import {
  autoSignIn,
  confirmSignIn,
  confirmSignUp,
  signIn,
  signUp,
} from "aws-amplify/auth";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const dataCloudIcon = "/assets/data-cloud.svg";
const {
  Input,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
} = require("@chakra-ui/react");

const VerificationInput = ({ error, changeAuthCode }) => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (index, value) => {
    // console.log({ value });
    const newInputValues = [...inputValues];
    // newInputValues[index] = value;
    if (value.length < 2 && /^\d?$/.test(value)) {
      newInputValues[index] = value;
      setInputValues(newInputValues);
      changeAuthCode(newInputValues.join(""));
    } else if (value.length === 2 && /^\d+$/.test(value)) {
      console.log("DO");
      console.log(inputValues[index + 1]);
      console.log(`${inputValues[index + 1]}${value}`.length === 1);
      console.log(value.slice(-1));
      if (
        `${inputValues[index + 1]}${value.slice(1)}`.length === 1 &&
        /^\d?$/.test(value.slice(-1))
      ) {
        newInputValues[index + 1] = value.slice(-1);
        inputRefs[index + 1].current.focus();
        setInputValues(newInputValues);
        changeAuthCode(newInputValues.join(""));
      }
    }

    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };
  return (
    <>
      <Flex justifyContent={"space-between"}>
        {inputValues.map((value, index) => (
          <Input
            color={"#6c757d"}
            borderColor={error ? "#dc3545" : "black"}
            width={"50px"}
            textAlign={"center"}
            key={index}
            ref={inputRefs[index]}
            inputMode="numeric"
            maxLength={2}
            value={value}
            onKeyDown={(event) => {
              if (
                event.key === "Backspace" &&
                inputValues[index] === "" &&
                index > 0
              ) {
                const newInputValues = [...inputValues];
                newInputValues[index - 1] = "";
                setInputValues(newInputValues);
                changeAuthCode(newInputValues.join(""));
                inputRefs[index - 1].current.focus();
              }
            }}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </Flex>
      <Text
        color={"#dc3545"}
        visibility={error === true ? "visible" : "hidden"}
      >
        Incorrect code. Please try again
      </Text>
    </>
  );
};

const Text3 = ({ main, sub, onClick }) => {
  return (
    <Text color={"#4a4a4a"}>
      {main}{" "}
      <span style={{ color: "#0085ff" }} onClick={onClick}>
        {sub}
      </span>
    </Text>
  );
};

const CustomButton = ({ text, loading = false, onClick }) => {
  return (
    <Button
      // position={"inherit"}
      width={"100%"}
      borderColor={"#ced4da"}
      backgroundColor={"#107569"}
      color={"white"}
      isLoading={loading}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

const HeadingText = ({ text }) => {
  return (
    <Text
      // noOfLines={{ 1}}
      noOfLines={{ base: 4, md: 1 }}
      color={"#4a4a4a"}
      // overflowX={""}
      whiteSpace={"revert"}
      textAlign={"center"}
      fontWeight={700}
      fontSize={"38px"}
    >
      {text}
    </Text>
  );
};

const SubtitleText = ({ text }) => {
  return (
    <Text
      // noOfLines={1}
      color={"#4a4a4a"}
      // overflowX={""}
      whiteSpace={"revert"}
      textAlign={"center"}
      // fontWeight={700}
      // fontSize={"38px"}
      marginBottom={"50px"}
    >
      {text}
    </Text>
  );
};

export default function LoginModal({ isOpen, onClose, onOpen, logInSuccess }) {
  const screens = {
    signup: 0,
    login: 1,
  };
  const [screen, setScreen] = useState(screens.signup);
  const [stage, setStage] = useState(0);

  const [username, setUsername] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [otpauth, setOtpauth] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState("");
  const [loadingUserExists, setLoadingUserExists] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  //   (async () => {
  //     try {
  //      // console.log(await getCurrentUser());
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();

  function base32Encode(input) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let output = "";
    let v = 0;
    let vBits = 0;

    for (let i = 0; i < input.length; i++) {
      v <<= 8; // Shift the previous bits left
      v += input.charCodeAt(i); // Add the new byte
      vBits += 8; // 8 bits added from the character

      while (vBits >= 5) {
        output += alphabet[(v >>> (vBits - 5)) & 31]; // Extract the top 5 bits
        vBits -= 5; // We've used 5 bits
      }
    }

    // Deal with the final bits
    if (vBits > 0) {
      v <<= 5 - vBits; // Move the bits to the correct position
      output += alphabet[v & 31];
    }

    // console.log("BASE32 OUT ", output);
    // Padding to make the output length a multiple of 8
    while (output.length % 8 !== 0) {
      output += "=";
    }

    return output;
  }

  const generateSecureRandomString = (length = 16) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    const possibleCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let result = "";
    const charactersLength = possibleCharacters.length;
    for (let i = 0; i < length; i++) {
      result += possibleCharacters.charAt(array[i] % charactersLength);
    }
    return result;
  };

  function getTotpUrl(secretRaw, issuerRaw, accountRaw) {
    const issuer = encodeURIComponent(issuerRaw);
    const accountName = encodeURIComponent(accountRaw);
    const secret = base32Encode(secretRaw); // This should be Base32 encoded

    const totpURL = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
    //otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30
    // console.log(totpURL);
    return totpURL;
  }

  function generateValidPassword(length = 16) {
    const numbers = "0123456789";
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const specialCharacters = "^$*.[]{}()?-\"!@#%&/\\,><':;|_`~+="; // Added space as a special character
    const allCharacters =
      numbers + upperCaseLetters + lowerCaseLetters + specialCharacters;

    // Ensure the password contains at least one character from each category
    const passwordArray = [
      numbers[Math.floor(Math.random() * numbers.length)],
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    ];

    // Generate remaining characters
    for (let i = 4; i < length; i++) {
      passwordArray.push(
        allCharacters[Math.floor(Math.random() * allCharacters.length)]
      );
    }

    // Shuffle the array to ensure randomness
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
    shuffleArray(passwordArray);

    // Join the array to form the password string
    return passwordArray.join("");
  }

  async function handleTOTPDeviceSetup(code) {
    // const secret = "12345678901234567890"; // This should be your secret key in Base32
    const counter = Math.floor(Date.now() / (30 * 1000)); // Counter based on current time divided by validity period
    const verify = await HOTP.generateHOTP(secret.current, counter); // 30 seconds validity, 6 digit OTP
    // console.log({ code, verify });
    return code === verify;
  }

  async function handleSignUp({ username, password, email, secret }) {
    // console.log("NEW USER ", username);
    // console.log("NEW USER ", user.current);
    try {
      let payload = {
        username,
        password,
        options: {
          userAttributes: {
            email,
            name: username, // preferred username can't be set for unconfirmed user
            "custom:authenticator_status": "0",
            /*  phone_number // E.164 number convention */
          },
          // optional
          autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        },
      };
      if (secret) {
        payload.options.userAttributes["custom:authenticator_secret"] = secret;
      }

      const { isSignUpComplete, userId, nextStep } = await signUp(payload);
      /* await signUp({
        username: 'jdoe',
        password: 'mysecurerandompassword#123',
        options: {
          userAttributes: {
            email: 'me@domain.com',
            phone_number: '+12128601234', // E.164 number convention
            given_name: 'Jane',
            family_name: 'Doe',
            nickname: 'Jane'
          }
        }
      }); 
      options: {
    userAttributes: {
      'custom:attribute_name_1': 'attribute_value_1',
      'custom:attribute_name_2': 'attribute_value_2',
      'custom:attribute_name_3': 'attribute_value_3'
    }
  }
      */
      // console.log(userId);
      // console.log(nextStep);
      // console.log(isSignUpComplete);
      /*
      {
        "signUpStep": "CONFIRM_SIGN_UP",
        "codeDeliveryDetails": {
            "deliveryMedium": "EMAIL",
            "destination": "t***@g***",
            "attributeName": "email"
        }
    }
    */

      // if this doesn't work then most likely the cognito tokens already exists in localstorage... delete all and start again
      if (isSignUpComplete && nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        const signInOutput = await autoSignIn();
        // console.log("AUTO SIGN IN ", signInOutput);
        if (signInOutput.isSignedIn) {
          return true;
        } else {
          setError("Reload and attempt sign in");
          return false;
        }
      }
      setError("Error signing up");
      return false;
    } catch (error) {
      // console.log("error signing up:", error);
      setError("Error signing up");
      return false;
    }
  }

  useEffect(() => {
    // Client-side-only code
    secret.current = generateSecureRandomString();
    setStage(0);
    setEditedUsername("");
  }, [isOpen]);

  const secret = useRef();

  const handleCustomSignIn = async (username) => {
    try {
      const { nextStep } = await signIn({
        username,
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
        },
      });
      // console.log({ nextStep });
      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
        setShowAuthCode(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error({ e });
      switch (e.name) {
        case "UserNotFoundException":
          setError("User does not exist");
          break;
        default:
          setError("Login Error");
          break;
      }
      return false;
    }
  };

  const handleSignInVerify = async () => {
    try {
      const output = await confirmSignIn({
        challengeResponse: authCode,
      });
      // console.log({ output });
      return output.isSignedIn;

      //   if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
      //     setShowAuthCode(true);
      //   }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setError("");
  }, [screen, stage]);

  const checkIfUseDoesNotExists = async (username) => {
    try {
      await confirmSignUp({
        username,
        confirmationCode: "000000",
        forceAliasCreation: false,
      });
      // console.log("test");
      return false;
    } catch (err) {
      // console.log(err.name);
      switch (err.name) {
        case "UserNotFoundException":
          // console.log("test2");
          return true;
        case "NotAuthorizedException":
          return false;
        case "AliasExistsException":
          return false;
        case "CodeMismatchException":
          return false;
        case "ExpiredCodeException":
          return false;
        default:
          return false;
      }
    }
  };

  // useEffect(())

  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      // width={"95vw"}
      isOpen={isOpen}
      onClose={onClose}
      // size={"full"}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        style={{ borderRadius: "10px", border: "0px solid transparent" }}
        width={{ base: "100%", md: "1500px" }}
        minWidth={{ base: "100%", md: "1500px" }}
        // height={{ base: "100%", md: "85vh" }}
        // maxHeight={{ base: "100%", md: "200px" }}
        minHeight={{ base: "100%", md: "800px" }}
        marginTop={"auto"}
        marginBottom={"auto"}
      >
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <ModalBody
          display={"flex"}
          paddingLeft={"0px"}
          paddingRight={"0px"}
          paddingTop={"0px"}
          paddingBottom={"0px"}
        >
          {stage === 0 ? (
            <Flex
              flex={1}
              flexDirection={"column"}
              alignItems={"center"}
              marginTop={{ base: "10px", md: "100px" }}
              marginBottom={{ base: "10px", md: "100px" }}
              marginLeft={{ base: "10px", md: "400px" }}
              marginRight={{ base: "10px", md: "400px" }}
            >
              <NextImage
                src={dataCloudIcon}
                alt={`Settings Button`}
                width={150}
                height={150}
              />
              <HeadingText
                text={
                  screen === screens.signup
                    ? `Create your DataCloud account`
                    : `Log in with DataCloud account`
                }
              />
              <SubtitleText
                text={
                  screen === screens.signup
                    ? ` To create a new account please download FreeOTP Authenticator app
              on your mobile device. Available on both App store and Google play`
                    : `Keep your phone ready for two-factor authentication.`
                }
              />
              <Text alignSelf={"flex-start"}>Username: </Text>
              <Input
                borderColor={error !== "" ? "#dc3545" : "#ced4da"}
                //   placeholder="username"
                color={"#6c757d"}
                value={editedUsername}
                // disabled={}
                onChange={(event) => {
                  setEditedUsername(event.target.value);
                }}
              ></Input>

              <Text
                whiteSpace={"inherit"}
                visibility={
                  screen !== screens.login || error !== ""
                    ? "visible"
                    : "hidden"
                }
                alignSelf={"flex-start"}
                style={{ color: error !== "" ? "red" : "black" }}
              >
                {error === ""
                  ? "Username can contain letters and numbers"
                  : error}
              </Text>
              <Box alignSelf={"flex-end"} marginBottom={"50px"}>
                {screen === screens.signup ? (
                  <Text3
                    main={"Already have an account?"}
                    sub={"Log in"}
                    onClick={() => {
                      setScreen(screens.login);
                    }}
                  />
                ) : (
                  <Text3
                    main={"Don’t have an account?"}
                    sub={"Sign up"}
                    onClick={() => {
                      setScreen(screens.signup);
                    }}
                  />
                )}
              </Box>
              <CustomButton
                text={"Next"}
                onClick={async () => {
                  setLoadingStatus(true);
                  if (screen === screens.login) {
                    setLoadingSignIn(true);
                    setError("");
                    setAuthCode("");
                    setOtpauth("");
                    if (await handleCustomSignIn(editedUsername)) {
                      setUsername(editedUsername);
                      setStage(stage + 1);
                    }
                    setLoadingSignIn(false);
                  } else if (screen === screens.signup) {
                    /* Check if user exists
              Show QR Code 
              Setup Auth Code
              Create Account */
                    // const result = await checkIfUseDoesNotExists(username);
                    // console.log(result);
                    setError("");
                    setAuthCode("");
                    setLoadingUserExists(true);
                    if (await checkIfUseDoesNotExists(editedUsername)) {
                      setUsername(editedUsername);
                      setUserExists(false);
                      // console.log("User does not exist");
                      // console.log({
                      //   secret,
                      //   Prifina: "Prifina",
                      //   username,
                      // });
                      setOtpauth(
                        getTotpUrl(secret.current, "Prifina", editedUsername)
                      );
                      setStage(stage + 1);
                    } else {
                      setUserExists(true);
                      setOtpauth("");
                      // console.log("User does exist");
                      setError("User already exists");
                    }
                    setLoadingUserExists(false);

                    // await handleCustomSignIn();
                  }
                  setLoadingStatus(false);
                }}
                loading={loadingStatus}
              />
            </Flex>
          ) : (
            <Flex flex={1}>
              <Flex
                display={{ base: "none", md: "flex" }}
                backgroundColor={"#e3eceb"}
                justifyContent={"center"}
                // minHeight={"800px"}
                // alignSelf={"center"}
                flex={1}
              >
                <NextImage
                  src={dataCloudIcon}
                  alt={`Settings Button`}
                  width={300}
                  // style={{ justifySelf: "center" }}
                  height={300}
                />
              </Flex>
              <Flex
                flexDirection={"column"}
                flex={1}
                // justifyContent={"center"}
                // paddingTop={"100px"}
                // padding={30}
                paddingTop={{ base: "40px", md: "100px" }}
                // paddingLefft={{ base: "40px", md: "100px" }}
                marginLeft={{ base: "10px", md: "100px" }}
                marginRight={{ base: "10px", md: "100px" }}
              >
                {stage === 1 && screen === screens.signup && (
                  <>
                    <HeadingText text={"Scan QR code"} />
                    <SubtitleText
                      text={
                        "Open FreeOTP Authenticator on your mobile phone and scan this QR code"
                      }
                    />
                    <Flex
                      flex={0}
                      style={{
                        background: "white",
                        padding: "16px",
                        justifyContent: "center",
                      }}
                    >
                      <QRCode value={otpauth} />
                    </Flex>
                    <SubtitleText
                      text={
                        "If you can’t connect using QR code, touch CONNECT MANUALLY on you mobile phone and type this code."
                      }
                    />
                    <Text
                      textAlign={"center"}
                      borderColor={"#9ca1a6"}
                      borderWidth={"1px"}
                      borderRadius={"5px"}
                      marginBottom={"10px"}
                      padding={"5px"}
                      fontWeight={600}
                    >
                      {base32Encode(secret.current)}{" "}
                    </Text>
                    <CustomButton
                      text={"Next"}
                      onClick={() => {
                        setStage(stage + 1);
                      }}
                    />
                  </>
                )}
                {((stage === 2 && screen === screens.signup) ||
                  (stage === 1 && screen === screens.login)) && (
                  <>
                    <HeadingText text={"Verification code"} />
                    <SubtitleText
                      text={"Please enter the code shown on your mobile phone"}
                    />
                    <Box marginBottom={"50px"}>
                      <VerificationInput
                        error={error !== ""}
                        changeAuthCode={(code) => {
                          setAuthCode(code);
                        }}
                      />
                    </Box>
                    <CustomButton
                      text={"Verify"}
                      onClick={async () => {
                        setLoadingAuth(true);
                        if (screen === screens.login) {
                          if (await handleSignInVerify(username)) {
                            logInSuccess(username);
                          } else {
                            setError("Login error");
                          }
                        } else if (screen === screens.signup) {
                          const deviceOK = await handleTOTPDeviceSetup(
                            authCode
                          );
                          if (deviceOK) {
                            const checkLocalStorage = localStorage.getItem(
                              "CognitoIdentityServiceProvider.6n5druepshcnnkt88uh2vqaod3.LastAuthUser"
                            );
                            if (checkLocalStorage) {
                              alert(
                                "Cognito user already exists in local storage..."
                              );
                              setLoadingAuth(false);
                              return;
                            }
                            const encodedSecret = btoa(secret.current);
                            if (
                              await handleSignUp({
                                username,
                                password: generateValidPassword(),
                                email: "anybody@anywhere.org",
                                secret: encodedSecret,
                              })
                            ) {
                              logInSuccess(username);
                            }
                          } else {
                            console.error("device not ok");
                            setError("Auth Code incorrect");
                          }
                        }
                        setLoadingAuth(false);
                      }}
                      loading={loadingAuth}
                    />

                    {screen === screens.signup && (
                      <Box marginTop={"30px"} textAlign={"center"}>
                        <Text3
                          main={"Didn’t get the code?"}
                          sub={"Scan again"}
                          onClick={() => {
                            setStage(stage - 1);
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Flex>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
