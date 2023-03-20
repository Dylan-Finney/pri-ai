/* eslint-disable react/no-unescaped-entities */
import { Text, UnorderedList, ListItem, Accordion, AccordionItem, AccordionButton, Box, AccordionPanel } from "@chakra-ui/react"
import AboutItem from "./AboutItem"
const open = "/assets/open.svg"
const close = "/assets/close.svg"
export default function About(props) {
    return (
        <>
        <hr/>
            <div style={{marginTop: "10px", marginLeft: "1.5rem", whiteSpace: "pre-wrap","overflow-y": "scroll", "scroll-behavior": "smooth", "min-height": "87vh","max-height": "87vh",}}>
            <div style={{marginRight: "30px"}}>                    
                <Text fontWeight={"600"} as={"b"} fontSize={"36px"} color={"#107569"} letterSpacing={"-0.02em"}>Pri-AI Demo v1.0.0</Text>
                <Text fontSize={"20px"} color={"#134E48"} marginBottom={"16px"}>This demo is designed to simulate the experience of having a personal AI assistant which has access to a wide range of your personal data from your applications and devices. This Pri-AI (Personal AI) is planned to be launched as a feature on Prifina, the first holistic personal data platform.</Text>
                <Text fontWeight={"600"} fontSize={"24px"} color={"#107569"}>What can Pri-AI do?</Text>
                <UnorderedList color={"#134E48"} fontSize={"20px"} marginBottom={"16px"}>
                <ListItem>Provide intuitive and easy-to-understand answers to your data-related questions</ListItem>
                <ListItem>Uncover patterns in your spending habits, fitness progress, and behavior changes over time</ListItem>
                <ListItem>Many more advanced features upcoming. Watch this space!</ListItem>
                </UnorderedList>
                <Text fontWeight={"600"} fontSize={"24px"} color={"#107569"}>Limitations </Text>
                <UnorderedList color={"#134E48"} fontSize={"20px"} marginBottom={"16px"}>
                <ListItem>May occasionally provide incorrect or inappropriate responses. If this happens please leave feedback so we can improve the system.</ListItem>
                <ListItem>As this is a demonstration and Pri-AI is not actually accessing your data answers will not be specific to you but rather plausible answers based on  assumptions.</ListItem>
                <ListItem>This is a simulated experience based on limited data. The main goal is to demonstrate how you might interact with a data source and personal personals AI like this.</ListItem>
                <ListItem>Although this is a demonstration you can rest assured that everything you see here here(and much more) is possible within Prifina’s personal data ecosystem</ListItem>
                </UnorderedList>
                <Accordion variant={"prifina"} allowToggle>

                <AboutItem question={"What is Prifina?"} answer={"Prifna ‘the User-Held Data Company’. Prifina provides a personal data platform where the data is owned by individuals themselves. Anyone can build services for people to live happier and healthier lives.​"}/>
                <AboutItem question={"What is holistic personal data?"} answer={"Your data is the key to unlocking new experiences, and our system makes it better. By bringing your data together from different sources and enhancing it, you'll have a holistic data source that can be used to create personalized experiences that meet your unique needs."}/>
                <AboutItem question={"How does Pri-AI work?"} answer={"At the core of each Prifina account are two things; your data and your own personal AI assistant. Your AI-powered personal assistant lives in your secure personal data cloud and connects the dots in your data for a holistic view of you. Pri-AI helps categorize and enrich incoming data into a reusable holistic data source and then gives you the ability to interact with your data via the AI Chatbot you see demoed here."}/>
                <AboutItem question={"How is my data handled in this demo experience?"} answer={`This Personal AI chat service demo records each chat session and related details. The purpose of this recording is to improve the quality of our service and for development purposes. 
By using this demo, you acknowledge and agree to the recording and storage of your conversation history. Furthermore, any details provided or prompts entered hereafter will be sent to and processed by Prifina and OpenAI.
We want you to know that any personal information collected will be kept confidential and will not be disclosed to any third party without your consent, except as required by law.
If you have any concerns about the collection, use, or storage of your personal information, please do not use this service. If you have any questions or comments about our privacy policy or practices, please feel free to contact us.
Thank you for using our Personal AI chat service.`}/>
                </Accordion>
            </div>

            </div>
        </>
    )
}