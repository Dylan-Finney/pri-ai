import { Button } from "@chakra-ui/react";

const FeedbackButton = ({
  icon,
  meaning,
  feedbackGiven = undefined,
  onClick,
  loading = false,
}) => {
  // console.log({ meaning, feedbackGiven });
  return (
    <Button
      // visibility={
      //   feedbackGiven !== undefined
      //     ? feedbackGiven === !meaning
      //       ? "hidden"
      //       : "unset"
      //     : "unset"
      // }
      // isDisabled={
      //   feedbackGiven !== undefined ? feedbackGiven === meaning : false
      // }
      onClick={onClick}
      variant="ghost"
      height={"fit-content"}
      width={"fit-content"}
      paddingLeft={"5px"}
      marginTop={"auto"}
      marginBottom={"auto"}
      paddingRight={"5px"}
      isDisabled={loading}
      minWidth={"0vw"}
    >
      {icon}
    </Button>
  );
};

export default FeedbackButton;
