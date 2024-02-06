import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  global: {
    "*": {
      fontFamily: "Roboto",
    },
  },
  fonts: {
    body: "Roboto",
    input: "Roboto",
    option: "Roboto",
    "option:nth-child(n)": "Roboto",
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
