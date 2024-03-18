import { agentsDemo2, agentsProd2 } from "@/utils/agents";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  chakra,
  useSlider,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext, ConvoContext, DataContext, UIContext } from "./App";
import Image from "next/image";
import axios from "axios";
import { useFileUpload } from "@/utils/useFileUpload";
import AgentImage from "./AgentImage";
import AgentEditIcon from "@/assets/AgentEditIcon";
import { baseBookmarkThreadObj } from "@/utils/constants";
import sections from "@/utils/sections";

const AgentDetailsSection = ({ title, text }) => {
  return (
    <>
      <Text fontWeight={600} color={"#101828"} textAlign={"left"}>
        {title}
      </Text>
      <Text color={"#64748b"} textAlign={"left"}>
        {text}
      </Text>
    </>
  );
};

export const AgentDetails = () => {
  const { setAgentKnowledgeUpload, bookmarkedThread } =
    useContext(ConvoContext);
  const { loggedIn } = useContext(AuthContext);
  const { isLargerThanMD, expandedAgent, expandSideTab, setSection } =
    useContext(UIContext);

  const addKnowledge = (id) => {
    setAgentKnowledgeUpload(id);
    setSection(sections.UPLOAD);
  };
  const speaker = expandedAgent;
  const expanded = expandSideTab;
  const demo =
    bookmarkedThread === baseBookmarkThreadObj ? true : bookmarkedThread.demo;
  const {
    agents: baseAgents,
    setAgents,
    buddies,
    setBuddies,
  } = useContext(DataContext);
  const agentsToSearch = demo ? agentsDemo2 : buddies;
  // const setAgentsToSearch = demo ? agentsDemo2 : buddies;
  var indexInAgents = agentsToSearch.findIndex(
    (agent) => agent.call === speaker
  );
  if (indexInAgents === -1) {
    indexInAgents = 0;
  }
  const agent = agentsToSearch[indexInAgents];
  const [imageError, setImageError] = useState(false);
  const [files, setSelectedFiles] = useFileUpload();
  const {
    state,
    actions,
    getInnerTrackProps,
    getInputProps,
    getMarkerProps,
    getRootProps,
    getThumbProps,
    getTrackProps,
  } = useSlider({ min: 0, max: 100, value: 0 });
  return (
    <Flex
      height={"100%"}
      flexDirection={"column"}
      // alignItems={"center"}
      overflowY={"scroll"}
      padding={"50px"}
      textAlign={"center"}
    >
      {loggedIn && !demo && (
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Box}
                visibility={loggedIn && !demo ? "visible" : "hidden"}
                position={"relative"}
                top={"-4%"}
                left={"100%"}
                width={"25px"}
                height={"25px"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                cursor={"pointer"}
                // backgroundColor={"green"}
              >
                <AgentEditIcon />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={async () => {
                    const newTitle = window.prompt(
                      `What do you want to rename "${agent.name}" to`,
                      agent.name
                    );
                    if (agent.name !== newTitle) {
                      // setTitleButtonLoading(true);
                      await axios({
                        method: "POST",
                        url: "/api/changeAgentDetails",
                        data: {
                          agentID: agent.id,
                          name: newTitle,
                        },
                      });
                      const agentsCopy = [...buddies];
                      agentsCopy[indexInAgents] = {
                        ...agent,
                        name: newTitle,
                      };
                      setBuddies(agentsCopy);
                      // changeDetails({ newTitle, newURL: url });
                      // setTitleButtonLoading(false);
                    }
                  }}
                >
                  Change Name
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedFiles(
                      { multiple: false, accept: [".png", ".jpeg", ".jpg"] },
                      (files) => {
                        // setImageButtonLoading(true);
                        files.map(async ({ source, name, size, file }) => {
                          // console.log({ source, name, size, file });

                          const reader = new FileReader();
                          reader.readAsDataURL(file);

                          reader.onload = async () => {
                            try {
                              const splitName = name.split(".");
                              const response = await axios({
                                method: "POST",
                                url: "/api/changeAgentDetails",
                                data: {
                                  agentID: agent.id,
                                  imageEncoded: reader.result,
                                  type: splitName[splitName.length - 1],
                                  contentType: file.type,
                                },
                              });
                              const agentsCopy = [...buddies];
                              agentsCopy[indexInAgents] = {
                                ...agent,
                                image: {
                                  ...agent.image,
                                  urlFull: response.data.signedUrl,
                                },
                              };
                              setBuddies(buddies);
                              // setImageButtonLoading(false);
                            } catch (error) {
                              console.error("Error uploading file:", error);
                            }
                          };
                          reader.onerror = (error) => {
                            console.error("Error reading file:", error);
                          };
                        });
                      }
                    );
                  }}
                >
                  Change Image
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      )}

      {expanded && isLargerThanMD ? (
        <Flex
          flex={1}
          width={"100%"}
          flexDirection={"row"}
          alignItems={"unset"}
        >
          <Flex flex={1} flexDirection={"column"} alignItems={"center"}>
            <AgentImage
              show={agent.image.urlFull && !imageError}
              icon={agent.image.chatIcon}
              name={agent.name}
              url={agent.image.urlFull}
              defaultImage={agent.image.defaultFull}
              onError={() => {
                setImageError(true);
              }}
            />
            <Text
              color={"#101828"}
              fontWeight={600}
              fontSize={"14px"}
              textAlign={"center"}
            >
              <span
                style={{
                  // marginLeft: "auto",
                  color: "#107569",
                  fontWeight: 500,
                  fontSize: "12px",
                  backgroundColor: "#F0FDF9",
                  padding: "2px 8px",
                  borderRadius: "16px",
                }}
              >
                @{agent.call}
              </span>
            </Text>
            <Text fontWeight={600}>
              {agent.name} | {agent.company}
            </Text>
            <Text>{agent.description}</Text>
            {agent.uploadable === true && loggedIn && (
              <Button
                padding={"10px"}
                color={"white"}
                marginTop={"10px"}
                backgroundColor={"#0e9384"}
                onClick={() => {
                  addKnowledge(agent.id);
                }}
              >
                Add Knowledge
              </Button>
            )}
          </Flex>
          <Flex flex={1} flexDirection={"column"}>
            <AgentDetailsSection
              title={"Role Description"}
              text={agent.info?.description}
            />
            <AgentDetailsSection
              title={"Personality"}
              text={agent.info?.personality}
            />
            <AgentDetailsSection
              title={"What you shared about you"}
              text={agent.info?.shared}
            />
            <AgentDetailsSection
              title={"Knowledge"}
              text={agent.info?.knowledge}
            />
          </Flex>
        </Flex>
      ) : (
        <>
          <Box alignSelf={"center"}>
            <AgentImage
              show={agent.image.urlFull && !imageError}
              icon={agent.image.chatIcon}
              name={agent.name}
              url={agent.image.urlFull}
              defaultImage={agent.image.defaultFull}
              onError={() => {
                setImageError(true);
              }}
            />
          </Box>
          <Text
            color={"#101828"}
            fontWeight={600}
            fontSize={"14px"}
            textAlign={"center"}
          >
            <span
              style={{
                // marginLeft: "auto",
                color: "#107569",
                fontWeight: 500,
                fontSize: "12px",
                backgroundColor: "#F0FDF9",
                padding: "2px 8px",
                borderRadius: "16px",
              }}
            >
              @{agent.call}
            </span>
          </Text>
          <Text fontWeight={600}>
            {agent.name} | {agent.company}
          </Text>
          <Text>{agent.description}</Text>
          {agent.uploadable === true && (
            <Button
              padding={"10px"}
              color={"white"}
              marginTop={"10px"}
              marginBottom={"10px"}
              alignSelf={"center"}
              width={"fit-content"}
              backgroundColor={"#0e9384"}
              onClick={() => {
                addKnowledge(agent.id);
              }}
            >
              Add Knowledge
            </Button>
          )}
          <Flex flexDir={"column"} gap={"10px"}>
            <AgentDetailsSection
              title={"Role Description"}
              text={agent.info?.description}
            />
            <AgentDetailsSection
              title={"Personality"}
              text={agent.info?.personality}
            />
            <AgentDetailsSection
              title={"What you shared about you"}
              text={agent.info?.shared}
            />
            <AgentDetailsSection
              title={"Knowledge"}
              text={agent.info?.knowledge}
            />
          </Flex>
        </>
      )}
      <Text
        fontWeight={600}
        marginTop={"10px"}
        alignSelf={"flex-start"}
        textAlign={"start"}
      >
        Advanced
      </Text>
      {agent.uploadable && (
        <>
          <chakra.div
            mt={2}
            // cursor="pointer"
            w={{ base: "96%", lg: "98%" }}
            ml={{ base: "2%", lg: "1%" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} hidden />
            <Box
              h="7px"
              bgColor="#94c0bc"
              borderRadius="full"
              {...getTrackProps()}
            >
              <Box
                h="7px"
                bgColor="teal.500"
                borderRadius="full"
                {...getInnerTrackProps()}
              />
            </Box>
          </chakra.div>
          <Text textAlign={"start"}>0 GB out of 15 GB used</Text>
        </>
      )}
    </Flex>
  );
};
