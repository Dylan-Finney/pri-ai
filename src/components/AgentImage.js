import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

const AgentImage = ({
  show = true,
  url,
  icon,
  name,
  onError,
  size,
  defaultImage,
  iconScale = 1,
}) => {
  const [imageError, setImageError] = useState(false);
  const [iconError, setIconError] = useState(false);
  const sizeFunc = () => {
    switch (size) {
      case 2:
        return 40;
      case 3:
        return 30;
      default:
        return 84;
    }
  };
  return (
    <>
      {show && url !== undefined && (
        <Box position={"relative"}>
          <Box
            alignSelf={"center"}
            overflow={"hidden"}
            borderRadius={"50%"}
            // height={"fit-content"}
            width={`${sizeFunc()}px`}
            height={`${sizeFunc()}px`}
            borderColor={"#98a2b3"}
            borderWidth={"2px"}
          >
            <Image
              src={
                imageError
                  ? defaultImage !== undefined && defaultImage !== ""
                    ? defaultImage
                    : undefined
                  : url.startsWith("http") || url.startsWith("/assets/")
                  ? url
                  : `/assets/agents/${url}`
              }
              // width={84}
              // height={84}
              onError={() => {
                console.error(`${name} image error`);
                setImageError(true);
              }}
              // layout={"fill"}
              borderRadius={"50%"}
              objectFit={"cover"}
              alt={`Picture of ${name}`}
              width={sizeFunc()}
              height={sizeFunc()}
              style={{ borderRadius: "100px" }}
            />
          </Box>
          {icon !== "" ? (
            <>
              {/* {console.log("icon", typeof icon, icon)} */}
              {typeof icon === "string" && (
                <Box
                  position={"absolute"}
                  padding={`${sizeFunc() / 15}px`}
                  background={"white"}
                  borderRadius={"50%"}
                  bottom={-1}
                  right={-1}
                >
                  <Image
                    src={icon}
                    // width={84}
                    // height={84}
                    hidden={iconError}
                    onError={() => {
                      console.error(`${name} image error`);
                      setIconError(true);
                    }}
                    // layout={"fill"}
                    // borderRadius={"50%"}
                    objectFit={"cover"}
                    alt={`Picture of ${name}`}
                    width={sizeFunc() / 3}
                    height={sizeFunc() / 3}
                    style={
                      {
                        //   borderRadius: "100px",
                        //   backgroundColor: "white",
                      }
                    }
                  />
                </Box>
              )}
              {typeof icon === "function" && (
                <Box
                  position={"absolute"}
                  padding={`${sizeFunc() / 15}px`}
                  background={"white"}
                  borderRadius={"50%"}
                  bottom={-1}
                  right={-1}
                >
                  {icon(iconScale)}
                </Box>
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      )}
    </>
  );
};

export default AgentImage;
