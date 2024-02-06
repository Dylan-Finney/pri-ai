import { Text } from "@chakra-ui/react";
import MessageContainer from "./Message/MessageContainer";
import MessageHeader from "./Message/MessageHeader";
export default function ChatPrompt(props) {
  return (
    <MessageContainer prompt={true}>
      <MessageHeader
        avatar={`Unknown.svg`}
        name={`You (${props.name})`}
        time={props.time}
        prompt={true}
      />

      <Text
        fontSize={"sm"}
        color={"#2C5E55"}
        paddingLeft={{ base: "9.5vw", sm: "50px", lg: "55px" }}
        paddingRight={"1vw"}
      >
        {props.text}
      </Text>
    </MessageContainer>
  );
}
