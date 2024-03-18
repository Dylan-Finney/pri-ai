import { Box, Flex, Skeleton } from "@chakra-ui/react";
import Header from "./Header";
import ThreadsSidebar from "./ThreadsSidebar";
import UploadModal from "./UploadModal/UploadModal";
import { ChatlogContainer } from "./ChatlogContainer";
import SideTabIcon from "@/assets/SideTabIcon";
import OnboardingPlaceholder from "./Onboarding/OnboardingPlaceholder";
import NewThreadScreen from "./NewThreadScreen";
import ChatPrompt from "./ChatPrompt";
import ChatResponse from "./ChatResponse";
import LoadingAnimation from "./LoadingAnimation";
import PromptInput from "./PromptInput";
import SideTab from "./SideTab";
import { useContext } from "react";
import { AuthContext, ConvoContext, TestContext, UIContext } from "./App";
import axios from "axios";
import sideTabScreens from "@/utils/sideTabScreens";
import sections from "@/utils/sections";

const OpenSideTabButton = () => {
  const { setShowSideTab, showSideTab, setSideTabScreen } =
    useContext(UIContext);
  const { loggedIn } = useContext(AuthContext);

  const isShown = !showSideTab && loggedIn;
  const show = () => {
    setSideTabScreen(sideTabScreens.SAVED_CHATS); //Default Screen
    setShowSideTab(true);
  };
  return (
    <>
      {isShown && (
        <Flex
          width={45}
          height={45}
          position={"absolute"}
          alignSelf={"flex-end"}
          marginRight={10}
          marginTop={10}
          backgroundColor={"black"}
          onClick={() => {
            // console.log("TEST");
            show();
          }}
          alignItems={"center"}
          justifyContent={"center"}
          _hover={{ bg: "#f5f7f9" }}
          padding={"2px"}
          borderRadius={"50%"}
          cursor={"pointer"}
          zIndex={2}
          // right={"10px"}
        >
          <SideTabIcon />
        </Flex>
      )}
    </>
  );
};

const ChatSection = ({}) => {
  const {
    setSection,
    onLogInOpen,
    onOnboardingOpen,
    showSideTab,
    expandSideTab,
    isLargerThanMD,
  } = useContext(UIContext);
  const {
    fetchingConversation,
    loading,
    conversationID,
    demoMode,
    setDemoMode,
    chatlog,
    bookmarkMessage,
    submitFeedback,
    language,
    sendPrompt,
    saving,
  } = useContext(ConvoContext);
  const { loggedIn, details, onboarding } = useContext(AuthContext);
  return (
    <>
      <ThreadsSidebar display={{ base: "none", md: "flex" }} />
      <Flex
        style={{
          flexDirection: "column",
          minWidth: "80.5%",
          width: "100%",
          display: "flex",
        }}
      >
        <Header />
        <Flex flex={1}>
          <Flex
            // visibility={"hidden"}
            flex={1}
            display={expandSideTab ? "none" : "flex"}
            flexDirection={"column"}
          >
            <ChatlogContainer onboarding={onboarding}>
              <OpenSideTabButton />
              {onboarding ? (
                <OnboardingPlaceholder
                  logIn={onLogInOpen}
                  openDemo={onOnboardingOpen}
                />
              ) : (
                <Flex
                  flexDirection={"column"}
                  // marginBottom={"60px"}
                  height={"100%"}
                >
                  <div style={{ marginTop: "auto" }} />
                  {fetchingConversation === true ? (
                    <>
                      {Array.from({ length: 5 }, (_, index) => (
                        <>
                          <Skeleton
                            key={index * 2}
                            height={"50px"}
                            mb={1}
                            speed={0.85}
                          />
                          <Skeleton
                            key={index * 2 + 1}
                            height={"50px"}
                            speed={0.95}
                            mb={1}
                          />
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      {chatlog.length === 0 ? (
                        <NewThreadScreen
                          inverseDemoMode={() => {
                            setDemoMode(!demoMode);
                          }}
                          sendPrompt={sendPrompt}
                          demoMode={demoMode}
                          loggedIn={loggedIn}
                          goToUpload={() => {
                            setSection(sections.UPLOAD);
                          }}
                        />
                      ) : (
                        <>
                          {chatlog?.map((message, index) => {
                            return (
                              <Box key={index}>
                                {message.speaker === "User" ? (
                                  <ChatPrompt
                                    text={message.message}
                                    time={message.time}
                                  />
                                ) : (
                                  <ChatResponse
                                    speaker={message.speaker}
                                    index={index}
                                    asThread={true}
                                    helpful={message.feedback?.helpful}
                                    text={message.message}
                                    time={message.time}
                                    saving={saving}
                                    threadID={conversationID}
                                    bookmarked={message.bookmark}
                                    bookmarkMessage={() => {
                                      bookmarkMessage({
                                        add: !message.bookmark,
                                        index: index,
                                        time: message.time,
                                      });
                                    }}
                                    submitFeedback={({
                                      helpful = "",
                                      details = "",
                                      remove = false,
                                    }) => {
                                      submitFeedback({
                                        helpful,
                                        details,
                                        threadID: conversationID,
                                        time: message.time,
                                        remove,
                                      });
                                    }}
                                    feedback={
                                      (index < chatlog.length - 1 ||
                                        (!loading &&
                                          index === chatlog.length - 1)) &&
                                      loggedIn
                                    }
                                    generating={
                                      loading && index === chatlog.length - 1
                                    }
                                  />
                                )}
                              </Box>
                            );
                          })}
                        </>
                      )}
                    </>
                  )}

                  {loading && <LoadingAnimation />}
                </Flex>
              )}
            </ChatlogContainer>

            <PromptInput language={language} />
          </Flex>
          {showSideTab && <SideTab />}
        </Flex>
      </Flex>
    </>
  );
};

export default ChatSection;
