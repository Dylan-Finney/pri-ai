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
import NextImage from "next/image";
import { GoMute, GoUnmute } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgSlack } from "react-icons/cg";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";

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
}) => {
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
        {selectedAvatar === null || onboarding ? (
          <></>
        ) : (
          <>
            {initializing === true ? (
              <>
                <SkeletonCircle width={"40px"} height={"40px"} />
                <SkeletonText
                  skeletonHeight={"8"}
                  noOfLines={1}
                  maxWidth={"30%"}
                  minWidth={"20%"}
                  marginLeft={"0.5rem"}
                  transitionDelay={20}
                  marginRight={"0.5rem"}
                />
              </>
            ) : (
              <>
                <div
                  style={{
                    flex: "none",
                    order: "0",
                    flexGrow: "0",
                    position: "relative",
                  }}
                >
                  <Box style={{ width: "40px", height: "40px" }}>
                    <NextImage
                      src={`/assets/avatar/${selectedAvatar}`}
                      alt="Avatar"
                      width={100}
                      height={100}
                    />
                  </Box>
                  <div
                    style={{
                      background: "#12B76A",
                      border: "2.5px solid #FFFFFF",
                      borderRadius: "10px",
                      width: "15px",
                      height: "15px",
                      position: "absolute",
                      right: "0px",
                      bottom: "0px",
                    }}
                  />
                </div>
                <Editable
                  textAlign="center"
                  alignItems="center"
                  display={"flex"}
                  flexDirection={"row"}
                  defaultValue={aIName}
                  // value={aIName || ""}

                  onSubmit={async (newValue) => {
                    setAIName(newValue);
                    try {
                      await getCurrentUser();
                      axios({
                        method: "POST",
                        url: "/api/changeName",
                        data: { newName: newValue },
                      });
                    } catch (e) {}
                  }}
                  as={"b"}
                  marginLeft={"0.5rem"}
                  marginRight={"0.5rem"}
                  isPreviewFocusable={false}
                  submitOnBlur={false}
                  onChange={(nextValue) => {
                    setCustomAIName(nextValue);
                  }}
                  value={customAIName}
                >
                  <EditablePreview
                    width={"fit-content"}
                    marginRight={"0.5rem"}
                  />
                  {/* Here is the custom input */}
                  <Input
                    as={EditableInput}
                    width={"fit-content"}
                    marginRight={"0.5rem"}
                  />
                  <EditableControls />
                </Editable>
              </>
            )}

            {/* <Text as="b" borderRadius={"25px"} paddingLeft={"1rem"} paddingRight={"1rem"} height={"fit-content"} paddingBottom={"0rem"} color={"#027948"} backgroundColor={"#ecfdf3"}><span style={{height: "5px",  width: "5px","background-color": "#12b76a","border-radius": "50%", display: "inline-block", marginBottom: "3px"}}/> Online</Text> */}
          </>
        )}
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
            <NextImage width={100} height={100} alt="Share Icon" src={share} />
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
          <NextImage src={logo} alt="Logo" width={100} height={100} />
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
