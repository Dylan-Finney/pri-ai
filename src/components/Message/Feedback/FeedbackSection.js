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
import axios from "axios";
import { useEffect, useState } from "react";
const FeedbackSection = ({
  feedbackGiven,
  openFeedbackModal,
  threadID,
  time,
  asBookmark = false,
  bookmarked = false,
  bookmarkMessage,
}) => {
  const [bookmarkedVal, setBookmarkedVal] = useState(bookmarked);
  const [bookmarking, setBookmarking] = useState(false);
  useEffect(() => {
    setBookmarkedVal(bookmarked);
  }, [bookmarked]);
  // console.log({ feedbackGiven });

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
        // postive={false}
        feedbackGiven={undefined}
        loading={bookmarking}
        onClick={async () => {
          // if (!bookmarking) {
          setBookmarking(true);
          await axios({
            method: "POST",
            url: "/api/changeBookmark",
            data: {
              add: !bookmarkedVal,
              threadID,
              time,
            },
          });
          bookmarkMessage();
          setBookmarkedVal(!bookmarkedVal);
          setBookmarking(false);
          // }
        }}
        icon={
          <FiBookmark
            fill={bookmarkedVal ? "#107569" : "white"}
            color={"#107569"}
          />
        }
      />
      {!asBookmark && (
        <>
          <FeedbackButton
            icon={
              <FiThumbsUp
                color={"#107569"}
                fill={true === feedbackGiven ? "#107569" : "white"}
              />
            }
            meaning={true}
            feedbackGiven={feedbackGiven}
            onClick={() => openFeedbackModal(true)}
          />
          <FeedbackButton
            icon={
              <FiThumbsDown
                color={"#107569"}
                fill={false === feedbackGiven ? "#107569" : "white"}
              />
            }
            meaning={false}
            feedbackGiven={feedbackGiven}
            onClick={() => openFeedbackModal(false)}
          />
          <FeedbackButton
            // postive={false}
            feedbackGiven={undefined}
            onClick={() => {}}
            icon={<FiMoreVertical color={"#107569"} />}
          />
        </>
      )}
    </Box>
  );
};

export default FeedbackSection;
