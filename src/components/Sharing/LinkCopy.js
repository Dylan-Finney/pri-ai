import { Button, Flex, Input } from "@chakra-ui/react";

const LinkCopy = ({ link }) => {
  return (
    <Flex
      border={"1px solid #CBD5E0"}
      padding={"10px"}
      borderRadius={"0.375rem"}
      marginTop={"30px"}
    >
      <Input variant="unstyled" value={link} textOverflow={"ellipsis"} />
      <Button
        onClick={() => {
          navigator.clipboard.writeText(link);
        }}
      >
        Copy
      </Button>
    </Flex>
  );
};

export default LinkCopy;
