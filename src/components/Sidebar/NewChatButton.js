import { Text, Button } from "@chakra-ui/react";
import NextImage from "next/image";
const chat = "/assets/chat.svg";
const chatTwo = "/assets/chat2.svg";

const NewChatButton = ({ onClick }) => {
  return (
    <Button
      // justifyContent={"flex-start"}
      variant={"ghost"}
      onClick={onClick}
      pt={3}
      pb={5}
      pl={3}
      width={"100%"}
      height={"fit-content"}
    >
      <NextImage src={chat} alt={"New Chat Icon"} width={23} height={23} />
      <Text ml={2} fontWeight={500}>
        New Thread
      </Text>
      <NextImage
        style={{ marginLeft: "auto" }}
        src={chatTwo}
        alt={"New Chat Icon 2"}
        width={23}
        height={23}
      />
    </Button>
  );
};

export default NewChatButton;
