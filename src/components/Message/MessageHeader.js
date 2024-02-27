import { Box, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { timeToString } from "../utils";
const MessageAvatar = ({ avatar }) => {
  return (
    <Box
      marginRight={{ base: "2.5vw", sm: "1.5vw", md: "0.5vw" }}
      marginBottom={{ base: "-2vh", sm: "-1vh" }}
      position={"relative"}
      bottom={{ base: "6px", sm: "0px", md: "-7px" }}
    >
      <Image
        src={`/assets/avatar/${avatar}`}
        alt="Avatar"
        htmlWidth={40}
        htmlHeight={40}
      />
    </Box>
  );
};

const MessageHeader = ({ avatar, name, time, prompt }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      marginBottom={{ base: "2vh", sm: "0vh" }}
    >
      <MessageAvatar avatar={avatar} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          "border-bottom": `1px solid ${
            prompt === true ? "#2ED3B7" : "#f0f1f4"
          }`,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          as={"b"}
          fontSize={"sm"}
          color={"#107569"}
          display={"inline-block"}
          marginRight={"auto"}
        >
          {name}
        </Text>
        <Text
          fontSize={"xs"}
          color={"#215852"}
          marginTop={"auto"}
          marginBottom={"auto"}
        >
          {timeToString(time)}
        </Text>
      </div>
    </Box>
  );
};

export default MessageHeader;
