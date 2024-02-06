import { Box, Text, Tooltip } from "@chakra-ui/react";

const Thread = ({ active, title, onClick }) => {
  return (
    <Box onClick={onClick} backgroundColor={active ? "#F5F7F9" : "white"}>
      <Tooltip label={title}>
        <Text
          noOfLines={1}
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          // wordBreak={"break-all"}
          overflow={"hidden"}
          pl={3}
          pt={3}
          pb={3}
          color={"#344054"}
          fontWeight={active ? 700 : 400}
        >
          {title}
        </Text>
      </Tooltip>
    </Box>
  );
};

export default Thread;
