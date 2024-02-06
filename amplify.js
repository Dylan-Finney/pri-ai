export const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.AWS_USER_POOL_ID,
      userPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID,
      identityPoolId: process.env.AWS_IDENTITY_POOL_ID,
      signUpVerificationMethod: "code",
    },
  },
};
