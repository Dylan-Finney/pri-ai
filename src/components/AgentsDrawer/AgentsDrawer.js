import { agentsDemo2, agentsProd2 } from "@/utils/agents";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
// import { A } from "@upstash/redis/zmscore-a4ec4c2a";
import { useEffect, useState } from "react";
import AgentsCard from "./AgentsCard";
import ExampleBlock from "./ExampleBlock";
import PromptingSection from "./PromptingSection";

const AgentsDrawer = ({
  onClose,
  isOpen,
  demoMode = true,
  scrollToAgent = undefined,
  onLoginModal,
  openUploadModal,
}) => {
  const tabs = {
    AGENTS: 0,
    PROMPTS: 1,
  };

  const [agents, setAgents] = useState(
    demoMode === true ? agentsDemo2 : agentsProd2
  );

  const [tab, setTab] = useState(tabs.AGENTS);

  useEffect(() => {
    const getDetails = async () => {
      if (demoMode === false) {
        const response = await axios({
          method: "POST",
          url: "/api/getPersonalAgentsDetails",
          data: {},
        });
        // console.log(response);
        console.log(response.data.agentDetails);
        var agentsCopy = [...agentsProd2];
        const agentIndexes = agentsCopy.map(function (x) {
          return x.id;
        });

        for (const agentDetail of response.data.agentDetails) {
          if (agentIndexes.indexOf(agentDetail.id) > -1) {
            agentsCopy[agentIndexes.indexOf(agentDetail.id)] = {
              ...agentsCopy[agentIndexes.indexOf(agentDetail.id)],
              name:
                agentDetail.name === undefined
                  ? agentsCopy[agentIndexes.indexOf(agentDetail.id)].name
                  : agentDetail.name,
              image: {
                ...agentIndexes[agentDetail.id].image,
                urlFull: agentDetail.image,
              },
            };
          }
        }
        setAgents(agentsCopy);

        console.log({ agentsCopy });
      } else {
        setAgents(agentsDemo2);
      }
    };
    getDetails();
  }, [demoMode]);

  // useEffect(()=>{

  // },[demoMode])

  return (
    <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent
        maxHeight={"90vh"}
        borderTopLeftRadius={"16px"}
        borderTopRightRadius={"16px"}
        padding={"20px"}
      >
        <DrawerCloseButton />
        <ButtonGroup
          width={"100%"}
          isAttached
          justifyContent={"center"}
          marginTop={"20px"}
          marginBottom={"20px"}
        >
          <Button
            width={"100%"}
            isActive={tab === tabs.AGENTS}
            onClick={() => {
              setTab(tabs.AGENTS);
            }}
          >
            Agents
          </Button>
          <Button
            width={"100%"}
            isActive={tab === tabs.PROMPTS}
            onClick={() => {
              setTab(tabs.PROMPTS);
            }}
          >
            Prompting
          </Button>
        </ButtonGroup>
        <Flex
          flexDir={"row"}
          gap={"16px"}
          alignItems={"center"}
          paddingBottom={"10px"}
        >
          <Text fontSize={"16px"} fontWeight={600}>
            {tab === tabs.AGENTS && `Specialist agents`}
            {tab === tabs.PROMPTS && `Live data prompting`}
          </Text>
          <Text
            paddingBottom={"10px"}
            alignItems={"center"}
            style={{
              color: "#107569",
              fontWeight: "bold",
              fontSize: "12px",
              backgroundColor: "#F0FDF9",
              padding: "2px 8px",
              borderRadius: "16px",
            }}
          >
            {tab === tabs.AGENTS && `@agent`}
            {tab === tabs.PROMPTS && `#source`}
          </Text>
        </Flex>
        <Text fontSize={"14px"} color={"#475467"}>
          {tab === tabs.AGENTS && `Use Pri-AI to talk to your connected data.`}
          {tab === tabs.PROMPTS && `Use Pri-AI to talk to your connected data.`}
        </Text>
        {tab === tabs.PROMPTS && (
          <>
            <Box
              minHeight={"1px"}
              width={"100%"}
              backgroundColor={"#EAECF0"}
              margin={"10px 0px"}
            ></Box>
            <Flex overflowY={"scroll"} flexDirection={"column"}>
              <Flex
                flexDirection={"column"}
                gap={"16px"}
                paddingBottom={"10px"}
              >
                <Text color={"#101828"} fontWeight={500}>
                  #+source name
                </Text>
                <Flex
                  flexDir={"column"}
                  gap={"10px"}
                  backgroundColor={"#F9FAFB"}
                  borderRadius={"8px"}
                  padding={"16px"}
                >
                  <Text color={"#101828"} fontWeight={600}>
                    Try this
                  </Text>
                  <Text color={"#475467"}>
                    “
                    <span
                      style={{
                        display: "inline-block",
                        mixBlendMode: "multiply",
                        backgroundColor: "#F2F4F7",
                        borderRadius: "16px",
                        padding: "2px 8px",
                        color: "#344054",
                        fontWeight: 500,
                      }}
                    >
                      #appleHealth
                    </span>{" "}
                    What is my average step count over the last two weeks?”
                  </Text>
                </Flex>
                <Text color={"#101828"} fontWeight={500}>
                  Ask Pri-AI what it can do with a source{" "}
                </Text>
                <Flex
                  flexDir={"column"}
                  gap={"10px"}
                  backgroundColor={"#F9FAFB"}
                  borderRadius={"8px"}
                  padding={"16px"}
                >
                  <Text color={"#101828"} fontWeight={600}>
                    Try this
                  </Text>
                  <Text color={"#475467"}>
                    “What can you do with{" "}
                    <span
                      style={{
                        display: "inline-block",
                        mixBlendMode: "multiply",
                        backgroundColor: "#F2F4F7",
                        borderRadius: "16px",
                        padding: "2px 8px",
                        color: "#344054",
                        fontWeight: 500,
                      }}
                    >
                      #appleHealth
                    </span>
                    ?”
                  </Text>
                </Flex>
                <Text color={"#101828"} fontWeight={500}>
                  Example sources{" "}
                </Text>
                <ExampleBlock
                  showTry={false}
                  tryText={
                    <>
                      <Text
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {[
                          "appleHealth",
                          "fitbit",
                          "oura",
                          "garmin",
                          "logmore",
                          "ichijiku",
                          "movesense",
                          "heierling",
                          "netflix",
                          "chasebank",
                          "myftinesspal",
                          "amazon",
                          "spotify",
                          "applemusic",
                        ].map((source, key) => {
                          return (
                            <span
                              key={key}
                              style={{
                                margin: "2px",
                                display: "inline-block",
                                mixBlendMode: "multiply",
                                backgroundColor: "#F2F4F7",
                                borderRadius: "16px",
                                padding: "2px 8px",
                                color: "#344054",
                                fontWeight: 500,
                              }}
                            >
                              #{source}
                            </span>
                          );
                        })}
                      </Text>
                      <Text
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {[
                          "fitness",
                          "nutrition",
                          "externalSensor",
                          "finance",
                        ].map((source, key) => {
                          return (
                            <span
                              key={key}
                              style={{
                                margin: "2px",
                                display: "inline-block",
                                mixBlendMode: "multiply",
                                backgroundColor: "#F2F4F7",
                                borderRadius: "16px",
                                padding: "2px 8px",
                                color: "#344054",
                                fontWeight: 500,
                              }}
                            >
                              #{source}
                            </span>
                          );
                        })}
                      </Text>
                    </>
                  }
                />
              </Flex>
              <Text fontSize={"16px"} fontWeight={600}>
                General prompting tips
              </Text>
              <Box
                minHeight={"1px"}
                width={"100%"}
                backgroundColor={"#EAECF0"}
                margin={"10px 0px"}
              ></Box>
              <Flex flexDirection={"column"} gap={"16px"}>
                <PromptingSection
                  mainText={"Ask Pri-AI what they can help you with"}
                  tryText={"“What can you help me with?”"}
                />
                <PromptingSection
                  mainText={"Ask Pri-AI to explain"}
                  tryText={
                    <>
                      <Text>“Explain your answer”</Text>
                      <Text>“Explain why the sky is blue”</Text>
                    </>
                  }
                />
                <PromptingSection
                  mainText={"Ask Pri-AI ot brainstorm ideas"}
                  tryText={
                    'Brainstorm 10 ideas for pet names. They all must start with "T"'
                  }
                />
              </Flex>
            </Flex>
          </>
        )}
        {tab === tabs.AGENTS && (
          <>
            <Box
              minHeight={"1px"}
              width={"100%"}
              backgroundColor={"#EAECF0"}
              margin={"10px 0px"}
            />
            <Flex flexDirection={"column"} overflowY={"scroll"} gap={"16px"}>
              <SimpleGrid
                // columns={[2, null, 3]}
                minChildWidth={{ sm: "100%", md: "240px" }}
                spacing={"12px"}
                flexDir={"row"}
              >
                {agents
                  .filter((agent) => agent.description !== "")
                  // .sort((a, b) => a.company - b.company)
                  .map((agent, i) => {
                    return (
                      <AgentsCard
                        onLoginModal={onLoginModal}
                        key={i}
                        scrollTo={i === scrollToAgent}
                        index={i}
                        agentID={agent.id}
                        call={agent.call}
                        description={agent.description}
                        title={agent.name}
                        url={agent.image.urlFull}
                        icon={agent.image.chatIcon}
                        uploadable={agent.uploadable}
                        openUploadModal={openUploadModal}
                        awsIndex={agent.index}
                        demoMode={demoMode}
                        changeDetails={({ newTitle, newURL }) => {
                          var agentsCopy = [...agents];
                          agentsCopy[i] = {
                            ...agentsCopy[i],
                            name: newTitle,
                            image: {
                              ...agentsCopy[i].image,
                              urlFull: newURL,
                            },
                          };
                          console.log({ agentsCopy });
                          setAgents(agentsCopy);
                        }}
                      />
                    );
                  })}
              </SimpleGrid>
            </Flex>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AgentsDrawer;
