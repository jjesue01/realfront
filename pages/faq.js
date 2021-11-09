import React, { useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import styles from '../styles/FAQPage.module.sass'
import Question from "../components/homepage/faq/Question";
import {questions} from "../fixtures";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(-1)

  function handleClick(value) {
    setActiveIndex(value)
  }

  return (
    <main>
      <Head>
        <title>HOMEJAB - FAQ</title>
      </Head>
      <CommonHero
        title={'FAQ'}
        description={'Below is general information on how the HomeJab Real NFT marketplace works. For additional information, please email us at real@homejab.com'}
        imgUrl={'/faq-hero.jpg'} />
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
                  <p>{ content }</p>
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