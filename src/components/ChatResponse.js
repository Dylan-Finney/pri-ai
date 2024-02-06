import {
  Box,
  Image,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
// import { ChatIcon } from "./ChatIcon";
import { CgSlack } from "react-icons/cg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MessageContainer from "./Message/MessageContainer";
import MessageHeader from "./Message/MessageHeader";
import ResponseText from "./Message/ResponseText";
import FeedbackSection from "./Message/Feedback/FeedbackSection";
import FeedbackInput from "./Message/Feedback/FeedbackInput";

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
    props.submitFeedback(helpful, data.feedbackDetails);
    onFeedbackClose();
  };

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
      <MessageContainer prompt={false}>
        <MessageHeader
          avatar={props.selectedAvatar}
          name={props.aIName}
          time={props.time}
          prompt={false}
        />
        <ResponseText text={props.text} generating={props.generating} />
        {props.feedback === true && (
          <FeedbackSection
            feedbackGiven={props.helpful}
            openFeedbackModal={(positive) => {
              onFeedbackOpen();
              setHelpful(positive);
            }}
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
