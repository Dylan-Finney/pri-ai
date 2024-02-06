/* eslint-disable react/no-unescaped-entities */

import { useEffect, useRef, useState } from "react";
import {
  signIn,
  confirmSignIn,
  getCurrentUser,
  confirmSignUp,
  signUp,
  autoSignIn,
} from "aws-amplify/auth";
import QRCode from "react-qr-code";
import HOTP from "@/utils/HOTP";

const {
  Input,
  useMediaQuery,
  Flex,
  TagLabel,
  Tag,
  Textarea,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Icon,
  ModalBody,
  Lorem,
  ModalFooter,
  Spinner,
  Text,
  Spacer,
  Box,
  SimpleGrid,
  Tooltip,
  Progress,
  ChakraProvider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  UnorderedList,
  ListItem,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  IconButton,
  CheckboxIcon,
  FormErrorMessage,
  DrawerOverlay,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  Image,
  FormControl,
  InputGroup,
} = require("@chakra-ui/react");

export default function LoginModal({ isOpen, onClose, onOpen, logInSuccess }) {
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
  }, []);

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

  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      size={"full"}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        style={{ borderRadius: "10px", border: "0px solid transparent" }}
        width={{ base: "100%", md: "560px" }}
        height={{ base: "100%", md: "100vh" }}
        maxHeight={{ base: "100%", md: "594px" }}
        marginTop={"auto"}
        marginBottom={"auto"}
      >
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <ModalBody>
          <Box style={{ flexDirection: "column" }}>
            <Text>Username: </Text>
            <Input
              //   placeholder="username"
              value={editedUsername}
              disabled={showAuthCode || otpauth !== ""}
              onChange={(event) => {
                setEditedUsername(event.target.value);
              }}
            ></Input>
          </Box>

          <Button
            isLoading={loadingUserExists}
            disabled={loadingSignIn || loadingUserExists}
            onClick={async () => {
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
              } else {
                setUserExists(true);
                setOtpauth("");
                // console.log("User does exist");
                setError("User already exists");
              }
              setLoadingUserExists(false);
              // await handleCustomSignIn();
            }}
          >
            Sign UP
          </Button>

          <Button
            isLoading={loadingSignIn}
            disabled={loadingSignIn || loadingUserExists}
            onClick={async () => {
              setLoadingSignIn(true);
              setError("");
              setAuthCode("");
              setOtpauth("");
              if (await handleCustomSignIn(editedUsername)) {
                setUsername(editedUsername);
              }
              setLoadingSignIn(false);
            }}
          >
            Sign IN
          </Button>
          {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
          {showAuthCode && (
            <>
              <Text>Auth Code: </Text>
              <Input
                onChange={(event) => {
                  setAuthCode(event.target.value);
                }}
              />
              <Button
                isLoading={loadingAuth}
                onClick={async () => {
                  setLoadingAuth(true);
                  if (await handleSignInVerify(username)) {
                    logInSuccess(username);
                  } else {
                    setError("Login error");
                  }
                  setLoadingAuth(false);
                }}
              >
                Auth
              </Button>
            </>
          )}
          {otpauth !== "" && (
            <>
              <div style={{ background: "white", padding: "16px" }}>
                <QRCode value={otpauth} />
              </div>
              <div>
                <Text>Auth Code: </Text>
                <Input
                  onChange={(event) => {
                    setAuthCode(event.target.value);
                  }}
                />
                <Button
                  isLoading={loadingAuth}
                  onClick={async () => {
                    setLoadingAuth(true);
                    const deviceOK = await handleTOTPDeviceSetup(authCode);
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
                    setLoadingAuth(false);
                    // handleSignInVerify();
                    // logInSuccess("dylTestUser1");
                  }}
                >
                  Auth
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
