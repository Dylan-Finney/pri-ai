import { Box, Text } from "@chakra-ui/react";

const ThreadGroupTitle = ({ title }) => {
  return (
    <Box>
      <Text pl={3} color={"#969696"}>
        {title}
      </Text>
    </Box>
  );
};

export default ThreadGroupTitle;
