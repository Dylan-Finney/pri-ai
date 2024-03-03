import {
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
// import { ChatIcon } from "./ChatIcon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FeedbackInput from "./Message/Feedback/FeedbackInput";
import FeedbackSection from "./Message/Feedback/FeedbackSection";
import MessageContainer from "./Message/MessageContainer";
import MessageHeader from "./Message/MessageHeader";
import ResponseText from "./Message/ResponseText";

export default function ChatResponse(props) {
  const {
    isOpen: isFeedbackOpen,
    onOpen: onFeedbackOpen,
    onClose: onFeedbackClose,
  } = useDisclosure();
  const [helpful, setHelpful] = useState(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    props.submitFeedback({
      helpful,
      details: data.feedbackDetails,
      index: props.index,
    });
    onFeedbackClose();
    setFeedbackGiven(helpful);
  };

  // console.log({ helpful: props.helpful });
  const [feedbackGiven, setFeedbackGiven] = useState(props.helpful);

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
        isOpen={isFeedbackOpen}
        onClose={() => {
          reset({
            feedbackDetails: "",
          });
          onFeedbackClose();
        }}
        size={"3xl"}
      >
        <ModalOverlay />
        <ModalContent
          style={{
            overflowX: "hidden",
            borderRadius: "10px",
            border: "0px solid transparent",
          }}
          width={"700px"}
          height={"fit-content"}
          minHeight={"0vh"}
          marginTop={"auto"}
          marginBottom={"auto"}
          padding={"35px"}
        >
          <ModalCloseButton
            onClick={() => {
              onFeedbackClose();
            }}
          />
          <Flex alignContent={"center"} marginBottom="10px">
            {helpful ? (
              <>
                <Flex
                  backgroundColor={"#90EE90 "}
                  minWidth={"30px"}
                  minHeight={"30px"}
                  maxWidth={"30px"}
                  maxHeight={"30px"}
                  border={"1px solid #777777"}
                  borderRadius={"30px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <FiThumbsUp color={"#008000"} />
                </Flex>
              </>
            ) : (
              <>
                <Flex
                  backgroundColor={"#FFC0CB"}
                  width={"30px"}
                  height={"30px"}
                  border={"1px solid #777777"}
                  borderRadius={"30px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <FiThumbsDown color={"#FF0000 "} />
                </Flex>
              </>
            )}
            <Text marginLeft={"10px"}>Provide additonal feedback</Text>
          </Flex>
          <form
            style={{ height: "100%", display: "contents" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FeedbackInput
              control={control}
              name={"feedbackDetails"}
              errors={errors.feedbackDetails}
              helpful={helpful}
            />

            {/* <textarea {...register("feedbackDetails", {
                    maxLength: {
                        value: 2000,
                        message: "Max Length is 2000"
                })}/> */}
            <Button
              marginTop={"10px"}
              type={"submit"}
              isDisabled={props.saving}
              alignSelf={"end"}
            >
              Submit feedback
            </Button>
          </form>
        </ModalContent>
      </Modal>
      <MessageContainer bookmarked={props.displayBookmarked} prompt={false}>
        <MessageHeader
          avatar={props.selectedAvatar}
          speaker={props.speaker}
          time={props.time}
          prompt={false}
          openSideTab={props.openSideTab}
        />
        <ResponseText text={props.text} generating={props.generating} />
        {props.feedback === true && (
          <FeedbackSection
            feedbackGiven={feedbackGiven}
            openFeedbackModal={(positive) => {
              if (feedbackGiven !== null && feedbackGiven !== undefined) {
                props.submitFeedback({ remove: true, index: props.index });
                setHelpful(null);
                setFeedbackGiven(null);
              } else {
                onFeedbackOpen();
                setHelpful(positive);
              }
            }}
            threadID={props.threadID}
            time={props.time}
            asBookmark={props.asBookmark}
            bookmarked={props.bookmarked}
            bookmarkMessage={props.bookmarkMessage}
          />
        )}
        {/* {props.end === false && (
          <Box
            marginLeft={{ base: "25px", sm: "45px", lg: "47px" }}
            gap={"10px"}
            display={"flex"}
            flexDirection={{ base: "column", sm: "row" }}
          >
            <Button borderRadius={"8px"} backgroundColor={"#F0FDF9"}>
              <Text fontWeight={"600"} color={"#107569"} marginRight={"5px"}>
                Start a new chat
              </Text>
              <ChatIcon color="#107569" boxSize={6} />
            </Button>
            <Button borderRadius={"8px"} backgroundColor={"#0E9384"}>
              <Text
                fontWeight={"600"}
                color={"#FFFFFF"}
                marginRight={"5px"}
                onClick={() => {
                  window
                    .open(
                      "https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ",
                      "_blank"
                    )
                    .focus();
                }}
              >
                Join the community
              </Text>{" "}
              <CgSlack color={"#FFFFFF"} size={"22px"} />
            </Button>
          </Box>
        )} */}
      </MessageContainer>
    </>
  );
}
