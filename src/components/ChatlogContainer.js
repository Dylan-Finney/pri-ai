import { Box } from "@chakra-ui/react";
import { UIContext } from "./App";
import { useContext } from "react";

export function ChatlogContainer(props) {
  const { onboarding, children } = props;
  const { isLargerThanMD } = useContext(UIContext);
  return (
    <Box
      id="chatlog"
      flexGrow={1}
      width={"100%"}
      justifyContent={onboarding ? "center" : null}
      alignItems={onboarding ? "center" : null}
      textAlign={onboarding ? "center" : null}
      maxHeight={"86vh"}
      style={{
        backgroundColor: onboarding ? "#F6FEFC" : "#fcfcfd",
        whiteSpace: "pre-wrap",
        "overflow-y": "scroll",
        "scroll-behavior": "smooth",
        "border-left": "1px solid #eaecf0",
        "border-top": "1px solid #eaecf0",
        display: "flex",
        flexDirection: "column",
        maxHeight: isLargerThanMD
          ? "calc(100vh - 125px)"
          : "calc(100vh - 175px)",
      }}
    >
      {children}
    </Box>
  );
}
