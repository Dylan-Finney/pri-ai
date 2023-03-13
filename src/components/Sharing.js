import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TumblrShareButton,
    LivejournalShareButton,
    MailruShareButton,
    ViberShareButton,
    WorkplaceShareButton,
    LineShareButton,
    WeiboShareButton,
    PocketShareButton,
    InstapaperShareButton,
    HatenaShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    VKIcon,
    OKIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    MailruIcon,
    EmailIcon,
    LivejournalIcon,
    ViberIcon,
    WorkplaceIcon,
    LineIcon,
    PocketIcon,
    InstapaperIcon,
    WeiboIcon,
    HatenaIcon,
  }  from "react-share";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import styles from "../styles/Sharing.module.css"
const {Input,useMediaQuery, Flex, TagLabel, Tag, Textarea, Button, useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,Icon,ModalBody,Lorem,ModalFooter, Spinner,Text, Spacer, Box, SimpleGrid, Tooltip, Progress, ChakraProvider, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, UnorderedList, ListItem, Editable, EditablePreview, EditableInput, useEditableControls, ButtonGroup, IconButton, CheckboxIcon, FormErrorMessage, DrawerOverlay, Drawer, DrawerContent, DrawerHeader, DrawerCloseButton, Image, FormControl, Tabs, TabPanel, TabPanels    } = require("@chakra-ui/react")


export function Sharing(props){
    const betaLink = "https://beta.prifina.com/priai.html"
    const statement = `Personal AI has arrived!
With Pri-AI by Prifina, you can ask anything about your personal data from common consumer apps and services. Pri-AI runs on your private data cloud, which is private by default. You can also use your favorite apps via APIs to ask Pri-AI to answer any question from public data while taking your personal information into account or even take action on your behalf.
Try Personal AI: ${betaLink}
#PersonalAI #PrivateAI #MyAI #MyData #PersonalData #UserHeldData #Prifina #DataPrivacy`
    const url = "https://bit.ly/pri-ai-prifina"


    const [slidesGroup, setSlidesGroup] = useState(5) 
    useEffect(()=>{
        switch(props.isLargerThanSM){
            case true:
                setSlidesGroup(5)
                break
            default:
                setSlidesGroup(3)
                break
        }
    }, [props])
    return (
        <Modal closeOnOverlayClick={true} motionPreset="slideInBottom" isOpen={props.isOpen} onClose={props.onClose} size={"3xl"}>
            <ModalOverlay />
            <ModalContent style={{overflowX: "hidden", borderRadius: "10px", border: "0px solid transparent"}} width={"700px"} height={"300px"} minHeight={"0vh"} marginTop={"auto"} marginBottom={"auto"} padding={"35px"}>
              <ModalCloseButton onClick={()=>{props.onClose();}} />
                <Box className={styles.container}>
                    <Swiper className={styles.myswiper} slidesPerView={slidesGroup} slidesPerGroup={slidesGroup} modules={[Navigation]} navigation>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <FacebookShareButton
                                    url={url}
                                    quote={statement}
                                >
                                    <FacebookIcon size={64} round />
                                </FacebookShareButton>
                                Facebook
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <TwitterShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <TwitterIcon size={64} round />
                                </TwitterShareButton>
                            Twitter
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <TelegramShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <TelegramIcon size={64} round />
                                </TelegramShareButton>
                            Telegram
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <WhatsappShareButton
                                    url={url}
                                    title={statement}
                                    separator=":: "
                                >
                                    <WhatsappIcon size={64} round />
                                </WhatsappShareButton>
                            Whatsapp
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <LinkedinShareButton url={url}>
                                    <LinkedinIcon size={64} round />
                                </LinkedinShareButton>
                                Linkedin
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <PinterestShareButton
                                    url={url}
                                    image={`personal-ai.prifina.com/assets/Illustration.svg`}
                                >
                                    <PinterestIcon size={64} round />
                                </PinterestShareButton>
                                Pinterest
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <VKShareButton
                                    url={url}
                                    image={`personal-ai.prifina.com/assets/Illustration.svg`}
                                >
                                    <VKIcon size={64} round />
                                </VKShareButton>
                                VKShare
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <OKShareButton
                                    url={url}
                                    image={`personal-ai.prifina.com/assets/Illustration.svg`}
                                >
                                    <OKIcon size={64} round />
                                </OKShareButton>
                                OK
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <RedditShareButton
                                    url={url}
                                    title={statement}
                                    windowWidth={660}
                                    windowHeight={460}
                                >
                                    <RedditIcon size={64} round />
                                </RedditShareButton>
                                Reddit
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <TumblrShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <TumblrIcon size={64} round />
                                </TumblrShareButton>
                                Tumblr
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <LivejournalShareButton
                                    url={url}
                                    title={"Introducing Pri-AI"}
                                    description={statement}
                                >
                                    <LivejournalIcon size={64} round />
                                </LivejournalShareButton>
                                Livejournal
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <MailruShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <MailruIcon size={64} round />
                                </MailruShareButton>
                                Mailru
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <EmailShareButton
                                    url={url}
                                    subject={"Introducing Pri-AI"}
                                    body={statement}
                                >
                                    <EmailIcon size={64} round />
                                </EmailShareButton>
                                Email
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <ViberShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <ViberIcon size={64} round />
                                </ViberShareButton>
                                Viber
                            </Flex>
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <WorkplaceShareButton
                                    url={url}
                                    quote={statement}
                                >
                                    <WorkplaceIcon size={64} round />
                                </WorkplaceShareButton>
                                Workplace
                            </Flex>                            
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <LineShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <LineIcon size={64} round />
                                </LineShareButton>
                                Line
                            </Flex>   
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>   
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <WeiboShareButton
                                    url={url}
                                    title={statement}
                                    image={`personal-ai.prifina.com/assets/Illustration.svg`}
                                >
                                    <WeiboIcon size={64} round />
                                </WeiboShareButton>
                                Weibo
                            </Flex>    
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>  
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <PocketShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <PocketIcon size={64} round />
                                </PocketShareButton>
                                Pocket
                            </Flex>     
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}> 
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <InstapaperShareButton
                                    url={url}
                                    title={statement}
                                >
                                    <InstapaperIcon size={64} round />
                                </InstapaperShareButton>
                                Instapaper
                            </Flex>      
                        </SwiperSlide>
                        <SwiperSlide className={styles.swiperslide}>
                            <Flex flexDir={"column"} alignItems={"center"} width={"100px"} textOverflow={"ellipsis"}>
                                <HatenaShareButton
                                    url={url}
                                    title={statement}
                                    windowWidth={660}
                                    windowHeight={460}
                                >
                                    <HatenaIcon size={64} round />
                                </HatenaShareButton>
                                Hatena
                            </Flex>      
                        </SwiperSlide>
                    </Swiper>
                </Box>
                <Flex border={"1px solid #CBD5E0"} padding={"10px"} borderRadius={"0.375rem"} marginTop={"30px"}>
                <Input variant='unstyled' value={betaLink} textOverflow={"ellipsis"}/>
                <Button onClick={()=>{navigator.clipboard.writeText(betaLink)}}>Copy</Button>
                </Flex>
                
                
                
                
                
            </ModalContent>
        </Modal>
    )
}