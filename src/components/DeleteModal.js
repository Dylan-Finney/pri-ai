import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext, ConvoContext, UIContext } from "./App";
import axios from "axios";

export default function DeleteModal() {
  const { loggedIn } = useContext(AuthContext);
  const {
    bookmarks,
    setBookmarks,
    setConversations,
    conversations,
    conversationID,
    changeConversation,
  } = useContext(ConvoContext);

  const { isDeleteOpen, onDeleteClose } = useContext(UIContext);

  const threadID = conversationID;
  const deleteThread = async (threadID) => {
    if (bookmarks[threadID] && loggedIn) {
      await axios({
        method: "POST",
        url: "/api/deleteBookmarks",
        data: {
          threadID,
          bookmarks: bookmarks[threadID],
        },
      });
      const copy = { ...bookmarks };
      delete copy[threadID];
      setBookmarks(copy);
    }
    setConversations(conversations.filter((convo) => convo.id !== threadID));
    if (threadID === conversationID) {
      changeConversation(-1);
    }
  };
  return (
    <Modal
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      // width={"95vw"}
      isOpen={isDeleteOpen}
      isCentered
      size={"xl"}
      onClose={onDeleteClose}
      //   size={""}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          onClick={() => {
            onDeleteClose();
          }}
        />
        <ModalBody>
          <Text fontWeight={600} fontSize={"20px"} pt={"10px"} pb={"10px"}>
            Delete this chat?
          </Text>
          <Box
            height={"1px"}
            width={"100%"}
            backgroundColor={"#d8d8d8"}
            mb={"30px"}
          />
          <Text mb={"30px"}>This will delete the secleted chat forever.</Text>
          <ButtonGroup mb={"30px"} width={"100%"}>
            <Button
              width={"20%"}
              marginLeft={"auto"}
              onClick={() => {
                onDeleteClose();
              }}
            >
              Cancel
            </Button>
            <Button
              width={"20%"}
              colorScheme="red"
              onClick={async () => {
                await deleteThread(threadID);
                onDeleteClose();
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
