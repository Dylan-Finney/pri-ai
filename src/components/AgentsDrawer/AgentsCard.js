// import { useFileUpload } from "../utils/";
import { useFileUpload } from "../../utils/useFileUpload";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { changeAgentDetails } from "../../utils/backend/changeAgentDetails";

const AgentsCard = ({
  url,
  title,
  call,
  description,
  icon,
  index,
  innerRef,
  scrollTo = false,
  uploadable = false,
  agentID,
  openUploadModal,
  awsIndex,
  demoMode = true,
  changeDetails,
}) => {
  // console.log(index);
  const [files, setSelectedFiles] = useFileUpload();
  const [imageButtonLoading, setImageButtonLoading] = useState(false);
  const [titleButtonLoading, setTitleButtonLoading] = useState(false);
  const thisRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    // const checkIfLinkResultsIn404 = async () => {
    //   const response = await fetch(url, {
    //     method: "HEAD", // Use HEAD method to retrieve headers only without fetching the entire image
    //   });
    //   // const x = await axios({ url });
    //   console.log({ response });
    // };
    if (scrollTo === true) {
      console.log("this", thisRef.current);
      if (thisRef.current !== null) {
        thisRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // checkIfLinkResultsIn404();
  });

  console.log({ url });
  return (
    <Flex
      // ref={innerRef}
      ref={thisRef}
      id={`agent_${index}`}
      flexDir={"column"}
      padding={"20px"}
      backgroundColor={"#F9FAFB"}
      borderRadius={"8px"}
      border={"1px solid #EAECF0"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {url && !imageError && (
        <Box position={"relative"}>
          <Box
            alignSelf={"center"}
            overflow={"hidden"}
            borderRadius={"5px"}
            width={84}
            height={84}
          >
            <Image
              src={url.startsWith("http") ? url : `/assets/agents/${url}`}
              // width={84}
              // height={84}
              onError={() => {
                setImageError(true);
              }}
              boxSize={84}
              borderRadius={"10px"}
              objectFit="cover"
              alt={`Picture of ${title}`}
              style={{ maxWidth: "unset" }}
            />
          </Box>
          <Box position={"absolute"} zIndex={2} bottom={-1} right={-1}>
            {icon}
          </Box>
        </Box>
      )}

      <Flex flexDir={"column"}>
        <Text
          color={"#101828"}
          fontWeight={600}
          fontSize={"14px"}
          textAlign={"center"}
        >
          {title}{" "}
          <span
            style={{
              // marginLeft: "auto",
              color: "#107569",
              fontWeight: 500,
              fontSize: "12px",
              backgroundColor: "#F0FDF9",
              padding: "2px 8px",
              borderRadius: "16px",
            }}
          >
            @{call}
          </span>
        </Text>
        <Text textAlign={"center"} color={"#475467"} fontSize={"12px"}>
          {description}
        </Text>
        {!demoMode && (
          <Flex justifyContent={"center"}>
            <Button
              isLoading={titleButtonLoading}
              onClick={async () => {
                const newTitle = window.prompt(
                  `What do you want to rename "${title}" to`,
                  title
                );
                if (title !== newTitle) {
                  setTitleButtonLoading(true);
                  await changeAgentDetails({
                    agentID,
                    name: newTitle,
                  });
                  changeDetails({ newTitle, newURL: url });
                  setTitleButtonLoading(false);
                }
              }}
            >
              Change
            </Button>
            <Button
              isLoading={imageButtonLoading}
              onClick={() => {
                setSelectedFiles(
                  { multiple: false, accept: [".png", ".jpeg", ".jpg"] },
                  (files) => {
                    setImageButtonLoading(true);
                    files.map(async ({ source, name, size, file }) => {
                      console.log({ source, name, size, file });

                      const reader = new FileReader();
                      reader.readAsDataURL(file);

                      reader.onload = async () => {
                        try {
                          const splitName = name.split(".");
                          const value = await changeAgentDetails({
                            agentID,
                            imageEncoded: reader.result,
                            type: splitName[splitName.length - 1],
                            contentType: file.type,
                          });
                          changeDetails({
                            newTitle: title,
                            newURL: value,
                          });
                          setImageButtonLoading(false);
                        } catch (error) {
                          console.error("Error uploading file:", error);
                        }
                      };
                      reader.onerror = (error) => {
                        console.error("Error reading file:", error);
                      };
                    });
                  }
                );
              }}
            >
              Image
            </Button>
            {uploadable === true && (
              <Button
                onClick={() => {
                  openUploadModal(awsIndex);
                }}
              >
                Upload
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AgentsCard;
