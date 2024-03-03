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
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  useEditableControls,
} from "@chakra-ui/react";
import { TbEdit } from "react-icons/tb";
import { Image } from "@chakra-ui/react";
import { GoMute, GoUnmute } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgSlack } from "react-icons/cg";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";
// import { changeName } from "../utils/backend/changeName";
import { agentsDemoImages } from "../utils/agents";
import AgentImage from "./AgentImage";
import { DataContext } from "./App";
import ThreadTitle from "./ThreadTitle";
import sections from "@/utils/sections";

const share = "/assets/share.svg";

const logo = "/assets/logo.svg";

const Header = ({
  selectedAvatar,
  onboarding,
  aIName,
  setAIName,
  mute,
  setMute,
  onSideBarOpen,
  clearChat,
  onSharingOpen,
  userID,
  initializing,
  mode,
  changeMode,
  loggedIn = false,
  threadTitle = "New Thread",
  mentionedAgents = ["Assistant"],
  section,
  show,
}) => {
  const { agents } = useContext(DataContext);
  const mentionedAgentsFiltered = mentionedAgents.slice(-3).reverse();
  const [customAIName, setCustomAIName] = useState(aIName || "");

  // const [colorTitle, setColorTitle] = useState(aIName || "");

  useEffect(() => {
    setCustomAIName(aIName || "");
  }, [aIName]);

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          size="sm"
          icon={<TbEdit size="1.5em" />}
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "1rem",
        // marginTop: "10px",
        // marginBottom: "10px",
        height: "7vh",
      }}
    >
      <Box
        display={{
          base: section !== sections.UPLOAD ? "none" : "flex",
          md: "flex",
        }}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
      >
        {section === 0 && show && (
          <ThreadTitle
            title={threadTitle}
            mentionedAgents={mentionedAgents}
            mode={mode}
          />
        )}
        {section === 2 && <Text>Data Center</Text>}

        {/* <Text marginLeft={"0.5rem"} as='b'>{aIName}</Text><TbEdit size="1.5em"style={{ display: 'inline-block' }}/> */}

        {/* <Spacer />
        {loggedIn && (
          <Button
            marginRight={"1rem"}
            size="sm"
            backgroundColor={"#f0fdf9"}
            color={"#107569"}
            onClick={() => {
              changeMode();
            }}
          >
            {mode ? `GPT MODE` : `PRI AI MODE`}
          </Button>
        )} */}

        {/*
        <Button
          marginRight={"1rem"}
          size="sm"
          backgroundColor={"#f0fdf9"}
          color={"#107569"}
          onClick={() => {
            clearChat();
          }}
        >
          Clear chat{" "}
          <Box marginLeft={"5px"}>
            <RiDeleteBin6Line size={16} />
          </Box>
        </Button>
        <Button
          marginRight={"1rem"}
          size="sm"
          backgroundColor={"#0e9384"}
          color={"#FFFFFF"}
          width={"fit-content"}
          minWidth={"152px"}
          onClick={() => {
            window
              .open(
                "https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ",
                "_blank"
              )
              .focus();
          }}
        >
          <Text>Join the community</Text>
          <Box marginLeft={"5px"}>
            <CgSlack size={16} />
          </Box>
        </Button>
        <Button
          marginRight={"1rem"}
          size="sm"
          color={"#107569"}
          variant={"ghost"}
          onClick={() => {
            onSharingOpen();
          }}
        >
          Share{" "}
          <Box
            marginLeft={"5px"}
            minWidth={"16px"}
            width={"20px"}
            height={"20px"}
          >
            <Image boxSize={"20px"} alt="Share Icon" src={share} />
          </Box>
        </Button> */}
      </Box>
      <Box
        display={{
          base: section !== sections.UPLOAD ? "flex" : "none",
          md: "none",
        }}
        flexDirection={"row"}
        width={"100%"}
        alignItems={"center"}
      >
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
          paddingLeft={"10px"}
          color="#0E9384"
          fontWeight="700"
          fontSize={"20px"}
        >
          Pri-AI
        </Text>
        <Spacer />
        <IconButton
          icon={<HamburgerIcon />}
          marginRight={"1rem"}
          onClick={onSideBarOpen}
        />
      </Box>
    </Box>
  );
};

export default Header;
