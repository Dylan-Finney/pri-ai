import { Box, Text, Image } from "@chakra-ui/react";
// import NextImage from "next/image";
const User = ({ name }) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "10px",
        marginLeft: "10px",
        paddingTop: "10px",
        justifyContent: "flex-start",
        // borderTop: "1px solid #eaecf0",
        width: "100%",
      }}
    >
      <Box
        style={{
          display: "inline-block",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <Image
          src={`/assets/avatar/Unknown.svg`}
          alt={"Profile Pic"}
          boxSize={"40px"}
        />
      </Box>
      <Text paddingLeft={"5px"} fontWeight="600">
        {name}
      </Text>
    </Box>
  );
};

export default User;
