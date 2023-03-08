import { Accordion } from "@chakra-ui/react"
import AppItem from "./AppItem"
export default function AppAccordion(props) {
    return (
        <Accordion variant={"prifina"} allowToggle>
            <AppItem title={"Social & Streaming"} apps={props.apps.filter(app=>app.tags.includes("Social"))} chosenApps={props.chosenApps} add={(app)=>{props.add(app)}} remove={(app)=>{props.remove(app)}}/>
            <AppItem title={"Transport"} apps={props.apps.filter(app=>app.tags.includes("Transport"))}  chosenApps={props.chosenApps} add={(app)=>{props.add(app)}} remove={(app)=>{props.remove(app)}}/>
            <AppItem title={"Health & Fitness"} apps={props.apps.filter(app=>app.tags.includes("Health"))}  chosenApps={props.chosenApps} add={(app)=>{props.add(app)}} remove={(app)=>{props.remove(app)}}/>
            <AppItem title={"Misc"} apps={props.apps.filter(app=>app.tags.includes("Misc"))}  chosenApps={props.chosenApps} add={(app)=>{props.add(app)}} remove={(app)=>{props.remove(app)}}/>
        </Accordion>
    )
}