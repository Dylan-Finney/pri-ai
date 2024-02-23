import { Flex, Text } from "@chakra-ui/react";

const ExampleBlock = ({ showTry = true, tryText }) => {
  return (
    <Flex
      flexDir={"column"}
      gap={"10px"}
      backgroundColor={"#F9FAFB"}
      borderRadius={"8px"}
      padding={"16px"}
    >
      {showTry === true && (
        <Text color={"#101828"} fontWeight={600}>
          Try this
        </Text>
      )}

      <Text color={"#475467"}>
        <Flex flexDirection={"column"} gap={"10px"}>
          {tryText}
        </Flex>
      </Text>
    </Flex>
  );
};

export default ExampleBlock;
