// import { Context } from "./App"
import { useContext } from "react";
import {
  Box,
  Image,
  Text,
  FormControl,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { UserContext } from "../App";
import { avatars } from "@/utils/constants";

// const avatars = ["Avatar1.svg", "Avatar2.svg", "Avatar3.svg", "Avatar4.svg", "Avatar5.svg", "Avatar6.svg","Avatar7.svg","Avatar8.svg", "Avatar9.svg", "Avatar10.svg", "Avatar11.svg", "Avatar12.svg"]
const logoModal = "/assets/logo_modal.svg";
export default function SetupAI(props) {
  const [aIName, setAIName, , , selectedAvatar, setSelectedAvatar] =
    useContext(UserContext);
  return (
    <>
      <Box
        overflowY={"auto"}
        scrollBehavior={"smooth"}
        minHeight={"70vh"}
        maxHeight={"70vh"}
      >
        <Box
          width={"48px"}
          height={"48px"}
          marginBottom={{ base: "24px", sm: "0px" }}
        >
          <NextImage src={logoModal} alt="Logo Icon" width={100} height={100} />
        </Box>
        <Text
          fontSize={"30px"}
          fontWeight={"600"}
          color={"#101828"}
          marginBottom={{ base: "8px", sm: "10px" }}
        >
          Setup your personal AI
        </Text>
        <Text
          fontSize={"16px"}
          fontWeight={"400"}
          color={"#475467"}
          marginBottom={"10px"}
        >
          Give your AI a name and a face
        </Text>
        <Text color={"#344054"} fontSize={"14px"} fontWeight={"500"}>
          Name your AI
        </Text>
        <FormControl
          isInvalid={aIName === "" || (props.failedSubmit && aIName === null)}
        >
          <Input
            placeholder="Johnny5_AI"
            value={aIName}
            onChange={(e) => {
              setAIName(e.target.value);
            }}
          />
          {/* <FormErrorMessage display={aIName==="" || (failedSubmit && aIName === null)? "block" : "none"}>AI Name must not be empty</FormErrorMessage> */}
        </FormControl>

        <Text
          color={"#344054"}
          fontSize={"14px"}
          fontWeight={"500"}
          marginTop={"10px"}
        >
          Choose an avatar for your AI
        </Text>
        <FormControl
          isInvalid={
            selectedAvatar === "" ||
            (props.failedSubmit && selectedAvatar === null)
          }
        >
          <SimpleGrid
            columns={7}
            minChildWidth={{ base: "70px", sm: "97px" }}
            spacing="10px"
            marginTop={"10px"}
            marginRight={{ base: "0px", sm: "57px" }}
          >
            {avatars.map((avatar, i) => {
              if (avatar === selectedAvatar) {
                return (
                  <Box
                    maxWidth={{ base: "70px", sm: "90px" }}
                    key={i}
                    src={`/assets/avatar/${avatar}`}
                    alt={avatar}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                    }}
                    style={{
                      padding: "10px",
                      backgroundColor: "#F0FDF9",
                      borderRadius: "50px",
                      border: "2px solid #0E9384",
                    }}
                  >
                    <NextImage
                      src={`/assets/avatar/${avatar}`}
                      alt={`${avatar} - selected`}
                      width={100}
                      height={100}
                    />
                  </Box>
                );
              } else if (avatar === "Unknown") {
                return <></>;
              } else {
                return (
                  <Box
                    key={i}
                    maxWidth={{ base: "70px", sm: "90px" }}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: "50px",
                      border: "2px solid #EAECF0",
                    }}
                  >
                    <NextImage
                      src={`/assets/avatar/${avatar}`}
                      alt={`${avatar}`}
                      width={100}
                      height={100}
                    />
                  </Box>
                );
              }
            })}
          </SimpleGrid>
          {/* <FormErrorMessage display={selectedAvatar==="" || (failedSubmit && selectedAvatar === null)? "block" : "none"}>Avatar must be chosen</FormErrorMessage> */}
        </FormControl>
      </Box>
    </>
  );
}
