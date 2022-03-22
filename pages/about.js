import React from "react";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import AboutUs from "../components/about/about-us/AboutUs";
import HowItWorks from "../components/how-it works/HowItWorks";
import WhoIsItFor from "../components/about/who-is-it-for/WhoIsItFor";
import {HOST_NAME} from "../fixtures";

function About({ openLogin }) {
  return (
    <main>
      <Head>
        <title>About our NFT Marketplace - HomeJab</title>
        <meta name="description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="About our NFT Marketplace - HomeJab" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/about'} />
        <meta property="og:image" content="/who-we-are.jpeg" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="HomeJab’s NFT marketplace is where real estate photographers can promote their work, without fear of losing ownership of their efforts." />
      </Head>
      <CommonHero
        title={'Who we are'}
        description={`
        HomeJab is a marketplace where real estate photographers create and sell professional photos for consumers to trade online. Each HomeJab NFT is a unique portrayal of a real world landmark, landscape, institution or home created by a local artist from your community.

When an NFT is created by an artist it is traced back to that artist with every transaction in the form of a royalty. So, the original artist is always credited and rewarded for the work they completed.  

We believe trading images as NFTs is the best way to protect the ownership and usage of these images, while also protecting the original artist who created them. The HomeJab NFT Marketplace provides a safe haven for all digital imagery, from creator to consumer. 
        `}
        imgUrl={'/images/who-we-are.jpeg'} />
      <AboutUs />
      <HowItWorks onConnect={ openLogin } center />
      <WhoIsItFor />
      {/*<FAQ />*/}
    </main>
  )
}

export default About