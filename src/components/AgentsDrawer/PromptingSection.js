import { Text } from "@chakra-ui/react";
import ExampleBlock from "./ExampleBlock";
const PromptingSection = ({ showTry = true, tryText, mainText }) => {
  return (
    <>
      <Text color={"#101828"} fontWeight={500}>
        {mainText}
      </Text>
      <ExampleBlock tryText={tryText} showTry={showTry} />
    </>
  );
};
export default PromptingSection;
