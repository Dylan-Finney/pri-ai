import { Text } from "@chakra-ui/react";
import MessageContainer from "./Message/MessageContainer";
import MessageHeader from "./Message/MessageHeader";
import { useContext } from "react";
import { AuthContext } from "./App";
export default function ChatPrompt(props) {
  const { details } = useContext(AuthContext);
  const fullText = props.text || "";
  const splitTextOnPossibleAgent = fullText.split(/(@\w+)/g);
  return (
    <MessageContainer prompt={true}>
      <MessageHeader
        avatar={`Unknown.svg`}
        name={`You (${details.name})`}
        time={props.time}
        prompt={true}
      />

      <Text
        fontSize={"sm"}
        color={"#2C5E55"}
        paddingLeft={{ base: "9.5vw", sm: "50px", lg: "55px" }}
        paddingRight={"1vw"}
      >
        {splitTextOnPossibleAgent.map((textSnippet, textSnippetIndex) => {
          const isPossibleAgent =
            textSnippet[0] === "@" && !textSnippet.includes(" ");
          if (isPossibleAgent === true) {
            return (
              <span key={textSnippetIndex} style={{ fontWeight: 600 }}>
                {textSnippet}
              </span>
            );
          } else {
            return textSnippet;
          }
        })}
        {/* {text} */}
      </Text>
    </MessageContainer>
  );
}
