import React  from 'react'
import Head from 'next/head'
import Hero from "../components/homepage/hero/Hero";
import TrendingIn from "../components/homepage/trending-in/TrendingIn";
import HowItWorks from "../components/how-it works/HowItWorks";
import BrowseByCity from "../components/homepage/browse-by-city/BrowseByCity";
import {HOST_NAME} from "../fixtures";
import WhoIsItFor from "../components/about/who-is-it-for/WhoIsItFor";

export default function Home({ openLogin }) {

  return (
    <main>
      <Head>
        <title>NFT Marketplace - HomeJab Real Estate Photography</title>
        <meta name="description" content="Collect and trade photos and videos from real estate photographers around the world in HomeJab’s peer-to-peer NFT marketplace." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="NFT Marketplace - HomeJab Real Estate Photography" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/'} />
        <meta property="og:image" content="/homejab-icon-512.png" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="Collect and trade photos and videos from real estate photographers around the world in HomeJab’s peer-to-peer NFT marketplace." />

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/homejab-icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#1DC3A6" />
        <link rel="stylesheet" type="text/css" charSet="UTF-8"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
      </Head>
      <Hero />
      <TrendingIn />
      <HowItWorks onConnect={openLogin} />
      <BrowseByCity />
      <WhoIsItFor />
    </main>
  )
}
