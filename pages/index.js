import React  from 'react'
import Head from 'next/head'
import Hero from "../components/homepage/hero/Hero";
import TrendingIn from "../components/homepage/trending-in/TrendingIn";
import HowItWorks from "../components/how-it works/HowItWorks";
import BrowseByCity from "../components/homepage/browse-by-city/BrowseByCity";
import FAQ from "../components/homepage/faq/FAQ";

export default function Home({ openLogin }) {

  return (
    <main>
      <Head>
        <title>HOMEJAB - NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" charSet="UTF-8"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
      </Head>
      <Hero />
      <TrendingIn />
      <HowItWorks onConnect={openLogin} />
      <BrowseByCity />
      <FAQ />
    </main>
  )
}
