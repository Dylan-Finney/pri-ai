import { useContext } from "react";
import { AppContext } from "../App";
import AppItem from "./AppItem";
export default function AppList(props) {
  const [apps] = useContext(AppContext);
  return (
    <>
      <AppItem
        title={"Social & Streaming"}
        apps={apps.filter((app) => app.tags.includes("Social"))}
      />
      <AppItem
        title={"Transport"}
        apps={apps.filter((app) => app.tags.includes("Transport"))}
      />
      <AppItem
        title={"Health & Fitness"}
        apps={apps.filter((app) => app.tags.includes("Health"))}
      />
      <AppItem
        title={"Misc"}
        apps={apps.filter((app) => app.tags.includes("Misc"))}
      />
    </>
  );
}
