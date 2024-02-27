import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth";
import { cookies } from "next/headers";

// import config from "@/amplifyconfiguration.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
        userPoolClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
        identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
        signUpVerificationMethod: "code",
      },
    },
  },
});
