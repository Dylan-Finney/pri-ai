import { Box, Flex, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { timeToString } from "../utils";
import { agentsProd2 } from "@/utils/agents";
import { DataContext, UIContext } from "../App";
import { useContext, useEffect, useState } from "react";
import AgentImage from "../AgentImage";
import sideTabScreens from "@/utils/sideTabScreens";
const MessageAvatar = ({ avatar, onClick, customImage, agent }) => {
  return (
    <Box
      marginRight={{ base: "2.5vw", sm: "1.5vw", md: "0.5vw" }}
      marginBottom={{ base: "-2vh", sm: "-1vh" }}
      position={"relative"}
      bottom={{ base: "6px", sm: "0px", md: "-7px" }}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {customImage ? (
        <AgentImage
          show={agent.image.urlFull}
          icon={agent.image.chatIcon}
          name={agent.name}
          url={agent.image.urlFull}
          defaultImage={agent.image.defaultFull}
          size={2}
          iconScale={2}
        />
      ) : (
        <NextImage
          src={`/assets/avatar/${avatar}`}
          alt="Avatar"
          width={40}
          height={40}
        />
      )}
    </Box>
  );
};

const MessageHeader = ({
  avatar,
  name,
  time,
  prompt,
  speaker = "",
  bookmarked,
  asThread,
  // openSideTab,
}) => {
  const { setExpandedAgent, setSideTabScreen, setShowSideTab } =
    useContext(UIContext);
  const { agents, buddies } = useContext(DataContext);
  const [agent, setAgent] = useState(
    [...agents, ...buddies].find(
      (agent) => agent.call === speaker.toLowerCase()
    )
  );
  const openSideTab = () => {
    // console.log(message);
    setExpandedAgent(speaker);
    setSideTabScreen(sideTabScreens.AGENT_DETAILS);
    setShowSideTab(true);
  };
  // useEffect(() => {
  //   setAgent(
  //     [...agents, ...buddies].find(
  //       (agent) => agent.call === speaker.toLowerCase()
  //     )
  //   );
  // }, [agents, buddies]);
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      marginBottom={{ base: "2vh", sm: "0vh" }}
    >
      <MessageAvatar
        avatar={avatar}
        customImage={speaker !== "User" && agent !== undefined}
        agent={agent}
        onClick={() => {
          if (speaker) {
            console.log(speaker);
            openSideTab();
          }
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          "border-bottom": `1px solid #eaecf0`,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Flex flexDirection={"row"} marginRight={"auto"}>
          <Text
            as={"b"}
            fontSize={"sm"}
            color={"#344054"}
            display={"inline-block"}
          >
            {name ? (
              name
            ) : (
              <>
                {agent?.name} -{" "}
                <span style={{ color: "#107569" }}>@{speaker}</span>
              </>
            )}
          </Text>
          {bookmarked && asThread && (
            <Text
              backgroundColor={"#e2efff"}
              color={"#0075ff"}
              fontWeight={600}
              fontSize={"sm"}
              marginLeft={"3px"}
              paddingLeft={"7px"}
              paddingRight={"7px"}
              borderRadius={"30px"}
              alignSelf={"center"}
            >
              Saved
            </Text>
          )}
        </Flex>

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
