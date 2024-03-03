import { useFileUpload } from "@/utils/useFileUpload";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AgentImage from "../AgentImage";

const AgentsCard = ({
  url,
  title,
  call,
  description,
  icon,
  index,
  defaultImage,
  innerRef,
  scrollTo = false,
  uploadable = false,
  agentID,
  openUploadModal,
  awsIndex,
  demoMode = true,
  changeDetails,
  selectAgent,
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
      // justifyContent={"center"}
      alignItems={"center"}
      onClick={(event) => {
        event.stopPropagation();
        selectAgent(call);
      }}
    >
      {url && !imageError && (
        <AgentImage
          show={url}
          icon={icon}
          name={title}
          url={url}
          defaultImage={defaultImage}
        />
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
      </Flex>
    </Flex>
  );
};

export default AgentsCard;
