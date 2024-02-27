import { Box, Button, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { RiLoginCircleLine } from "react-icons/ri";

const Illustration = "/assets/Illustration.svg";

const OnboardingPlaceholder = ({ logIn, openDemo }) => {
  return (
    <>
      <Box style={{ width: "220px", height: "160px" }}>
        <Image
          src={Illustration}
          alt="Illustration"
          // boxSize={"220px"}
          htmlHeight={"100px"}
          // style={{ width: "220px", height: "100px" }}
        />
      </Box>
      <Text as="b" fontSize="lg">
        Finish Setting up your AI
      </Text>
      <Text maxWidth={"38%"} color="#475467">
        To work properly your AI needs to know more about you. Complete the
        onboarding to continue.
      </Text>
      <div>
        <Button
          width={"fit-content"}
          backgroundColor={"#FFFFFF"}
          border={"1px solid #D0D5DD"}
          marginRight={"8px"}
          onClick={() => {
            logIn();
          }}
        >
          Log In
        </Button>
        <Button
          width={"fit-content"}
          color={"#FFFFFF"}
          backgroundColor={"#0E9384"}
          marginLeft={"8px"}
          onClick={() => {
            openDemo();
          }}
        >
          <RiLoginCircleLine
            size={"1.3em"}
            style={{ transform: "rotate(315deg)" }}
          />
          Try as Demo
        </Button>
        <Text
          marginTop={"10px"}
          cursor={"pointer"}
          onClick={() => {
            window
              .open("https://beta.prifina.com/pri-ai.html", "_blank")
              .focus();
          }}
        >
          About Pri-AI
        </Text>
      </div>
    </>
  );
};

export default OnboardingPlaceholder;
