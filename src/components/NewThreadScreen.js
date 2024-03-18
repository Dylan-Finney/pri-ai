const { EmptyThread } = require("@/assets/EmptyThread");
const { Flex, Text, Switch, Spacer } = require("@chakra-ui/react");
const { default: ExamplePrompts } = require("./ExamplePrompts");

const NewThreadScreen = ({
  sendPrompt,
  demoMode = true,
  loggedIn = false,
  inverseDemoMode,
  goToUpload,
}) => {
  return (
    <Flex
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Text textAlign={"center"} fontWeight={600}>
        Ask me anything
      </Text>
      <Text textAlign={"center"}>
        Pri-AI with your team of AI Buddies makes things a breeze!
      </Text>
      <EmptyThread />
      <Text
        textAlign={{ base: "center", md: "start" }}
        visibility={!demoMode ? "visible" : "hidden"}
      >
        Please Upload your Data for a personalized experience{" "}
        <span
          onClick={() => {
            goToUpload();
          }}
          style={{ cursor: "pointer", color: "#0075ff" }}
        >
          Upload Data
        </span>
      </Text>

      <ExamplePrompts demoMode={demoMode} sendPrompt={sendPrompt} />
      <Flex
        width={"100%"}
        paddingLeft={"20px"}
        paddingRight={"20px"}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text textAlign={"center"}>
          <span style={{ fontWeight: 600 }}>AI Buddies </span>
          is <span style={{ fontWeight: 600 }}>{demoMode ? "OFF" : "ON"} </span>
          for this thread
          <Switch
            isDisabled={!loggedIn}
            isChecked={!demoMode}
            onChange={() => {
              inverseDemoMode();
            }}
          />
        </Text>
        <Spacer />
        <Text
          textAlign={"center"}
          cursor={"pointer"}
          color={"#107569"}
          textDecoration={"underline"}
          onClick={() => {
            window
              .open("https://www.prifina.com/create-ai-buddy.html", "_blank")
              .focus();
          }}
        >
          What are AI buddies?
        </Text>
      </Flex>
    </Flex>
  );
};

export default NewThreadScreen;
