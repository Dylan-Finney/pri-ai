import { AccordionItem, AccordionButton, Box, Text, AccordionIcon, AccordionPanel, SimpleGrid, Tooltip } from "@chakra-ui/react"
import AppButton from "./AppButton"
import { getAppLogo } from "../utils"
import { useContext } from "react"
import { AppContext } from "../App"
export default function AppItem(props = {apps: [{"name": "test", "tags": ["Social"]}], chosenApps: [] }) {
  // const [, chosenApps, add, remove] = useContext(Context);
  const [ , chosenApps, add, remove, ] = useContext(AppContext);
    return (
      <>
        <Text marginLeft={"16px"} marginBottom={"16px"} as={"b"} color={"#101828"} fontSize={"16px"}>{props.title}</Text>
        <Box marginTop={"16px"} width={"100%"} marginLeft={"auto"} marginRight={"auto"} height={"1px"} backgroundColor={"#EAECF0"}/>
        <SimpleGrid marginLeft={"13px"} marginBottom={"16px"} columns={7} minChildWidth='84px'  spacing='10px' marginTop={"10px"} marginRight={"10px"}>
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
      </>
        // <AccordionItem marginBottom={"16px"}>
        //                   {({ isExpanded }) => (
        //                     <>
        //                         <div>
        //                             <AccordionButton backgroundColor={"#FFFFFF"} border={"1px solid #D0D5DD"} boxShadow={"0px 1px 2px rgba(16, 24, 40, 0.05)"} borderRadius={"8px"}>
        //                               <Box as="span" flex='1' textAlign='left'>
                                        
        //                               </Box>
        //                               <AccordionIcon />
        //                             </AccordionButton>
        //                           <AccordionPanel pb={4} marginLeft={"27px"}>
                                  
        //                           </AccordionPanel>
        //                         </div>
        //                     </>
                            
        //                   )}
        //                 </AccordionItem>
    )
}