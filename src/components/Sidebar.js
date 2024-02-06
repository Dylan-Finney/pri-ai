import { Box, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import ThreadGroupDivider from "./Sidebar/ThreadGroupDivider";
import ThreadGroupTitle from "./Sidebar/ThreadGroupTitle";
import Thread from "./Sidebar/Thread";
import NewChatButton from "./Sidebar/NewChatButton";
import LogoHeader from "./Sidebar/LogoHeader";
import SearchThreadsInput from "./Sidebar/SearchThreadsInput";
import UserCorner from "./Sidebar/UserCorner";
import sections from "@/utils/sections";

export default function Sidebar(props) {
  const [searchValue, setSearchValue] = useState("");

  const conversations = props.conversations || [];

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
  return (
    <Box
      id="sidebar"
      display={props.display ? props.display : "flex"}
      width={{ base: "100%", md: "19.5%" }}
      maxWidth={{ base: "100%", md: "270px" }}
      flexDirection={"column"}
      minHeight={{ base: "100%", md: "100vh" }}
      maxHeight={{ base: "100%", md: "100vh" }}
      borderRight={{ base: "", md: "1px solid #eaecf0" }}
      paddingLeft={4}
      paddingRight={4}
    >
      <LogoHeader />
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        whiteSpace={"pre-wrap"}
        overflowY={"auto"}
        scrollBehavior={"smooth"}
        // paddingRight={{ base: "0rem", md: "1rem" }}
      >
        {!props.onboarding && (
          <>
            <SearchThreadsInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            <NewChatButton
              onClick={() => {
                if (!props.disabledClick) {
                  props.changeSection(sections.CHAT);
                  props.changeConversation(-1);
                }
              }}
            />
            <Box flex={1} overflowY={"scroll"}>
              {conversations
                .sort((a, b) => b.lastMessage - a.lastMessage)
                .filter((convo) =>
                  convo.title.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((conversation, index) => {
                  const start = index === 0;

                  const grouping = (date) => {
                    const now = new Date();
                    const today = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate()
                    );
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
                    const thisMonth = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      1
                    );
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
                  const group = grouping(conversation.lastMessage);
                  const lastGroup =
                    !start && grouping(conversations[index - 1].lastMessage);

                  const lastThread = index === conversations.length - 1;
                  const startOfNewGroup = !start && group !== lastGroup;
                  const displayGroupTitle = start || group !== lastGroup;
                  const active = props.activeConvo === conversation.id;

                  return (
                    <>
                      {startOfNewGroup && <ThreadGroupDivider />}
                      {displayGroupTitle && (
                        <ThreadGroupTitle title={groupsEnumToString[group]} />
                      )}
                      <Thread
                        onClick={() => {
                          if (!props.disabledClick && !active) {
                            props.changeSection(sections.CHAT);
                            props.changeConversation(conversation.id);
                          }
                        }}
                        active={active}
                        title={conversation.title}
                      />
                    </>
                  );
                })}
            </Box>
          </>
        )}
        <UserCorner
          name={props.name}
          changeSection={props.changeSection}
          section={props.section}
          loggedIn={props.loggedIn}
        />
      </Box>
    </Box>
  );
}
