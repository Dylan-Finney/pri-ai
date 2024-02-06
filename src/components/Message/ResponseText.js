import { Text } from "@chakra-ui/react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
// import styles from "../../styles/Message.module.css";
import styles from "@/styles/Message.module.css";
import "katex/dist/katex.min.css";
const ResponseText = ({ text, generating = false }) => {
  // console.log(styles.message);
  return (
    <Text
      className={generating ? styles.message : null}
      fontSize={"sm"}
      color={"#215852"}
      paddingLeft={{ base: "9.5vw", sm: "50px", lg: "55px" }}
      paddingRight={"1vw"}
    >
      <Markdown
        // className={styles.message}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </Markdown>
    </Text>
  );
};

export default ResponseText;
