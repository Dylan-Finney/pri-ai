import { Button } from "@chakra-ui/react";

const FeedbackButton = ({ icon, postive, feedbackGiven, onClick }) => {
  return (
    <Button
      visibility={feedbackGiven === !postive ? "hidden" : "unset"}
      isDisabled={feedbackGiven === postive}
      onClick={onClick}
      variant="ghost"
      height={"fit-content"}
      width={"fit-content"}
      paddingLeft={"5px"}
      marginTop={"auto"}
      marginBottom={"auto"}
      paddingRight={"5px"}
      minWidth={"0vw"}
    >
      {icon}
    </Button>
  );
};

export default FeedbackButton;
