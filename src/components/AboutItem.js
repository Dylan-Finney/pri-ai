import { Text, AccordionPanel, AccordionButton, Box, AccordionItem } from "@chakra-ui/react"
const open = "/assets/open.svg"
const close = "/assets/close.svg"

export default function AboutItem(props) {
    return (
        <AccordionItem>
        {({ isExpanded }) => (
        <>
        <div style={{backgroundColor: isExpanded ? "#F9FAFB": "", borderRadius:isExpanded ? "16px": ""}}>
            <AccordionButton>
                <img src={isExpanded ? close : open} alt={`${isExpanded ? "Close" : "Open"} Button`} style={{marginRight: "5px"}}/>
                <Box as="span" flex='1' textAlign='left'>
                <Text fontWeight={"600"} as={"b"} color={"#107569"} fontSize={"18px"}>{props.question}</Text>
                </Box>
            </AccordionButton>
            <AccordionPanel pb={4} marginLeft={"27px"} fontSize={"16px"}>
            <Text color={"#134E48"}>{props.answer}</Text>
            </AccordionPanel>
        </div>
        </>
        )}
        </AccordionItem>
    )
}