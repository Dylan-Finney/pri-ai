// "use client";
import { Button, Text } from "@chakra-ui/react";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import { Metadata } from "next";
// import HomePage from "./home-page";
import App from "@/components/App";
// import { Container } from "@/components/Toast";

export const metadata = {
  title: "My Page Title",
};

export default function Page() {
  return (
    <>
      <App />
    </>
  );
}
