import React  from 'react'
import Head from 'next/head'
import Layout from "../components/layout";
import Hero from "../components/homepage/hero/Hero";
import TrendingIn from "../components/homepage/trending-in/TrendingIn";
import HowItWorks from "../components/homepage/how-it works/HowItWorks";
import BrowseByCity from "../components/homepage/browse-by-city/BrowseByCity";
import FAQ from "../components/homepage/faq/FAQ";

export default function Home() {

  return (
    <Layout>
      <Head>
        <title>HOMEJAB - NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" charSet="UTF-8"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
      </Head>
      <main>
        <Hero />
        <TrendingIn />
        <HowItWorks />
        <BrowseByCity />
        <FAQ />
      </main>
    </Layout>
  )
}
