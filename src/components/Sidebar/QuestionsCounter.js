import { Box, Text, Progress } from "@chakra-ui/react";

const QuestionsCounter = ({ questionsUsed }) => {
  return (
    <Box
      style={{
        padding: "20px 16px",
        backgroundColor: "#F0FDF9",
        border: "1px solid #99F6E0",
        borderRadius: "8px",
        marginLeft: "10px",
        marginBottom: "2vh",
        marginTop: "1vh",
      }}
    >
      <Text fontWeight={"600"} color={"#107569"} as="b">
        {questionsUsed}/10 Questions used{" "}
      </Text>
      <Text
        fontWeight={"400"}
        color={"#134E48"}
        marginTop={"4px"}
        fontSize={"12px"}
      >
        For this demo session you are limited to 10 questions.{" "}
      </Text>
      <Progress
        value={10 * questionsUsed}
        height={"8px"}
        marginTop={"16px"}
        borderRadius={"4px"}
        variant={"prifina"}
      />
    </Box>
  );
};

export default QuestionsCounter;
