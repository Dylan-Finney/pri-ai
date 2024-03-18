import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ConvoContext, DataContext } from "../App";
import { useDropzone } from "react-dropzone";
import { handleIndex } from "@/utils/pri-ai/handleIndex";
import { useListDocFiles } from "@/utils/dynamoDB";
import { languageOptions, metaTagOptions, planOptions } from "@/utils/options";
import UploadIcon from "../UploadIcon";
import { SearchIcon } from "@chakra-ui/icons";
import useUploadFile from "@/utils/s3";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import { BiSolidFileTxt } from "react-icons/bi";
import AgentImage from "../AgentImage";
import { RiDeleteBin6Line } from "react-icons/ri";
import Header from "../Header";
// import { languageOptions, metaTagOptions, planOptions } from "@/options";

const TabTitle = ({ active = false, changeSection, sectionTab }) => {
  return (
    <Box
      cursor={"pointer"}
      padding={"10px"}
      paddingLeft={"20px"}
      paddingRight={"20px"}
      borderRadius={"5px"}
      onClick={changeSection}
      backgroundColor={active ? "#1e1e23" : "transparent"}
    >
      <Text color={active ? "white" : "#8d9096"}>{sectionTab}</Text>
    </Box>
  );
};

export const UploadSection = ({}) => {
  const { userID } = useContext(AuthContext);
  const { agentKnowledgeUpload } = useContext(ConvoContext);
  const defaultAgent = agentKnowledgeUpload ? agentKnowledgeUpload : 1;
  const { buddies } = useContext(DataContext);
  // console.log({ buddies });
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      console.log({ acceptedFiles });
      const newArray = acceptedFiles.map((file) => {
        return {
          file: file,
          name: file.name,
          size: file.size,
          source: URL.createObjectURL(file),
        };
      });
      setFiles([...files, ...newArray]);
      console.log([...files, ...newArray]);
    },
    [files]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
    },
    onDrop,
  });

  const { isLoading, docs, setDocPrefix, getFiles } = useListDocFiles(
    "user_index_" + userID
  );

  const [canUpload, setCanUpload] = useState(true);
  const [index, setIndex] = useState("");
  const [language, setLanguage] = useState("en");

  const selectedPlans = useRef([]);
  const selectedMetaTags = useRef([]);
  const selectedTranslations = useRef([]);
  const selectedRow = useRef(-1);
  const selectedModal = useRef("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!isLoading && userID !== "") {
      const newTableData = docs.map((doc) => {
        if (doc.metadata?.plans !== undefined) {
          selectedPlans.current.push(
            doc.metadata.plans.map(
              (p) => planOptions.find((k) => k.key === p)?.key
            )
          );
        } else {
          selectedPlans.current.push([]);
        }
        if (doc.metadata?.metatags !== undefined) {
          selectedMetaTags.current.push(
            doc.metadata.metatags.map(
              (p) => metaTagOptions.find((k) => k.key === p)?.key
            )
          );
        } else {
          selectedMetaTags.current.push([]);
        }
        if (doc.metadata?.translations !== undefined) {
          selectedTranslations.current.push(
            doc.metadata.translations.map(
              (p) => languageOptions.find((k) => k.key === p)?.key
            )
          );
        } else {
          selectedTranslations.current.push([
            languageOptions.find((k) => k.key === doc.metadata.language)?.key,
          ]);
        }
        return {
          key: doc.key,
          meta: doc.metadata,
          cols: [
            doc.source,
            doc.id,
            new Date(doc.createdAt).toISOString(),
            JSON.stringify(doc.metadata, true, 1),
          ],
        };
      });
      console.log({ newTableData });
      setTableData(newTableData);
    }
  }, [isLoading, userID, docs]);

  const screens = {
    UPLOAD: 0,
    LIST: 1,
  };
  const [screen, setScreen] = useState(screens.UPLOAD);
  const [filteredName, setFilteredName] = useState("");
  const { isLoading: isUploading, addFiles } = useUploadFile([]);
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const targetLanguage = useRef([]);
  const metaTagInput = useRef([]);
  const subscriptionPlans = useRef([]);
  const handleSave = async () => {
    // Handle saving data and uploading files here
    //console.log("TARGET LANGUAGE ", targetLanguage.current.value);
    console.log("META TAGS ", metaTagInput.current);
    console.log("Saving ", files);

    //console.log("SAVE ", { id, source, content, files, language, plans: [...new Set(subscriptionPlans.current)], targetLanguage: [...new Set(targetLanguage.current)], metaTags: [...new Set(metaTagInput.current)] });

    if (files && files.length > 0) {
      // Upload files
      // Your file upload logic here
      addFiles({
        id: index,
        source,
        content,
        files,
        language,
        plans: [...new Set(subscriptionPlans.current)],
        targetLanguage: [...new Set(targetLanguage.current)],
        metaTags: [...new Set(metaTagInput.current)],
      });
    } else {
      addFiles({
        id: index,
        source,
        content,
        language,
        plans: [...new Set(subscriptionPlans.current)],
        targetLanguage: [...new Set(targetLanguage.current)],
        metaTags: [...new Set(metaTagInput.current)],
      });
    }
    setSource("");
    setContent("");
    setFiles([]);
    await new Promise((r) => setTimeout(r, 15000));
    getFiles();
    // onClose();
  };

  const [selectedAgentIndexInList, setSelectedAgentIndexInList] = useState(-1);

  return (
    <>
      <div
        style={{
          flexDirection: "column",
          minWidth: "80.5%",
          width: "100%",
          display: "flex",
        }}
      >
        <Header />
        <Flex
          flex={1}
          padding={"20px"}
          overflowY={"scroll"}
          flexDirection={"column"}
          width={"100%"}
        >
          <Flex flexDirection={"row"} gap={"25px"}>
            <TabTitle
              active={screen === screens.UPLOAD}
              changeSection={() => {
                setScreen(screens.UPLOAD);
              }}
              sectionTab={"Uploads"}
            />
            <TabTitle
              active={screen === screens.LIST}
              changeSection={() => {
                setScreen(screens.LIST);
              }}
              sectionTab={"Content"}
            />
          </Flex>

          {screen === screens.UPLOAD && (
            <Flex flexDirection={"column"}>
              {" "}
              <Text>Choose a buddy to upload Data</Text>
              <SimpleGrid
                maxHeight={"300px"}
                overflowY={"scroll"}
                minChildWidth={"400px"}
                spacing={"20px"}
              >
                {buddies
                  .filter((agent) => agent.uploadable === true)
                  .map((agent, i) => {
                    return (
                      <Flex
                        key={i}
                        // maxWidth={"700px"}
                        onClick={() => {
                          if (selectedAgentIndexInList === i) {
                            setSelectedAgentIndexInList(-1);
                            setIndex("");
                          } else {
                            setSelectedAgentIndexInList(i);
                            setIndex(handleIndex(agent.index, userID));
                          }
                        }}
                        backgroundColor={"#f9fafb"}
                        padding={"20px"}
                        flex={1}
                        width={"100%"}
                        flexDirection={{ base: "column", md: "row" }}
                        alignItems={"center"}
                        border={
                          selectedAgentIndexInList === i
                            ? "2px solid #0085ff"
                            : "2px solid transparent"
                        }
                      >
                        <Flex
                          flex={1}
                          flexDirection={"column"}
                          alignItems={"center"}
                        >
                          <AgentImage
                            show={agent.image.urlFull}
                            icon={agent.image.chatIcon}
                            name={agent.name}
                            url={agent.image.urlFull}
                            defaultImage={agent.image.defaultFull}
                          />
                        </Flex>
                        <Flex flex={1} flexDirection={"column"}>
                          {" "}
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
                          <Box
                            textAlign={"center"}
                            fontWeight={600}
                            flexDirection={"row"}
                            display={"flex"}
                            alignSelf={"center"}
                            width={"250px"}
                            justifyContent={"center"}
                          >
                            <Text
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                              whiteSpace={"nowrap"}
                              maxWidth={"76%"}
                            >
                              {agent.name}
                            </Text>
                            <Text maxWidth={"fit-content"}>
                              | {agent.company}
                            </Text>
                          </Box>
                        </Flex>
                      </Flex>
                    );
                  })}
              </SimpleGrid>
              <Text>Files</Text>
              <div
                style={{
                  backgroundColor: "#f0fdfc",
                  textAlign: "center",
                  height: "20vh",
                  overflowY: "scroll",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: "1px dashed #00847a",
                }}
                {...getRootProps({ className: "dropzone" })}
              >
                <input {...getInputProps()} />

                {isDragActive ? (
                  <Text>Drop the files here ...</Text>
                ) : (
                  <>
                    {files.length === 0 ? (
                      <>
                        <UploadIcon sidebar={false} />
                        <Text>
                          Drag and drop your files here or click to browse
                        </Text>
                      </>
                    ) : (
                      <Wrap justify="center" padding={"20px"} mt={"10px"}>
                        {files.map((file, fileIndex) => {
                          return (
                            <WrapItem
                              key={fileIndex}
                              backgroundColor={"white"}
                              padding={"10px"}
                              alignItems={"center"}
                            >
                              {file.name.split(".").pop() === "txt" && (
                                <BiSolidFileTxt size={"25px"} />
                              )}
                              <Text>{file.name}</Text>
                              <FiX
                                cursor={"pointer"}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setFiles(
                                    files.filter((_, i) => i !== fileIndex)
                                  );
                                }}
                              />
                              {/* <Flex
                            backgroundColor={"white"}
                            flexDir={"row"}
                            alignItems={"center"}
                            padding={"10px"}
                          >
                            {file.name.split(".").pop() === "txt" && (
                              <BiSolidFileTxt size={"25px"} />
                            )}
                            <Text color={"#344054"} fontWeight={600}>
                              {file.name}
                            </Text>
                            <FiX
                              cursor={"pointer"}
                              onClick={(event) => {
                                event.stopPropagation();
                                setFiles(
                                  files.filter((_, i) => i !== fileIndex)
                                );
                              }}
                            />
                          </Flex> */}
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    )}
                  </>
                )}
              </div>
              <Text>Text / URL</Text>
              <Input
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                }}
                disabled={files.length > 0}
                placeholder="Title description"
              />
              {/* <Select
            defaultValue={defaultAgent}
            disabled={defaultAgent !== ""}
            onChange={(e) => {
              console.log("SELECT", e.target.value);
              const agent = buddies.find(
                (agent) => agent.id === parseInt(e.target.value)
              );
              console.log("SELECT", agent);
              if (e.target.value !== "") {
                console.log(agent);
                setIndex(handleIndex(agent.index, userID));
              } else {
                setIndex("");
              }
            }}
            placeholder="Select option"
          >
            {buddies
              .filter((agent) => agent.uploadable === true)
              .map((agent, i) => {
                return (
                  <option key={i} value={agent.id}>
                    {agent.name} - @{agent.call}
                  </option>
                );
              })}
          </Select> */}
              <Textarea
                height={"200px"}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                disabled={files.length > 0}
                placeholder="Type any text or paste URL"
              />
              <Button
                isLoading={isUploading}
                isDisabled={
                  index === "" ||
                  (files.length === 0 && (source === "" || content === ""))
                }
                onClick={handleSave}
              >
                Upload
              </Button>
            </Flex>
          )}
          {screen === screens.LIST && (
            <>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  value={filteredName}
                  placeholder="Search"
                  onChange={(e) => {
                    setFilteredName(e.target.value);
                  }}
                />
              </InputGroup>
              {/* <Box
            onClick={() => {
              getFiles();
            }}
          >
            <FiRefreshCcw />
          </Box> */}

              <TableContainer>
                <Table variant={"simple"}>
                  <Thead>
                    <Tr backgroundColor={"#eef1f5"}>
                      <Th>Topic</Th>
                      <Th>Description</Th>
                      <Th>Name</Th>
                      {/* <Th>File Type</Th> */}
                      <Th>AI Buddy</Th>
                      <Th>Category</Th>
                      <Th>Date</Th>
                      <Th>Token Size</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tableData
                      .filter((tableRecord) =>
                        tableRecord.cols[0]
                          .toLowerCase()
                          .includes(filteredName.toLowerCase())
                      )
                      .map((tableRecord, i) => {
                        return (
                          <Tr key={i}>
                            <Td>-</Td>
                            <Td>-</Td>

                            <Td
                              flexDirection={"row"}
                              display={"flex"}
                              alignItems={"center"}
                            >
                              {tableRecord.cols[1].split(".").pop() ===
                                "txt" && <BiSolidFileTxt />}
                              {tableRecord.cols[0] !== ""
                                ? tableRecord.cols[0]
                                : tableRecord.cols[1].split(".")[0]}
                            </Td>
                            {/* <Td>{tableRecord.cols[1].split(".").pop()}</Td> */}
                            <Td>
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
                                @mybuddy
                              </span>
                            </Td>
                            <Td>-</Td>

                            <Td>
                              {new Date(tableRecord.cols[2]).toDateString()}
                            </Td>
                            <Td>{tableRecord.meta.totalTokens}</Td>
                            <Td color={"red"} cursor={"not-allowed"}>
                              <RiDeleteBin6Line />
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          )}
        </Flex>
      </div>
    </>
  );
};
