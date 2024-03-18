import { agentsDemoImages } from "@/utils/agents";
import { Box, Flex, Text } from "@chakra-ui/react";
import AgentImage from "./AgentImage";
import { useContext } from "react";
import { DataContext } from "./App";

const AgentThreadList = ({ mentionedAgents }) => {
  return (
    <Text
      fontWeight={400}
      fontSize={"10px"}
      overflow={"hidden"}
      textOverflow={"ellipsis"}
      whiteSpace={"nowrap"}
    >
      {mentionedAgents.reverse().join(", ")}
    </Text>
  );
};

const ThreadTitleText = ({ title }) => {
  return (
    <Text
      fontWeight={600}
      fontSize={"12px"}
      overflow={"hidden"}
      textOverflow={"ellipsis"}
      whiteSpace={"nowrap"}
    >
      {title}
    </Text>
  );
};

const AgentOverflowCounter = ({ length, cutoff }) => {
  return (
    <Box
      display={length > cutoff ? "block" : "none"}
      width={"32px"}
      height={"32px"}
      backgroundColor={"white"}
      border={"2px solid white"}
      borderRadius={"20px"}
      marginLeft={"-10px"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Flex
        backgroundColor={"#F2F4F7"}
        height={"95%"}
        width={"95%"}
        borderRadius={"200px"}
        textAlign={"center"}
        padding={"5px 0"}
      >
        <Text
          color={"#475467"}
          fontSize={"12px"}
          fontWeight={500}
          width={"32px"}
          height={"32px"}
          textAlign={"center"}
          alignItems={"center"}
          marginTop={"auto"}
        >
          +{length - cutoff}
        </Text>
      </Flex>
    </Box>
  );
};

const ThreadTitle = ({
  mentionedAgents = [],
  mode = false,
  title,
  as = "header",
  onClick,
}) => {
  const { agents, buddies } = useContext(DataContext);
  const mentionedAgentsFiltered = mentionedAgents.slice(-3).reverse();

  const types = {
    HEADER: 0,
    LIST_ITEM: 1,
  };
  const parseAs = () => {
    switch (as) {
      case "list-item":
        return types.LIST_ITEM; //If ThreadTitle is displayed as a list instead of in the header (e.g. Saved Chats)
      default:
        return types.HEADER; //If ThreadTitle is displayed in the header (usually for open threads)
    }
  };

  const treatAs = parseAs();
  return (
    <Flex
      flexDir={"row"}
      padding={"10px"}
      //   borderBottom={treatAs === "header" ? "1px solid #EAECF0" : "unset"}
      backgroundColor={"white"}
      alignItems={"center"}
      boxShadow={
        treatAs === types.HEADER
          ? "unset"
          : "rgba(0, 0, 0, 0.04) 0px 4px 4px 4px"
      }
      cursor={treatAs === types.HEADER ? "unset" : "pointer"}
      onClick={(event) => {
        if (treatAs === types.LIST_ITEM) {
          event.stopPropagation();
          onClick();
        }
      }}
    >
      {/* {console.log({ mentionedAgents })} */}
      {mentionedAgentsFiltered.map((speaker, agentIndex) => {
        const agent = [...agents, ...buddies].find(
          (agent) => agent.call === speaker
        );
        return (
          <Box
            key={agentIndex}
            width={"32px"}
            height={"32px"}
            backgroundColor={"white"}
            border={"1px solid white"}
            borderRadius={"20px"}
            marginLeft={agentIndex > 0 ? "-10px" : "unset"}
          >
            <AgentImage
              show={agent?.image.urlFull}
              icon={agent?.image.chatIcon}
              name={agent?.name}
              url={agent?.image.urlFull}
              defaultImage={agent?.image.defaultFull}
              size={3}
              iconScale={2}
            />
          </Box>
        );
      })}

      <AgentOverflowCounter length={mentionedAgents.length} cutoff={3} />
      <Flex flexDir={"column"} paddingLeft={"10px"} overflow={"hidden"}>
        <ThreadTitleText title={title} />
        <AgentThreadList mentionedAgents={[...mentionedAgents]} />
      </Flex>
    </Flex>
  );
};

export default ThreadTitle;
