/* eslint-disable react/no-unescaped-entities */

import { handleIndex } from "@/utils/pri-ai/handleIndex";
import useUploadFile from "@/utils/s3";
import { useFileUpload } from "@/utils/useFileUpload";
import { useEffect, useRef, useState } from "react";

const dataCloudIcon = "/assets/data-cloud.svg";
const {
  Input,
  Textarea,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  ListItem,
  List,
} = require("@chakra-ui/react");

export default function UploadModal({ isOpen, onClose, userID, index }) {
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [id, setID] = useState(handleIndex(index, userID));

  useEffect(() => {
    setID(handleIndex(index, userID));
  }, [index]);
  const [files, setSelectedFiles] = useFileUpload();
  const { isLoading, addFiles } = useUploadFile([]);
  const targetLanguage = useRef([]);
  const metaTagInput = useRef([]);
  const subscriptionPlans = useRef([]);
  const handleSave = () => {
    // Handle saving data and uploading files here
    //console.log("TARGET LANGUAGE ", targetLanguage.current.value);
    console.log("META TAGS ", metaTagInput.current);
    console.log("Saving ", files);

    //console.log("SAVE ", { id, source, content, files, language, plans: [...new Set(subscriptionPlans.current)], targetLanguage: [...new Set(targetLanguage.current)], metaTags: [...new Set(metaTagInput.current)] });

    if (files && files.length > 0) {
      // Upload files
      // Your file upload logic here
      addFiles({
        id,
        source,
        content,
        files,
        language,
        plans: [...new Set(subscriptionPlans.current)],
        targetLanguage: [...new Set(targetLanguage.current)],
        metaTags: [...new Set(metaTagInput.current)],
      });
    } else {
      addFiles({
        id,
        source,
        content,
        language,
        plans: [...new Set(subscriptionPlans.current)],
        targetLanguage: [...new Set(targetLanguage.current)],
        metaTags: [...new Set(metaTagInput.current)],
      });
    }
    setSource("");
    setContent("");
    onClose();
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      // width={"95vw"}
      isOpen={isOpen}
      onClose={onClose}
      // size={"full"}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        style={{ borderRadius: "10px", border: "0px solid transparent" }}
        width={{ base: "100%", md: "1500px" }}
        minWidth={{ base: "100%", md: "1500px" }}
        // height={{ base: "100%", md: "85vh" }}
        // maxHeight={{ base: "100%", md: "200px" }}
        minHeight={{ base: "100%", md: "800px" }}
        marginTop={"auto"}
        marginBottom={"auto"}
      >
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <ModalBody
          display={"flex"}
          // paddingLeft={"0px"}
          // paddingRight={"0px"}
          // paddingTop={"0px"}
          // paddingBottom={"0px"}
          flexDirection={"column"}
          // height={"100%"}
          padding={"10px"}
          gap={"10px"}
        >
          <Text>Title</Text>
          <Input onChange={handleSourceChange} value={source} />
          <Text>Content</Text>
          <Textarea
            marginBottom={"20px"}
            flex={1}
            onChange={handleContentChange}
            value={content}
          />
          {files && (
            <List>
              {files.map((file, i) => {
                return <ListItem key={`${i}-file`}>{file.name}</ListItem>;
              })}
            </List>
          )}
          <Button
            isDisabled={content !== ""}
            onClick={() => {
              setSelectedFiles({ multiple: true, accept: ".txt" }, (files) => {
                files.map(({ source, name, size, file }) => {
                  console.log({ source, name, size, file });
                });
              });
            }}
          >
            Add Files
          </Button>
          <Button
            isDisabled={(content === "" || source === "") && files === null}
            isLoading={isLoading}
            onClick={handleSave}
          >
            Upload
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
