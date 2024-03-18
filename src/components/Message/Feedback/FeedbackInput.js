import {
  Box,
  Image,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  Input,
  Textarea,
  Spacer,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";
function FeedbackInput({ control, name, errors, helpful }) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { maxLength: { value: 2000, message: "Max length is 2000" } },
  });
  return (
    <>
      <Textarea
        cols={3}
        onChange={field.onChange} // send value to hook form
        onBlur={field.onBlur} // notify when input is touched/blur
        value={field.value} // input value
        name={field.name} // send down the input name
        inputRef={field.ref} // send input ref, so we can focus on input when error appear
        placeholder={"(optional) Please add specific details"}
      />
      <Flex flexDir={"row"}>
        <Text
          fontSize={"14px"}
          color={errors?.type === "maxLength" ? "#cc0000" : "#000000"}
          fontWeight={"500"}
        >
          {field.value ? field.value.length : "0"}/2000
        </Text>
        <Spacer />
        <Text
          color={"#cc0000"}
          fontSize={"14px"}
          fontWeight={"500"}
          alignSelf={"end"}
        >
          {errors?.message}
        </Text>
      </Flex>
    </>
  );
}

export default FeedbackInput;
