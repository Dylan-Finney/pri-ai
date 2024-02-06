import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { CgSlack } from "react-icons/cg";
import { signOut } from "aws-amplify/auth";
import SidebarItem from "./SidebarItem";
import User from "./User";
import sections from "@/utils/sections";
const about = "/assets/about.svg";
const FAQ = "/assets/FAQ.svg";
const logout = "/assets/logout.svg";

const UserCorner = ({ name, changeSection, section, loggedIn }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  return (
    <Popover
      // initialFocusRef={initialFocusRef}
      placement="top"
      closeOnBlur={true}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Button
          paddingLeft={0}
          marginTop={"auto"}
          variant={"ghost"}
          paddingTop={10}
          paddingBottom={10}
          justifySelf={"flex-start"}
        >
          <User name={name} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="bold" border="0">
          <SidebarItem
            text={"LED Slack"}
            altText={"Slack Icon"}
            icon={
              <CgSlack
                color="#475467"
                size={"22px"}
                style={{ flexShrink: "0" }}
              />
            }
            link={true}
            changeSection={() => {
              window
                .open(
                  "https://join.slack.com/t/libertyequalitydata/shared_invite/zt-ddr4t974-MCzsch4FSeux8DrFQ2atbQ",
                  "_blank"
                )
                .focus();
            }}
            last={true}
            // active={props.section === "chat"}
          />
          <SidebarItem
            text={"FAQ"}
            altText={"FAQ icon"}
            image={FAQ}
            link={true}
            changeSection={() => {
              window
                .open("https://beta.prifina.com/pri-ai.html", "_blank")
                .focus();
            }}
            // active={props.section === "chat"}
          />
          <SidebarItem
            text={"About this demo"}
            altText={"about icon"}
            image={about}
            changeSection={() => {
              changeSection(sections.ABOUT);
              onClose();
            }}
            active={section === sections.ABOUT}
          />
          {loggedIn && (
            <SidebarItem
              text={"Logout"}
              altText={"FAQ icon"}
              image={logout}
              link={false}
              changeSection={async () => {
                await signOut();
                location.reload();
              }}
              // active={props.section === "chat"}
            />
          )}
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
};

export default UserCorner;
