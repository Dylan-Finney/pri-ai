import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import LogoHeader from "./Sidebar/LogoHeader";
import ChatIcon from "./ChatIcon2";
import UploadIcon from "./UploadIcon";
import MuteButton from "./MuteButton";
import sections from "@/utils/sections";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "aws-amplify/auth";
import React, { useContext } from "react";
import { AuthContext, ConvoContext, UIContext } from "./App";

const SmallButton = ({ icon, toSection, changeSection }) => {
  const { setSection, section } = useContext(UIContext);
  const active = section === toSection;
  return (
    <Box
      cursor={"pointer"}
      onClick={() => {
        setSection(toSection);
      }}
    >
      {React.cloneElement(icon, { active: active })}
    </Box>
  );
};

const ExtendedButton = ({ toSection, title, icon }) => {
  const { setSection, onSideBarClose, section } = useContext(UIContext);
  const active = section === toSection;
  return (
    <Flex
      padding={"10px"}
      borderRadius={"5px"}
      cursor={"pointer"}
      backgroundColor={active ? "#2c2d32" : "transparent"}
      width={"100%"}
      flexDirection={"row"}
      onClick={() => {
        setSection(toSection);
        onSideBarClose();
      }}
      alignItems={"center"}
      marginRight={"auto"}
    >
      {React.cloneElement(icon, { active: active })}
      <Text color={active ? "white" : "#546074"}>{title}</Text>
    </Flex>
  );
};

const LogoutButton = () => {
  return (
    <Flex
      cursor={"pointer"}
      padding={"5px"}
      flexDirection={"row"}
      onClick={async () => {
        await signOut();
        location.reload();
      }}
      alignItems={"center"}
      marginRight={"auto"}
      width={"100%"}
    >
      <Text color={"white"}>Logout</Text>
      <Spacer />
      <FiLogOut color="white" />
    </Flex>
  );
};

const LoggedInHeader = ({ name }) => {
  return (
    <Text color={"white"} marginRight={"auto"}>
      {name}
    </Text>
  );
};

const SideMenu = () => {
  const { isLargerThanMD } = useContext(UIContext);
  const { mute, setMute } = useContext(ConvoContext);
  const { loggedIn, details } = useContext(AuthContext);
  const asDrawer = !isLargerThanMD;
  return (
    <>
      {asDrawer ? (
        <Flex
          height={"100vh"}
          width={"100%"}
          flexDirection={"column"}
          backgroundColor={"#1e1e23"}
          alignItems={"center"}
          // justifyContent={"center"}
          gap={"20px"}
        >
          <LoggedInHeader name={details.name} />

          <ExtendedButton
            toSection={sections.CHAT}
            title={"Chat"}
            icon={<ChatIcon />}
          />
          {loggedIn && (
            <>
              <ExtendedButton
                toSection={sections.UPLOAD}
                title={"Upload"}
                icon={<UploadIcon />}
              />
              <Spacer />
              <MuteButton setMute={setMute} mute={mute} />
              <LogoutButton />
            </>
          )}
        </Flex>
      ) : (
        <Flex
          height={"100vh"}
          width={"100px"}
          flexDirection={"column"}
          backgroundColor={"#1e1e23"}
          alignItems={"center"}
          // justifyContent={"center"}
          gap={20}
        >
          <LogoHeader />
          <SmallButton
            // changeSection={setSection}
            toSection={sections.CHAT}
            icon={<ChatIcon />}
          />
          {loggedIn && (
            <SmallButton toSection={sections.UPLOAD} icon={<UploadIcon />} />
          )}

          <Spacer />
          <MuteButton setMute={setMute} mute={mute} />
        </Flex>
      )}
    </>
  );
};

export default SideMenu;
