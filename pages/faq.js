import React, { useState } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import CommonHero from "../components/common-hero/CommonHero";
import styles from '../styles/FAQPage.module.sass'
import Question from "../components/homepage/faq/Question";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(-1)

  function handleClick(value) {
    setActiveIndex(value)
  }

  return (
    <Layout>
      <Head>
        <title>HOMEJAB - FAQ</title>
      </Head>
      <main>
        <CommonHero
          title={'FAQ'}
          description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque amet vel facilisis imperdiet mi pellentesque tincidunt turpis.'}
          imgUrl={'/faq-hero.jpg'} />
        <section className={styles.questions}>
          <div className="container">
            <div className={styles.questionsContainer}>
              {
                new Array(5).fill(null).map((v, index) => (
                  <Question
                    key={index}
                    content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit dui blandit in sem adipiscing amet velit ante?'}
                    index={index}
                    onClick={handleClick}
                    opened={index === activeIndex}>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra augue ut eleifend tellus at viverra egestas pellentesque. Suspendisse placerat cursus dolor proin massa, scelerisque. Risus, est tristique ullamcorper scelerisque purus non. Convallis ornare ac quis nec dui ullamcorper semper. Eget enim, nullam consectetur egestas ut rutrum eu elementum. Lorem libero etiam malesuada vivamus nec mauris.
                    </p>
                  </Question>
                ))
              }
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default FAQ