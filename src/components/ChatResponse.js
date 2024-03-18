import {
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
// import { ChatIcon } from "./ChatIcon";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FeedbackInput from "./Message/Feedback/FeedbackInput";
import FeedbackSection from "./Message/Feedback/FeedbackSection";
import MessageContainer from "./Message/MessageContainer";
import MessageHeader from "./Message/MessageHeader";
import ResponseText from "./Message/ResponseText";
import { negativeFeedbackOptions } from "@/utils/constants";
import { ConvoContext } from "./App";

export default function ChatResponse(props) {
  // const { aIName } = useContext(ConvoContext);
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
    submit(helpful, selectedNegFeedbackIndex, data);
  };

  const submit = (helpful = true, selectedIndex, data) => {
    var details = "";
    if (!helpful) {
      details += `${negativeFeedbackOptions[selectedIndex]}.`;
      if (data) {
        details += ` - ${data.feedbackDetails}`;
      }
    }
    props.submitFeedback({
      helpful,
      details,
      index: props.index,
    });
    onFeedbackClose();
    setFeedbackGiven(helpful);
  };

  // console.log({ helpful: props.helpful });
  const [feedbackGiven, setFeedbackGiven] = useState(props.helpful);
  const [selectedNegFeedbackIndex, setSelectedNegFeedbackIndex] = useState(
    negativeFeedbackOptions.length - 1
  );

  // const [feedbackJustSubmitted, setFeedbackJustSubmitted] = useState(false);

  useEffect(() => {
    console.log({ helpful });
  }, [isFeedbackOpen]);

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
            <Text fontWeight={600}>Additional Feedback</Text>
          </Flex>
          <Wrap width={"100%"}>
            {negativeFeedbackOptions.map((feedbackText, index) => {
              return (
                <WrapItem
                  key={index}
                  backgroundColor={
                    selectedNegFeedbackIndex === index ? "black" : "transparent"
                  }
                  cursor={"pointer"}
                  border={"1px solid #d2d2d2"}
                  borderRadius={"20px"}
                  padding={"3px"}
                  paddingLeft={"10px"}
                  paddingRight={"10px"}
                  onClick={() => {
                    setSelectedNegFeedbackIndex(index);
                  }}
                >
                  <Text
                    width={"fit-content"}
                    alignSelf={"center"}
                    textAlign={"center"}
                    color={
                      selectedNegFeedbackIndex === index ? "white" : "#344054"
                    }
                  >
                    {feedbackText}
                  </Text>
                </WrapItem>
              );
            })}
          </Wrap>
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
      <MessageContainer
        asThread={props.asThread}
        bookmarked={props.bookmarked}
        prompt={false}
      >
        <MessageHeader
          // avatar={props.selectedAvatar}
          asThread={props.asThread}
          speaker={props.speaker}
          time={props.time}
          bookmarked={props.bookmarked}
          prompt={false}
          openSideTab={props.openSideTab}
        />
        <ResponseText text={props.text} generating={props.generating} />
        {props.feedback === true && (
          <FeedbackSection
            feedbackGiven={feedbackGiven}
            openFeedbackModal={(positive, selectedIndex) => {
              if (feedbackGiven !== null && feedbackGiven !== undefined) {
                props.submitFeedback({ remove: true, index: props.index });
                setHelpful(null);
                setFeedbackGiven(null);
              } else {
                setHelpful(positive);
                if (
                  !positive &&
                  selectedIndex === negativeFeedbackOptions.length - 1
                ) {
                  onFeedbackOpen();
                  setSelectedNegFeedbackIndex(
                    negativeFeedbackOptions.length - 1
                  );
                } else {
                  submit(positive, selectedIndex);
                }
              }
            }}
            submit
            threadID={props.threadID}
            time={props.time}
            asBookmark={props.asBookmark}
            bookmarked={props.bookmarked}
            bookmarkMessage={props.bookmarkMessage}
          />
        )}
      </MessageContainer>
    </>
  );
}
