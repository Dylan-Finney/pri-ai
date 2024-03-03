import { extendTheme } from "@chakra-ui/react";
import { Roboto } from "next/font/google";

const nextFont = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const theme = extendTheme({
  global: {
    "*": {
      fontFamily: "var(--font-rubik)",
    },
  },
  textStyles: {
    body: {
      "font-family": "var(--font-rubik)",
    },
  },
  fonts: {
    body: "var(--font-rubik)",
    input: "var(--font-rubik)",
    option: "var(--font-rubik)",
    "*": "var(--font-rubik)",
    "option:nth-child(n)": "var(--font-rubik)",
  },
  initialColorMode: "light",
  components: {
    Progress: {
      variants: {
        prifina: (props) => ({
          filledTrack: {
            bgColor: "#0E9384",
          },
        }),
      },
    },
    Accordion: {
      variants: {
        prifina: (props) => ({
          container: {
            borderTopWidth: "0px",
            _last: {
              borderBottomWidth: "0px",
            },
          },
        }),
      },
    },
  },
});
