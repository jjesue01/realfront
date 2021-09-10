import React from "react";
import Layout from "../components/layout";
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
        description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque amet vel facilisis imperdiet mi pellentesque tincidunt turpis.'}
        imgUrl={'/about-hero.jpg'} />
      <AboutUs />
      <HowItWorks center />
      <WhoIsItFor />
      <FAQ />
    </main>
  )
}

export default About