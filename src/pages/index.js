import Head from 'next/head'
import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import axios from 'axios'
import App from '@/components/App'

export default function Home() {
  return (
    <>
      <Head>
        <title>Pri-AI</title>
        <meta name="description" content="Meet Pri-AI, your natural language AI assistant, built into your personal data." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <App/>
      </main>
    </>
  )
}
