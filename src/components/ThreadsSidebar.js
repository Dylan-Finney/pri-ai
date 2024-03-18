import sections from "@/utils/sections";
import { Box, SkeletonText, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import LogoHeader from "./Sidebar/LogoHeader";
import NewChatButton from "./Sidebar/NewChatButton";
import SearchThreadsInput from "./Sidebar/SearchThreadsInput";
import Thread from "./Sidebar/Thread";
import ThreadGroupDivider from "./Sidebar/ThreadGroupDivider";
import ThreadGroupTitle from "./Sidebar/ThreadGroupTitle";
import UserCorner from "./Sidebar/UserCorner";
import axios from "axios";
import { AuthContext, ConvoContext, UIContext } from "./App";

const SkeletonThread = () => {
  return <SkeletonText skeletonHeight={"6"} noOfLines={1} mb={3} />;
};

export default function ThreadsSidebar({ display = undefined }) {
  const { onboarding, initializing } = useContext(AuthContext);
  const { setSection, isLargerThanMd } = useContext(UIContext);
  const {
    conversations,
    changeConversation,
    fetchingConversation,
    loading,
    conversationID,
  } = useContext(ConvoContext);

  const disabledClick = fetchingConversation || loading;
  const [searchValue, setSearchValue] = useState("");

  const groupsEnum = {
    TODAY: 0,
    THIS_WEEK: 1,
    LAST_WEEK: 2,
    THIS_MONTH: 3,
    OLDER: 4,
  };

  const groupsEnumToString = {
    [groupsEnum.TODAY]: "Today",
    [groupsEnum.THIS_WEEK]: "This Week",
    [groupsEnum.LAST_WEEK]: "Last Week",
    [groupsEnum.THIS_MONTH]: "This Month",
    [groupsEnum.OLDER]: "Older",
  };

  const grouping = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const lastWeek = new Date(
      thisWeek.getFullYear(),
      thisWeek.getMonth(),
      thisWeek.getDate() - 7
    );
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (date >= today) {
      return groupsEnum.TODAY;
    } else if (date >= thisWeek) {
      return groupsEnum.THIS_WEEK;
    } else if (date >= lastWeek) {
      return groupsEnum.LAST_WEEK;
    } else if (date >= thisMonth) {
      return groupsEnum.THIS_MONTH;
    } else {
      return groupsEnum.OLDER;
    }
  };

  const openThread = (conversation, active) => {
    if (!disabledClick && !active) {
      setSection(sections.CHAT);
      changeConversation(conversation.id, conversation.title);
    }
  };
  return (
    <Box
      id="sidebar"
      display={display ? display : "flex"}
      width={{ base: "100%", md: "19.5%" }}
      maxWidth={{ base: "100%", md: "270px" }}
      minWidth={{ base: "unset", md: "190px" }}
      flexDirection={"column"}
      minHeight={{ base: "100%", md: "100vh" }}
      maxHeight={{ base: "100%", md: "100vh" }}
      borderRight={{ base: "", md: "1px solid #eaecf0" }}
      paddingLeft={4}
      paddingRight={4}
    >
      {/* <LogoHeader /> */}
      <Text paddingTop={"15px"} paddingRight={"5px"}>
        Threads
      </Text>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        whiteSpace={"pre-wrap"}
        overflowY={"auto"}
        scrollBehavior={"smooth"}
        // paddingRight={{ base: "0rem", md: "1rem" }}
      >
        {!onboarding && (
          <>
            <SearchThreadsInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            <NewChatButton
              onClick={() => {
                if (!disabledClick) {
                  setSection(sections.CHAT);
                  changeConversation(-1);
                }
              }}
            />
            <Box flex={1} overflowY={"scroll"}>
              {initializing === true ? (
                <>
                  {Array.from({ length: 30 }, (_, index) => (
                    <SkeletonThread key={index} />
                  ))}
                </>
              ) : (
                <>
                  {conversations
                    .sort((a, b) => b.lastMessage - a.lastMessage)
                    .filter((convo) =>
                      convo.title
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((conversation, index) => {
                      const start = index === 0;

                      const group = grouping(conversation.lastMessage);
                      const lastGroup =
                        !start &&
                        grouping(conversations[index - 1].lastMessage);

                      const lastThread = index === conversations.length - 1;
                      const startOfNewGroup = !start && group !== lastGroup;
                      const displayGroupTitle = start || group !== lastGroup;
                      const active = conversationID === conversation.id;

                      return (
                        <Box key={index} paddingRight={"10px"}>
                          {startOfNewGroup && <ThreadGroupDivider />}
                          {displayGroupTitle && (
                            <ThreadGroupTitle
                              title={groupsEnumToString[group]}
                            />
                          )}
                          <Thread
                            threadID={conversation.id}
                            isLargerThanMd={isLargerThanMd}
                            onClick={() => {
                              openThread(conversation, active);
                            }}
                            active={active}
                            title={conversation.title}
                          />
                        </Box>
                      );
                    })}
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}