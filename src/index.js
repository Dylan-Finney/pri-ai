import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";
import App from "./components/App";
import { Amplify } from "aws-amplify";
// require("dotenv").config();
// import "dotenv/config";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
        userPoolClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
        identityPoolId: process.env.REACT_APP_AWS_IDENTITY_POOL_ID,
        signUpVerificationMethod: "code",
      },
    },
  },
  {
    ssr: true,
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
