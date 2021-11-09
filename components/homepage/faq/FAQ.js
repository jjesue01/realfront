import React, { useState } from 'react'
import styles from './FAQ.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Question from "./Question";
import Button from "../../button/Button";
import {questions} from "../../../fixtures";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(-1)

  function handleClick(value) {
    setActiveIndex(value)
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
            <Button type="outlined">
              See more
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ