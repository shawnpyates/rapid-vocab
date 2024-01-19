import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../app/globals.css'

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;