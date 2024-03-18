const { Button, Box } = require("@chakra-ui/react");
const { GoMute, GoUnmute } = require("react-icons/go");

const MuteButton = ({ mute = true, setMute }) => {
  return (
    <Button
      // marginRight={"1rem"}
      // size="sm"
      backgroundColor={"#107569"}
      color={"#107569"}
      borderRadius={"50%"}
      width={"50px"}
      height={"50px"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"block"}
      marginBottom={"5vh"}
      onClick={() => {
        setMute(!mute);
      }}
    >
      {mute ? (
        <>
          <Box>
            <GoMute color="white" size={16} />
          </Box>
        </>
      ) : (
        <>
          <Box>
            <GoUnmute color="white" size={16} />
          </Box>
        </>
      )}
    </Button>
  );
};

export default MuteButton;
