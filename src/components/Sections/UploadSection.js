import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../App";
import { useDropzone } from "react-dropzone";
import { handleIndex } from "@/utils/pri-ai/handleIndex";
import { useListDocFiles } from "@/utils/dynamoDB";
import { languageOptions, metaTagOptions, planOptions } from "@/utils/options";
import UploadIcon from "../UploadIcon";
import { SearchIcon } from "@chakra-ui/icons";
import useUploadFile from "@/utils/s3";
import { FiRefreshCcw } from "react-icons/fi";
// import { languageOptions, metaTagOptions, planOptions } from "@/options";

const TabTitle = ({ active = false, changeSection, sectionTab }) => {
  return (
    <Box
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

export const UploadSection = ({ userID = "", defaultAgent = 1 }) => {
  const { buddies } = useContext(DataContext);
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

  return (
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
        <>
          {" "}
          <Text>Files</Text>
          <div
            style={{
              backgroundColor: "#f0fdfc",
              textAlign: "center",
              height: "20vh",
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
                <UploadIcon sidebar={false} />
                <Text>
                  Drag and drop your files here or
                  <Text></Text>
                  click to browse
                </Text>
              </>
            )}
          </div>
          <Flex height={"200px"} overflow={"scroll"} flexDirection={"column"}>
            <TableContainer>
              <Table variant={"simple"}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>File Type</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {files.map((file, index) => {
                    return (
                      <Tr>
                        <Td>{file.name}</Td>
                        <Td>{file.name.split(".").pop()}</Td>
                        <Td
                          onClick={() => {
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                        >
                          Delete
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
          <Text>Text / URL</Text>
          <Input
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
            }}
            disabled={files.length > 0}
            placeholder="Title description"
          />
          <Select
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
              .map((agent) => {
                return (
                  <option value={agent.id}>
                    {agent.name} - @{agent.call}
                  </option>
                );
              })}
          </Select>
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
        </>
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
                <Tr>
                  <Th>Name</Th>
                  <Th>File Type</Th>
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
                  .map((tableRecord) => {
                    return (
                      <Tr>
                        <Td>{tableRecord.cols[0]}</Td>
                        <Td>{tableRecord.cols[1].split(".").pop()}</Td>
                        <Td>{new Date(tableRecord.cols[2]).toDateString()}</Td>
                        <Td>{tableRecord.meta.totalTokens}</Td>
                        <Td cursor={"not-allowed"}>Delete</Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </Flex>
  );
};
