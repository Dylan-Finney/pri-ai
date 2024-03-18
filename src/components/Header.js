import { CheckIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  useEditableControls,
} from "@chakra-ui/react";
import { TbEdit, TbMessage } from "react-icons/tb";
import { Image } from "@chakra-ui/react";
import { GoMute, GoUnmute } from "react-icons/go";
import { RiDeleteBin6Line, RiMenu2Fill } from "react-icons/ri";
import { CgSlack } from "react-icons/cg";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";
// import { changeName } from "../utils/backend/changeName";
import { agentsDemoImages } from "../utils/agents";
import AgentImage from "./AgentImage";
import { AuthContext, ConvoContext, DataContext, UIContext } from "./App";
import ThreadTitle from "./ThreadTitle";
import sections from "@/utils/sections";
import { FiTrash2 } from "react-icons/fi";
import {
  MdOutlineArchive,
  MdOutlineBookmark,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import UserCorner from "./Sidebar/UserCorner";
import sidebarScreens from "@/utils/sidebarScreens";
import sideTabScreens from "@/utils/sideTabScreens";

const share = "/assets/share.svg";

const logo = "/assets/logo.svg";

const Header = ({}) => {
  const {
    isLargerThanMD,
    onSideBarOpen,
    setSidebarScreen,
    onDeleteOpen,
    setShowSideTab,
    setSideTabScreen,
    section,
  } = useContext(UIContext);
  const {
    bookmarks,
    chatlog,
    setBookmarkedThread,
    conversations,
    conversationID,
    threadTitle,
    demoMode,
  } = useContext(ConvoContext);
  const { loggedIn } = useContext(AuthContext);

  const openMenuSidebar = () => {
    onSideBarOpen();
    setSidebarScreen(sidebarScreens.MENU);
  };

  const openThreadsSidebar = () => {
    onSideBarOpen();
    setSidebarScreen(sidebarScreens.THREADS);
  };

  const openDelete = () => {
    onDeleteOpen();
  };

  const getSavedItems = async (threadID) => {
    var messages = [];
    var buddies = [];
    try {
      const response = await axios({
        method: "POST",
        url: "/api/getBookmarks",
        data: {
          threadID: threadID,
          bookmarks: bookmarks[threadID],
        },
      });
      console.log(response);
      messages = response.data.messages;
      buddies = [
        ...new Set(
          chatlog
            .map((message) => message.speaker)
            .filter((speaker) => speaker !== "User")
        ),
      ];
    } catch (e) {
      console.error("Error getting saved items", e);
    }
    setShowSideTab(true);
    setSideTabScreen(sideTabScreens.SAVED_CHATS);
    console.log();
    setBookmarkedThread({
      id: threadID,
      demo: !conversations.find((convo) => convo.id === threadID).buddies,
      buddies,
      messages,
    });
  };

  const show = conversationID !== -1;

  const threadID = conversationID;

  const mentionedAgents = [
    ...new Set(
      chatlog
        .map((message) => message.speaker)
        .filter((speaker) => speaker !== "User")
    ),
  ];

  const mode = demoMode;

  // const { agents } = useContext(DataContext);
  // const mentionedAgentsFiltered = mentionedAgents.slice(-3).reverse();
  // const [customAIName, setCustomAIName] = useState(aIName || "");

  // const [colorTitle, setColorTitle] = useState(aIName || "");

  // useEffect(() => {
  //   setCustomAIName(aIName || "");
  // }, [aIName]);

  return (
    <>
      <Box
        display={{
          base: "flex",
          md: "none",
        }}
        style={{
          // display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: "1rem",
          // marginTop: "10px",
          // marginBottom: "10px",
          height: "7vh",
          maxHeight: "100px",
          minHeight: "60px",
        }}
        backgroundColor={isLargerThanMD ? "white" : "#1a1b1e"}
      >
        <Box
          display={{
            base: "flex",
            md: "none",
          }}
          paddingLeft={"10px"}
          paddingRight={"15px"}
          flexDirection={"row"}
          width={"100%"}
          alignItems={"center"}
          backgroundColor={isLargerThanMD ? "white" : "#1a1b1e"}
        >
          <HamburgerIcon
            color={"white"}
            cursor={"pointer"}
            onClick={openMenuSidebar}
          />
          <Spacer />
          <Flex flexDirection={"row"}>
            <Box
              style={{
                width: "32px",
                height: "33px",
                display: "inline-block",
                filter:
                  "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))",
              }}
            >
              <Image src={logo} alt="Logo" boxSize={"32px"} />
            </Box>
            <Text
              paddingLeft={"5px"}
              color="white"
              fontWeight="700"
              fontSize={"20px"}
            >
              Pri-AI
            </Text>
          </Flex>
          <Spacer />
          {section === 0 && (
            <TbMessage
              cursor={"pointer"}
              onClick={openThreadsSidebar}
              color="white"
            />
          )}
        </Box>
      </Box>
      <Box
        // display={{
        //   base: "none",
        //   md: "flex",
        // }}
        width={"100%"}
        // height={"100%"}
        alignItems={"center"}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: "1rem",
          // marginTop: "10px",
          // marginBottom: "10px",
          height: "7vh",
          maxHeight: "100px",
          minHeight: "60px",
        }}
        borderBottom={"1px solid #eaecf0"}
        // backgroundColor={isLargerThanMD ? "white" : "#1a1b1e"}
      >
        {section === sections.CHAT && (
          <>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Box}
                    position={"relative"}
                    // top={"-10%"}
                    // left={"0%"}
                    // right={"10px"}
                    // width={"25px"}
                    // height={"25px"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={show ? "flex" : "none"}
                    cursor={"pointer"}
                    // backgroundColor={"green"}
                  >
                    <RiMenu2Fill
                      cursor={"pointer"}
                      onClick={() => {
                        console.log("TEST");
                      }}
                      size={"1.25em"}
                    />
                  </MenuButton>
                  <MenuList>
                    {loggedIn && (
                      <>
                        <MenuItem
                          onClick={async () => {
                            await getSavedItems(threadID);
                          }}
                        >
                          <MdOutlineBookmarkBorder />
                          Saved items
                        </MenuItem>
                        <MenuItem>
                          <MdOutlineArchive />
                          Hide Archives
                        </MenuItem>
                      </>
                    )}

                    <MenuItem
                      color={"red"}
                      onClick={async () => {
                        openDelete();
                      }}
                    >
                      <FiTrash2 />
                      Delete Thread
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
            <ThreadTitle
              title={threadTitle}
              mentionedAgents={mentionedAgents}
              mode={mode}
            />
          </>
        )}
        {section === sections.UPLOAD && (
          <Text fontWeight={600}>Data Center</Text>
        )}
        <Spacer />

        <UserCorner loggedIn={loggedIn} />
      </Box>
    </>
  );
};

export default Header;
