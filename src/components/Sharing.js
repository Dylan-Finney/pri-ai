import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "../styles/Sharing.module.css";
import LinkCopy from "./Sharing/LinkCopy";
import shareOptions from "./Sharing/ShareOptions";
const {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
} = require("@chakra-ui/react");

export function Sharing(props) {
  const betaLink = "https://beta.prifina.com/pri-ai.html";
  const statement = `Personal AI has arrived!
With Pri-AI by Prifina, you can ask anything about your personal data from common consumer apps and services. Pri-AI runs on your private data cloud, which is private by default. You can also use your favorite apps via APIs to ask Pri-AI to answer any question from public data while taking your personal information into account or even take action on your behalf.
Try Personal AI: ${betaLink}
#PersonalAI #PrivateAI #MyAI #MyData #PersonalData #UserHeldData #Prifina #DataPrivacy`;
  const url = "https://beta.prifina.com/pri-ai.html";

  const [slidesGroup, setSlidesGroup] = useState(5);

  useEffect(() => {
    switch (props.isLargerThanMD) {
      case true:
        setSlidesGroup(5);
        break;
      default:
        setSlidesGroup(3);
        break;
    }
  }, [props]);
  return (
    <Modal
      closeOnOverlayClick={true}
      motionPreset="slideInBottom"
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={"3xl"}
    >
      <ModalOverlay />
      <ModalContent
        style={{
          overflowX: "hidden",
          borderRadius: "10px",
          border: "0px solid transparent",
        }}
        width={"700px"}
        height={"300px"}
        minHeight={"0vh"}
        marginTop={"auto"}
        marginBottom={"auto"}
        padding={"35px"}
      >
        <ModalCloseButton
          onClick={() => {
            props.onClose();
          }}
        />
        <Box className={styles.container}>
          <Swiper
            className={styles.myswiper}
            slidesPerView={slidesGroup}
            slidesPerGroup={slidesGroup}
            modules={[Navigation]}
            navigation
          >
            {shareOptions.map((share, index) => {
              return (
                <SwiperSlide key={index} className={styles.swiperslide}>
                  <Flex
                    flexDir={"column"}
                    alignItems={"center"}
                    width={"100px"}
                    textOverflow={"ellipsis"}
                  >
                    {share.button(url, statement)}
                    {share.text}
                  </Flex>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
        <LinkCopy link={betaLink} />
      </ModalContent>
    </Modal>
  );
}
