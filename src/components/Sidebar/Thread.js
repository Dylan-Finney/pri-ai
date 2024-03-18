import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { UIContext } from "../App";

const Thread = ({
  active = false,
  title,
  onClick,
  // isLargerThanMD = true,
  // threadID,
  // deleteConvo,
}) => {
  const { isLargerThanMD } = useContext(UIContext);
  // let hovered = false;
  // const [hovered, setHovered] = useState(false);
  return (
    <Flex
      backgroundColor={active ? "#F5F7F9" : "white"}
      flexDirection={"row"}
      alignItems={"center"}
      // onMouseOver={() => {
      //   setHovered(true);
      // }}
      // onMouseOut={() => {
      //   setHovered(false);
      // }}
    >
      <Box
        onClick={onClick}
        width={"100%"}
        maxWidth={isLargerThanMD ? "90%" : "200px"}
      >
        <Tooltip label={title}>
          <Text
            // noOfLines={1}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            // wordBreak={"break-all"}
            overflow={"hidden"}
            // isTruncated={true}
            pl={3}
            pt={3}
            pb={3}
            color={"#344054"}
            maxWidth={isLargerThanMD ? "90%" : "200px"}
            fontWeight={active ? 700 : 400}
          >
            {title}
          </Text>
        </Tooltip>
      </Box>

      {/* <Spacer /> */}
      {/* {(hovered === true || active === true) && (
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
                display={"flex"}
                cursor={"pointer"}
                // backgroundColor={"green"}
              >
                <FiMoreVertical />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={async () => {
                    await deleteConvo(threadID);
                  }}
                >
                  Delete Thread
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      )} */}
    </Flex>
  );
};

export default Thread;
