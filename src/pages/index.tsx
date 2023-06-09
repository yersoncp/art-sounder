import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
import Script from 'next/script'

// const RecordVideo = dynamic(() => import('../components/RecordVideo'), { ssr: false })
const LinearSound = dynamic(() => import('../components/LinearSound'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Art Sound Experiment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://www.webrtc-experiment.com/screenshot.js" />
      <main className={`${styles.main} ${inter.className}`}>
        <LinearSound />
        {/* <RecordVideo>
        </RecordVideo> */}
      </main>
    </>
  )
}
