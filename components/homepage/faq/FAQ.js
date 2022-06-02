import React, { useState } from 'react'
import styles from './FAQ.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Question from "./Question";
import Button from "../../button/Button";
import {questions} from "../../../fixtures";
import {useRouter} from "next/router";

function FAQ() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(-1)

  function handleClick(value) {
    setActiveIndex(value)
  }

  function goTo(path) {
    return function () {
      router.push('/faq')
    }
  }

  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle center>
          FAQ
        </SectionTitle>
        <div className={styles.faqContainer}>
          {
            questions.map(({ title, content }, index) => (
              <Question
                key={index}
                content={title}
                index={index}
                onClick={handleClick}
                opened={index === activeIndex}>
                <p>
                  { content }
                </p>
              </Question>
            ))
          }
          <div className={styles.actions}>
            <Button onClick={goTo('/faq')} type="outlined">
              See more
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ