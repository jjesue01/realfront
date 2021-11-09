import React from "react";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import AboutUs from "../components/about/about-us/AboutUs";
import HowItWorks from "../components/how-it works/HowItWorks";
import WhoIsItFor from "../components/about/who-is-it-for/WhoIsItFor";
import FAQ from "../components/about/faq/FAQ";

function About() {
  return (
    <main>
      <Head>
        <title>HOMEJAB - About</title>
      </Head>
      <CommonHero
        title={'About'}
        description={'HomeJab Real is a marketplace where real estate photographers can showcase and promote their work, without fear of losing ownership of their efforts.'}
        imgUrl={'/about-hero.jpg'} />
      <AboutUs />
      <HowItWorks center />
      <WhoIsItFor />
      <FAQ />
    </main>
  )
}

export default About