import React, { useState } from 'react'
import styles from './FAQ.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Question from "./Question";
import Button from "../../button/Button";

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