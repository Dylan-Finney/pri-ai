import {
  FiExternalLink,
  FiThumbsUp,
  FiThumbsDown,
  FiBookmark,
  FiMenu,
  FiMoreVertical,
} from "react-icons/fi";
import FeedbackButton from "./FeedbackButton";
import { Box, Flex, SimpleGrid, Text, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
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
  const [feedbackVal, setFeedbackVal] = useState(feedbackGiven);
  const [changedToNegative, setChangedToNegative] = useState(false);
  const [selectedNegFeedbackIndex, setSelectedNegFeedbackIndex] = useState(-1);
  const [showThankYou, setShowThankYou] = useState(false);
  useEffect(() => {
    setBookmarkedVal(bookmarked);
  }, [bookmarked]);
  console.log({ feedbackGiven });

  useEffect(() => {
    console.log({ feedbackGiven, feedbackVal });
    if (feedbackGiven === false && feedbackVal !== feedbackGiven) {
      setShowThankYou(true);
      setTimeout(function () {
        setShowThankYou(false);
        setChangedToNegative(false);
      }, 3000);
    }
  }, [feedbackGiven]);

  // useEffect(() => {
  //   if (feedbackVal === false) {
  //     console.log("laugh", { feedbackVal });
  //   }
  // }, [feedbackVal]);

  // var selectedNegFeedbackIndex = -1;

  return (
    <>
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
              onClick={() => {
                // openFeedbackModal(false);
                if (feedbackGiven === false) {
                  openFeedbackModal(false);
                  setShowThankYou(false);
                  setChangedToNegative(false);
                  setSelectedNegFeedbackIndex(-1);
                } else {
                  setChangedToNegative(true);
                }
              }}
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
      {showThankYou ? (
        <>
          <Text
            textAlign={"center"}
            border={"1px solid #d2d2d2"}
            width={"fit-content"}
            marginLeft={"auto"}
            marginRight={"auto"}
            padding={"10px"}
            borderRadius={"5px"}
          >
            Thank You For Your Feedback!
          </Text>
        </>
      ) : (
        <>
          {changedToNegative === true && (
            <Box border={"1px solid #d2d2d2"} padding={"10px"}>
              <Flex>
                <Text>Tell us more </Text>
                <MdClose
                  style={{
                    marginLeft: "auto",
                  }}
                  onClick={() => {
                    setChangedToNegative(false);
                  }}
                  cursor={"pointer"}
                />
              </Flex>

              <Wrap width={"70%"}>
                {[
                  `Didn't like the style`,
                  "Not factually correct",
                  `Didn't follow instructions`,
                  "Too long",
                  `Too short`,
                  `Didn't like the answer`,
                  `More`,
                ].map((feedbackText, index) => {
                  return (
                    <WrapItem
                      backgroundColor={
                        selectedNegFeedbackIndex === index
                          ? "black"
                          : "transparent"
                      }
                      cursor={"pointer"}
                      border={"1px solid #d2d2d2"}
                      borderRadius={"20px"}
                      padding={"3px"}
                      paddingLeft={"10px"}
                      paddingRight={"10px"}
                      onClick={() => {
                        setSelectedNegFeedbackIndex(index);
                        // if (feedbackText === "More") {
                        openFeedbackModal(false, index);
                        // }
                      }}
                    >
                      <Text
                        width={"fit-content"}
                        alignSelf={"center"}
                        textAlign={"center"}
                        color={
                          selectedNegFeedbackIndex === index
                            ? "white"
                            : "#344054"
                        }
                      >
                        {feedbackText}
                      </Text>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default FeedbackSection;
