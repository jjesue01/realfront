import React, { useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import styles from '../styles/FAQPage.module.sass'
import Question from "../components/homepage/faq/Question";
import {HOST_NAME, questions} from "../fixtures";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(-1)

  function handleClick(value) {
    setActiveIndex(value)
  }

  return (
    <main>
      <Head>
        <title>FAQs - HomeJab’s NFT Marketplace</title>
        <meta name="description" content="General information about HomeJab’s NFT marketplace works and how to contact us with further questions." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="FAQs - HomeJab’s NFT Marketplace" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={HOST_NAME + '/marketplace'} />
        <meta property="og:image" content="/Miami-Beach.jpeg" />
        <meta property="og:image:alt" content="HomeJab icon" />
        <meta property="og:description" content="General information about HomeJab’s NFT marketplace works and how to contact us with further questions." />
      </Head>
      <CommonHero
        title={'FAQ'}
        description={`Buying an NFT on the real marketplace is actually pretty easy, as long as you understand that you are buying your NFTs with cryptocurrency (not dollars).
        If you are wondering how to get cryptocurrency, you first need a crypto wallet.
        Below is more information on how to buy NFTs on the real marketplace.
        `}
        imgUrl={'/images/faq-hero.jpg'} />
      <section className={styles.questions}>
        <div className="container">
          <div className={styles.questionsContainer}>
            {
              questions.map(({ title, content }, index) => (
                <Question
                  key={index}
                  content={title}
                  index={index}
                  onClick={handleClick}
                  opened={index === activeIndex}>
                  <div>
                  {content.map((item) => (
                       <>
                        <h6>{item.question_subtitle}</h6>
                        <p>{item.answer}</p>
                       </>
                  ))}
                  </div>
                </Question>
              ))
            }
          </div>
        </div>
      </section>
    </main>
  )
}

export default FAQ