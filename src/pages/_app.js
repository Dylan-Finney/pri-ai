import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/provider';
import {theme} from "../components/theme"
import TagManager from "react-gtm-module"
import { useEffect } from 'react';
import { gtm } from 'react-gtm-module/dist/TagManager';
function MyApp({ Component, pageProps }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM || "";
  const tagManagerArgs = {
    gtmId
  }
  useEffect(()=>{
    TagManager.initialize(tagManagerArgs)
  },[])
  return (
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp