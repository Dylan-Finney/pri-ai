import { Box, Text } from "@chakra-ui/react";
import NextImage from "next/image";
const external = "/assets/external.svg";

const SidebarItem = ({
  image,
  icon,
  altText,
  active,
  text,
  changeSection,
  link,
  first,
  last,
}) => {
  return (
    <Box
      onClick={() => {
        changeSection();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: first ? "10vh" : null,
        marginBottom: last ? "auto" : null,
        paddingLeft: "10px",
        paddingTop: "3px",
        paddingBottom: "3px",
        borderRadius: "25px",
        cursor: "pointer",
        backgroundColor: active ? "#f9fafb" : null,
      }}
    >
      {icon !== undefined ? (
        <>{icon}</>
      ) : (
        <Box
          style={{
            display: "inline-block",
            marginTop: "auto",
            marginBottom: "auto",
            flexShrink: "0",
          }}
        >
          <NextImage src={image} alt={altText} width={23} height={23} />
        </Box>
      )}

      <Text
        as="b"
        marginTop={"auto"}
        marginBottom={"auto"}
        marginLeft={"7px"}
        fontWeight={"600"}
        textAlign={"left"}
        left={"2rem"}
      >
        {text}
      </Text>
      {link && (
        <Box
          style={{
            display: "inline-block",
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            flexShrink: "0",
          }}
        >
          <NextImage
            src={external}
            alt={"external icon"}
            width={18}
            height={17}
          />
        </Box>
      )}
    </Box>
  );
};

export default SidebarItem;
