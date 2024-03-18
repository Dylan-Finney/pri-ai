import { Box, Flex, Text } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import ThreadTitle from "./ThreadTitle";
import ChatResponse from "./ChatResponse";
import { AgentDetails } from "./AgentDetails";
import axios from "axios";
import AgentsDrawer from "./AgentsDrawer/AgentsDrawer";
import { useContext } from "react";
import { AuthContext, ConvoContext, UIContext } from "./App";
import { baseBookmarkThreadObj } from "@/utils/constants";
import sideTabScreens from "@/utils/sideTabScreens";

const SavedChatsList = () => {
  const { setBookmarkedThread, conversations, bookmarks } =
    useContext(ConvoContext);
  const getBookmarksForThread = async (conversation, threadID) => {
    const response = await axios({
      method: "POST",
      url: "/api/getBookmarks",
      data: {
        threadID,
        bookmarks: bookmarks[threadID],
      },
    });

    setBookmarkedThread({
      id: threadID,
      demo: !conversations.find((convo) => convo.id === threadID).buddies,
      buddies: conversation.buddies,
      messages: response.data.messages,
    });
    // console.log(response);
  };
  return (
    <Flex overflowY={"scroll"} gap={"10px"} flexDirection={"column"}>
      {Object.keys(bookmarks).map((key, i) => {
        const conversation = conversations.find((convo) => convo.id === key);

        return (
          <ThreadTitle
            key={i}
            title={conversation.title}
            mentionedAgents={conversation.speakers}
            as={"list-item"}
            onClick={async () => {
              await getBookmarksForThread(conversation, key);
            }}
          />
        );
      })}
    </Flex>
  );
};

const BookmarksSavedChatsHeader = () => {
  const { changeConversation, setBookmarkedThread, bookmarkedThread } =
    useContext(ConvoContext);
  return (
    <Flex flexDirection={"row"} justifyContent={"space-between"}>
      <Text
        onClick={(event) => {
          event.stopPropagation();
          setBookmarkedThread(baseBookmarkThreadObj);
        }}
      >
        Go Back
      </Text>
      <Text
        onClick={(event) => {
          event.stopPropagation();
          changeConversation(bookmarkedThread.id);
        }}
      >
        Open Thread
      </Text>
    </Flex>
  );
};

const BookmarksSavedChatsList = () => {
  const {
    conversationID,
    setBookmarks,
    setBookmarkedThread,
    bookmarks,
    bookmarkedThread,
    chatlog,
  } = useContext(ConvoContext);
  const unbookmarkMessageFromTab = (message, i) => {
    if (bookmarks[bookmarkedThread.id].length > 1) {
      const index = bookmarks[bookmarkedThread.id].indexOf(message.time);
      if (index > -1) {
        const index2 = bookmarkedThread.messages.findIndex(
          (bookmarkedMessage) => bookmarkedMessage.time === message.time
        );
        var copyBookmarks = bookmarks[bookmarkedThread.id];

        var copyBookmarksThread = bookmarkedThread.messages;

        copyBookmarksThread.splice(index2, 1);

        copyBookmarks.splice(index, 1);

        setBookmarkedThread({
          ...bookmarkedThread,
          messages: copyBookmarksThread,
        });

        setBookmarks({
          ...bookmarks,
          [bookmarkedThread.id]: copyBookmarks,
        });
      }
    } else {
      var copyObj = bookmarks;
      delete copyObj[bookmarkedThread.id];
      setBookmarks(copyObj);
      setBookmarkedThread(baseBookmarkThreadObj);
    }
    // If the bookmarked message is in the current thread, unbookmark it
    if (conversationID === bookmarkedThread.id) {
      const index = chatlog.findIndex(
        (chatlogMessage) => chatlogMessage.time === message.time
      );
      chatlog[index].bookmark = false;
    }
  };
  return (
    <Flex flexDirection={"column"} overflowY={"scroll"} height={"80vh"}>
      {bookmarkedThread.messages.length == 0 ? (
        <Text textAlign={"center"}>NO SAVED ITEMS FOR THIS THREAD</Text>
      ) : (
        <>
          {bookmarkedThread.messages.map((message, i) => {
            return (
              <ChatResponse
                key={i}
                asThread={false}
                speaker={message.speaker}
                text={message.message}
                time={message.time}
                threadID={bookmarkedThread.id}
                bookmarked={true}
                bookmarkMessage={() => {
                  //Logic for unbookmarking, no need for backend implementation
                  unbookmarkMessageFromTab(message, i);
                }}
                asBookmark={true}
                feedback={true}
                generating={false}
              />
            );
          })}
        </>
      )}
    </Flex>
  );
};

const SavedChatsSideTab = () => {
  const { bookmarkedThread } = useContext(ConvoContext);

  const threadIsSelected = bookmarkedThread.id !== "";
  return (
    <>
      <Text>Saved Chats</Text>
      {!threadIsSelected ? (
        <SavedChatsList />
      ) : (
        <Flex flexDirection={"column"}>
          <BookmarksSavedChatsHeader />
          <BookmarksSavedChatsList />
        </Flex>
      )}
    </>
  );
};

const ExpandSideTabButton = () => {
  const { isLargerThanMD, setShowSideTab, expandSideTab, setExpandSideTab } =
    useContext(UIContext);
  const inverseExpandSideTab = () => {
    setExpandSideTab(!expandSideTab);
  };
  return (
    <Box backgroundColor={"#f5f7f9"} padding={"10px"}>
      {expandSideTab ? (
        <FiChevronRight
          onClick={() => {
            if (isLargerThanMD) {
              inverseExpandSideTab();
            } else {
              setShowSideTab(false);
            }
          }}
        />
      ) : (
        <FiChevronRight
          onClick={() => {
            inverseExpandSideTab();
          }}
        />
      )}
    </Box>
  );
};

const SideTab = () => {
  const { boxRef, sideTabScreen, expandSideTab } = useContext(UIContext);

  return (
    <Flex
      className="side-tab"
      backgroundColor={"#fcfcfe"}
      ref={boxRef}
      flex={1}
      maxHeight={"93vh"}
      maxWidth={expandSideTab ? "unset" : "20vw"}
      minWidth={"300px"}
      flexDir={"column"}
      borderLeft={"1px solid #dedede"}
      // padding={"10px"}
    >
      <ExpandSideTabButton />
      <Box padding={"10px"} maxHeight={"93vh"} overflow={"hidden"}>
        {sideTabScreen === sideTabScreens.SAVED_CHATS && <SavedChatsSideTab />}
        {sideTabScreen === sideTabScreens.AGENT_DETAILS && <AgentDetails />}
        {sideTabScreen === sideTabScreens.AGENT_LIST && <AgentsDrawer />}
      </Box>
    </Flex>
  );
};

export default SideTab;
