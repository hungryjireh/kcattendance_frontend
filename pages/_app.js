import Head from 'next/head';
import "./css/styles.css";
import { AppWrapper } from '../context/state';


export default function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Head>
          <title>Next.js - Form Validation Example</title>

          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <Component {...pageProps} />
    </AppWrapper>
  )
}