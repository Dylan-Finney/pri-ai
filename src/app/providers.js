// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { Amplify } from "aws-amplify";

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

export function Providers({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
