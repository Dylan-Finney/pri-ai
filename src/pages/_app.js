import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/provider';
import {theme} from "../components/theme"
import Script from 'next/script'
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM || "";
  
  return (
    <>
    <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}/>
    <Script
      id='google-analytics'
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtmId}', {
          page_path: window.location.pathname,
        });
        `,
      }}
    />
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
    </>
  )
}

export default MyApp