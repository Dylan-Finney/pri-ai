import { AccordionItem, AccordionButton, Box, Text, AccordionIcon, AccordionPanel, SimpleGrid, Tooltip } from "@chakra-ui/react"
import AppButton from "./AppButton"
import { getAppLogo } from "./utils"
import { Context } from "./App"
import { useContext } from "react"
export default function AppItem(props = {apps: [{"name": "test", "tags": ["Social"]}], chosenApps: [] }) {
  const [, chosenApps, add, remove] = useContext(Context);
    return (
        <AccordionItem marginBottom={"16px"}>
                          {({ isExpanded }) => (
                            <>
                                <div>
                                    <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
                                      <Box as="span" flex='1' textAlign='left'>
                                        <Text as={"b"} color={ isExpanded ? "#101828" : "#667085"} fontSize={"16px"}>{props.title}</Text>
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  <AccordionPanel pb={4} marginLeft={"27px"}>
                                  <SimpleGrid columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
                                    {
                                      props.apps.map((app)=>{
                                        return (
                                          <>
                                          {
                                            chosenApps.includes(app.name) ? (
                                                <>
                                                <AppButton name={app.name} source={getAppLogo(app.name)} checked={true} click={()=>{remove(app)}}/>
                                              </>
                                            ) : (
                                              <>
                                                <AppButton name={app.name} source={getAppLogo(app.name)} checked={false} click={()=>{add(app)}}/>
                                              </>
                                            )
                                          }
                                          
                                          
                                          </>
                                        )
                                      })
                                    }
                                  </SimpleGrid>
                                  </AccordionPanel>
                                </div>
                            </>
                            
                          )}
                        </AccordionItem>
    )
}