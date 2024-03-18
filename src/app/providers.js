// app/providers.tsx
"use client";

import { theme } from "@/components/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Amplify } from "aws-amplify";
import { Inter } from "next/font/google";
import "../styles/globals.css";
Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID,
        identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
        signUpVerificationMethod: "code",
      },
    },
  },
  {
    ssr: true,
  }
);
const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export function Providers({ children }) {
  return (
    <ChakraProvider>
      <main className={inter.className}>{children}</main>
    </ChakraProvider>
  );
}
