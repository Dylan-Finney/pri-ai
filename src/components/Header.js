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
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";
import { changeName } from "../utils/backend/changeName";
import { agentsDemoImages } from "../utils/agents";

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
}) => {
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
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      <Box
        display={{ base: "none", md: "flex" }}
        width={"100%"}
        height={"100%"}
        alignItems={"center"}
      >
        <Flex
          flexDir={"row"}
          padding={"10px"}
          borderBottom={"1px solid #EAECF0"}
          alignItems={"center"}
        >
          {console.log({ mentionedAgents })}
          {mode ? (
            <>
              {mentionedAgentsFiltered.map((speaker, agentIndex) => {
                return (
                  <>
                    <Text>{JSON.stringify(agentsDemoImages[speaker])}</Text>
                    <Box
                      width={"32px"}
                      height={"32px"}
                      backgroundColor={"white"}
                      border={"1px solid white"}
                      borderRadius={"20px"}
                      marginLeft={agentIndex > 0 ? "-10px" : "unset"}
                    >
                      {agentsDemoImages[speaker] !== undefined
                        ? agentsDemoImages[speaker].threadIcon
                        : agentsDemoImages["Nutritionist"].threadIcon}
                    </Box>
                  </>
                );
              })}
            </>
          ) : (
            <>
              {mentionedAgentsFiltered.map((speaker, agentIndex) => {
                return (
                  <>
                    <Box
                      width={"32px"}
                      height={"32px"}
                      backgroundColor={"white"}
                      border={"1px solid white"}
                      borderRadius={"20px"}
                      marginLeft={agentIndex > 0 ? "-10px" : "unset"}
                    >
                      {/* {agentsImages[speaker]?.threadIcon ? (
                        agentsImages[speaker].threadIcon
                      ) : (
                        <AIAvatar scale={2} />
                      )} */}
                    </Box>
                  </>
                );
              })}
            </>
          )}

          {mentionedAgents.length > 3 && (
            <Box
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
                  +{mentionedAgents.length - 3}
                </Text>
              </Flex>
            </Box>
          )}
          <Flex flexDir={"column"} paddingLeft={"10px"} overflow={"hidden"}>
            <Text
              fontWeight={600}
              fontSize={"12px"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {threadTitle}
            </Text>
            <Text
              fontWeight={400}
              fontSize={"10px"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
            >
              {[...mentionedAgents].reverse().join(", ")}
            </Text>
            <Text></Text>
          </Flex>
        </Flex>
        {/* <Text marginLeft={"0.5rem"} as='b'>{aIName}</Text><TbEdit size="1.5em"style={{ display: 'inline-block' }}/> */}

        <Spacer />
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
        )}

        <Button
          marginRight={"1rem"}
          size="sm"
          backgroundColor={"#f0fdf9"}
          color={"#107569"}
          onClick={() => {
            setMute(!mute);
          }}
        >
          {mute ? (
            <>
              Unmute{" "}
              <Box marginLeft={"5px"}>
                <GoMute size={16} />
              </Box>
            </>
          ) : (
            <>
              Mute{" "}
              <Box marginLeft={"5px"}>
                <GoUnmute size={16} />
              </Box>
            </>
          )}
        </Button>
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
        </Button>
      </Box>
      <Box
        display={{ base: "flex", md: "none" }}
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
