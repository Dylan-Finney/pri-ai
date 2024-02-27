import {
  FiExternalLink,
  FiThumbsUp,
  FiThumbsDown,
  FiBookmark,
  FiMenu,
  FiMoreVertical,
} from "react-icons/fi";
import FeedbackButton from "./FeedbackButton";
import { Box, Text } from "@chakra-ui/react";
const FeedbackSection = ({ feedbackGiven, openFeedbackModal }) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      // backgroundColor={"#f9fafb"}
      marginTop={"1vh"}
      marginBottom={"1vh"}
      paddingTop={"1vh"}
      // paddingBottom={"1vh"}
      borderRadius={"0px 5px 5px 5px"}
      marginLeft={{ base: "32px", sm: "45px", lg: "47px" }}
      justifyContent={"flex-end"}
    >
      {/* <Text
        as={"i"}
        fontSize={"0.75rem"}
        color={"#465756"}
        paddingLeft={{ base: "2.5vw", sm: "5.5px", lg: "8.5px" }}
        marginRight={"auto"}
      >
        How was this response?
      </Text> */}
      <FeedbackButton
        postive={false}
        feedbackGiven={undefined}
        onClick={() => openFeedbackModal(false)}
        icon={<FiBookmark color={"#107569"} />}
      />

      <FeedbackButton
        icon={<FiThumbsUp color={"#107569"} />}
        postive={true}
        feedbackGiven={feedbackGiven}
        onClick={() => openFeedbackModal(true)}
      />
      <FeedbackButton
        icon={<FiThumbsDown color={"#107569"} />}
        postive={false}
        feedbackGiven={feedbackGiven}
        onClick={() => openFeedbackModal(false)}
      />
      <FeedbackButton
        postive={false}
        feedbackGiven={undefined}
        onClick={() => openFeedbackModal(false)}
        icon={<FiMoreVertical color={"#107569"} />}
      />
    </Box>
  );
};

export default FeedbackSection;
