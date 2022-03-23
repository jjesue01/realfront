import React from "react";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import AboutUs from "../components/about/about-us/AboutUs";
import HowItWorks from "../components/how-it works/HowItWorks";
import WhoIsItFor from "../components/about/who-is-it-for/WhoIsItFor";
import {HOST_NAME} from "../fixtures";
import Typography from "../components/Typography";

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
      <AboutUs
        title="Why we are here"
        imageUrl="/images/why-we.jpeg">
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'24px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          Online image theft is rampant, especially in the real estate community. And, while it seems harmless on the surface, it’s actually quite damaging for the artist who creates the image. Photographers are forced to put their work out there with zero protections, at very little pay. The HomeJab NFT Marketplace is designed to protect the ownership of an artist’s digital portfolio, while rewarding them for their hard work.
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'32px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          When you purchase an NFT from HomeJab, you are not only owning a piece of real world history, you are supporting a real life artist. Most photographers work as independent contractors, with little recourse after a shoot is complete. Once the work is published, the possession is out of the artist’s control. The HomeJab NFT Marketplace is the only place, real or digital, that secures their efforts and the ongoing value they provide.
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={16}
          lHeight={32}
          margin={'32px 0 0'}
          color={'rgba(55, 65, 81, 0.8)'}>
          As society becomes more virtual in its daily routine, actually seeing the world has suddenly become more of a chore for many. Photographers are our lens to the real world, we cannot afford to lose them. We need to protect and support our artists… if we don’t, who will?
        </Typography>
      </AboutUs>
      <HowItWorks onConnect={ openLogin } center />
      <WhoIsItFor />
      {/*<FAQ />*/}
    </main>
  )
}

export default About