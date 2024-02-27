import { Text, Button, Image } from "@chakra-ui/react";
// import NextImage from "next/image";
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
      <Image src={chat} alt={"New Chat Icon"} htmlWidth={23} htmlHeight={23} />
      <Text ml={2} fontWeight={500}>
        New Thread
      </Text>
      <Image
        style={{ marginLeft: "auto" }}
        src={chatTwo}
        alt={"New Chat Icon 2"}
        htmlWidth={23}
        htmlHeight={23}
      />
    </Button>
  );
};

export default NewChatButton;
