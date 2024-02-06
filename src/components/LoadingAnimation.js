import { Box, Spacer, Spinner } from "@chakra-ui/react";

const LoadingAnimation = () => {
  return (
    <Box
      backgroundColor={"#FFFFFF"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      padding={"10px"}
      display={"flex"}
    >
      <Spacer />
      <Spinner />
      <Spacer />
    </Box>
  );
};

export default LoadingAnimation;
