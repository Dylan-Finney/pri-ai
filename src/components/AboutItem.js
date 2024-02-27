import {
  Text,
  AccordionPanel,
  AccordionButton,
  Box,
  AccordionItem,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
const open = "/assets/open.svg";
const close = "/assets/close.svg";

export default function AboutItem(props) {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <div
            style={{
              backgroundColor: isExpanded ? "#F9FAFB" : "",
              borderRadius: isExpanded ? "16px" : "",
            }}
          >
            <AccordionButton>
              <Box style={{ marginRight: "5px" }}>
                <Image
                  src={isExpanded ? close : open}
                  alt={`${isExpanded ? "Close" : "Open"} Button`}
                  htmlWidth={22}
                  htmlHeight={23}
                />
              </Box>
              <Box as="span" flex="1" textAlign="left">
                <Text
                  fontWeight={"600"}
                  as={"b"}
                  color={"#107569"}
                  fontSize={"18px"}
                >
                  {props.question}
                </Text>
              </Box>
            </AccordionButton>
            <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
              {props.answer.split("\n").map((answer, i) => {
                return (
                  <Text color={"#134E48"} key={i} marginBottom={"16px"}>
                    {answer}
                  </Text>
                );
              })}
            </AccordionPanel>
          </div>
        </>
      )}
    </AccordionItem>
  );
}
