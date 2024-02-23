/* eslint-disable react/no-unescaped-entities */
import NextImage from "next/image";
import { useEffect, useState } from "react";
import PageIndicator from "./PageIndicator";
import Personalize from "./Personalize";
const privacyModal = "/assets/privacy_modal.svg";

const {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Text,
  Box,
} = require("@chakra-ui/react");

export default function OnboardingModal(props) {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [failedSubmit, setFailedSubmit] = useState(null);

  useEffect(() => {
    setFailedSubmit(false);
    switch (onboardingStep) {
      case 2:
        props.onFinish();
        break;
      default:
        break;
    }
  }, [onboardingStep, props]);
  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      isOpen={props.isOpen}
      onClose={props.onClose}
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
            setOnboardingStep(0);
            props.onClose();
          }}
        />
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
          {/* Left Screen of Modal */}
          {/* <OnboardingSidebar onboardingStep={onboardingStep}/> */}
          {/* Right Screen of Modal */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              flex: 5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              border: "10px solid transparent",
            }}
          >
            {onboardingStep === 0 ? (
              <>
                <Personalize
                  failedSubmit={failedSubmit}
                  goBack={() => {
                    setOnboardingStep(0);
                    props.onClose();
                  }}
                  next={() => {
                    setOnboardingStep(onboardingStep + 1);
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {onboardingStep === 1 ? (
              <>
                <Box marginLeft={"10px"} marginTop={"15px"}>
                  <Box
                    width={"48px"}
                    marginLeft={"-10px"}
                    marginBottom={{ base: "0x", sm: "0px" }}
                  >
                    <NextImage
                      src={privacyModal}
                      alt={"Privacy Icon"}
                      width={48}
                      height={48}
                    />
                  </Box>
                  <Text
                    as={"b"}
                    fontSize={"18px"}
                    fontWeight={"600"}
                    color={"#101828"}
                  >
                    Privacy Disclaimer
                  </Text>
                  <Text color={"#475467"} fontSize={"14px"} fontWeight={"400"}>
                    How we handle and store your data{" "}
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
                  maxHeight={"calc(100vh - 269px)"}
                  width={"100%"}
                  overflowY={"auto"}
                  scrollBehavior={"smooth"}
                >
                  <Text
                    color={"#475467"}
                    marginLeft={"10px"}
                    marginTop={"10px"}
                    marginBottom={"10px"}
                    fontSize={"14px"}
                    fontWeight={"400"}
                  >
                    Please note that this Personal AI chat service demo records
                    each chat session and related details. The purpose of this
                    recording is to improve the quality of our service and for
                    development purposes.
                    <br /> <br />
                    By using this demo, you acknowledge and agree to the
                    recording and storage of your conversation history.
                    Furthermore, any details provided or prompts entered
                    hereafter will be sent to and processed by Prifina and
                    OpenAI.
                    <br /> <br />
                    We want you to know that any personal information collected
                    will be kept confidential and will not be disclosed to any
                    third party without your consent, except as required by law.
                    <br /> <br />
                    If you have any concerns about the collection, use, or
                    storage of your personal information, please do not use this
                    service. If you have any questions or comments about our
                    privacy policy or practices, please feel free to contact us.
                    <br /> <br />
                    Thank you for using our Personal AI chat service.
                  </Text>
                </Box>
              </>
            ) : (
              <></>
            )}
            {onboardingStep === 1 ? (
              <>
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
                    disabled={props.initializing}
                    border={"1px solid #D0D5DD"}
                    backgroundColor={"#FFFFFF"}
                    color={"#000000"}
                    onClick={() => {
                      setOnboardingStep(0);
                      props.onClose();
                    }}
                    width="100%"
                  >
                    No Thanks
                  </Button>
                  <Button
                    disabled={props.initializing}
                    backgroundColor={"#0E9384"}
                    color={"#FFFFFF"}
                    marginTop={"auto"}
                    marginRight={"10px"}
                    width="100%"
                    onClick={() => {
                      setOnboardingStep(onboardingStep + 1);
                      props.onClose();
                    }}
                  >
                    I'm Ok with this
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}
            {/* **** <- Page Indicator */}
            <PageIndicator step={onboardingStep} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
