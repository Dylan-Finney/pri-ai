import { Box, Text } from "@chakra-ui/react";
import NextImage from "next/image";
const logo = "/assets/logo.svg";

const LogoHeader = () => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        marginLeft: "10px",
        marginTop: "10px",
        alignItems: "center",
      }}
    >
      <Box
        style={{
          display: "inline-block",
          filter:
            "drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.1)) drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06))",
        }}
      >
        <NextImage src={logo} alt={"logo"} width={40} height={40} />
      </Box>
      <Text
        paddingLeft={"10px"}
        color="#0E9384"
        fontWeight="700"
        fontSize={"20px"}
      >
        Pri-AI
      </Text>
    </Box>
  );
};

export default LogoHeader;
