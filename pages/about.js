import React from "react";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import AboutUs from "../components/about/about-us/AboutUs";
import HowItWorks from "../components/how-it works/HowItWorks";
import WhoIsItFor from "../components/about/who-is-it-for/WhoIsItFor";
import FAQ from "../components/about/faq/FAQ";
import {HOST_NAME} from "../fixtures";

function About() {
  return (
    <main>
      <Head>
        <title>About our NFT Marketplace - HomeJab</title>
        <meta name="description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="About our NFT Marketplace - HomeJab" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/about'} />
        <meta property="og:image" content="/homejab-icon-512.png" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
      </Head>
      <CommonHero
        title={'About'}
        description={'HomeJab Real is a marketplace where real estate photographers can showcase and promote their work, without fear of losing ownership of their efforts.'}
        imgUrl={'/about-hero.jpg'} />
      <AboutUs />
      <HowItWorks center />
      <WhoIsItFor />
      {/*<FAQ />*/}
    </main>
  )
}

export default About