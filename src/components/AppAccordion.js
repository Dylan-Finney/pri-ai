import { Accordion } from "@chakra-ui/react"
import AppItem from "./AppItem"
import { Context } from "./App"
import { useContext } from "react"
export default function AppAccordion(props) {
    const [apps] = useContext(Context);
    return (
        <Accordion variant={"prifina"} allowToggle>
            <AppItem title={"Social & Streaming"} apps={apps.filter(app=>app.tags.includes("Social"))} />
            <AppItem title={"Transport"} apps={apps.filter(app=>app.tags.includes("Transport"))}  />
            <AppItem title={"Health & Fitness"} apps={apps.filter(app=>app.tags.includes("Health"))}  />
            <AppItem title={"Misc"} apps={apps.filter(app=>app.tags.includes("Misc"))} />
        </Accordion>
    )
}