import { agentsDemo2 } from "@/utils/agents";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "./App";
import AgentImage from "./AgentImage";

const { SimpleGrid, Box, Text, Flex } = require("@chakra-ui/react");

const ExamplePrompt = ({
  mainText,
  subText,
  agent,
  prompt,
  onClick,
  index,
  agentObj,
}) => {
  console.log({ agentObj });
  return (
    <Flex
      height="85px"
      padding={"10px"}
      border={"1px solid #d0d5dd"}
      borderRadius={"10px"}
      cursor={"pointer"}
      onClick={onClick}
      display={{ base: index > 1 ? "flex" : "none", md: "flex" }}
      flexDirection={"row"}
    >
      <Box>
        <Text fontWeight={600} color={"#344054"}>
          {mainText}
        </Text>
        <Text color={"#737882"}>{subText}</Text>
        <Text>{agent}</Text>
      </Box>
      <Flex
        flex={1}
        flexDirection={"column"}
        alignItems={"flex-end"}
        justifyContent={"center"}
      >
        <AgentImage
          show={agentObj.image.urlFull}
          icon={agentObj.image.chatIcon}
          name={agentObj.name}
          url={agentObj.image.urlFull}
          size={1}
          defaultImage={agentObj.image.defaultFull}
        />
      </Flex>
    </Flex>
  );
};

const ExamplePrompts = ({ demoMode = true, sendPrompt }) => {
  // <Text>What is Prifina?</Text>
  //                                         <Text>How can I use Pri-AI?</Text>
  //                                         <Text>What is my name?</Text>
  //                                         <Text>What is my address?</Text>
  const exampleProdPrompts = [
    {
      prompt: "@helper What is Prifina? What apps/services do they offer?",
      mainText: "What is Prifina? ",
      subText: "What apps/services do they offer?",
      agent: "@helper",
    },
    {
      prompt: "@mybuddy What is my name?",
      mainText: "What is my name?",
      subText: " ",
      agent: "@mybuddy",
    },
    {
      prompt: "@helper How can I use Pri-AI? What data should I upload?",
      mainText: "How can I use Pri-AI?",
      subText: "What data should I upload?",
      agent: "@helper",
    },
    {
      prompt: "@mybuddy What is my address?",
      mainText: "What is my address?",
      subText: " ",
      agent: "@mybuddy",
    },
  ];
  const exampleDemoPrompts = [
    {
      prompt: "@nutritionist Create a better meal plan to improve my health?",
      mainText: "Create a better meal plan",
      subText: "To improve my health",
      agent: "@nutritionist",
    },
    {
      prompt: "@sleepcoach How do I improve my sleep to improve my health?",
      mainText: "How do I improve my sleep",
      subText: "To improve my health",
      agent: "@sleepcoach",
    },
    {
      prompt: "@trainer Show me my workout data for the past week as a table",
      mainText: "Show me my workout data",
      subText: "for the past week",
      agent: "@trainer",
    },
    {
      prompt:
        "@basketballcoach How do I improve my Jump Shot from its current performance?",
      mainText: "How do I improve my Jump Shot",
      subText: "from its current performance",
      agent: "@basketballcoach",
    },
  ];

  const selectedExamplePrompts = demoMode
    ? exampleDemoPrompts
    : exampleProdPrompts;

  const { buddies } = useContext(DataContext);
  const agents = demoMode ? agentsDemo2 : buddies;

  console.log({ agents });
  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
      }}
      spacingX="40px"
      spacingY="20px"
      width={"100%"}
      padding={"20px"}
    >
      {selectedExamplePrompts.map((currentExamplePrompt, index) => {
        const agent = agents.find(
          (agent) => agent.call === currentExamplePrompt.agent.substring(1)
        );
        return (
          <ExamplePrompt
            key={index}
            mainText={currentExamplePrompt.mainText}
            subText={currentExamplePrompt.subText}
            agent={currentExamplePrompt.agent}
            agentObj={agent !== undefined ? agent : agents[0]}
            onClick={async () => {
              await sendPrompt(currentExamplePrompt.prompt);
            }}
            index={index}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default ExamplePrompts;
