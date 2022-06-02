import React, { useState } from "react";
import styles from './FAQ.module.sass'
import SectionTitle from "../../section-title/SectionTitle";
import Question from "../../homepage/faq/Question";
import Image from "next/image";

const steps = [
  {
    title: 'Step 1',
    description: '',
    imageUrl: '/images/about-sell-1.jpg'
  },
  {
    title: 'Step 2',
    description: '',
    imageUrl: '/images/about-sell-2.jpg'
  },
  {
    title: 'Step 3',
    description: '',
    imageUrl: '/images/about-sell-3.jpg'
  },
  {
    title: 'Step 4',
    description: '',
    imageUrl: '/images/about-sell-4.jpg'
  },
]

function FAQ() {
  const [currentIndex, setCurrentIndex] = useState(1)

  function handleClick(value) {
    setCurrentIndex(value)
  }

  return (
    <section className={styles.root}>
      <div className="container">
        <SectionTitle center>
          Lorem ipsum dolor sit amet, consectetur
        </SectionTitle>
        <div className={styles.faqContainer}>
          <Question
            type="about"
            onClick={handleClick}
            index={0}
            opened={currentIndex === 0}
            content="How to buy NFTs?">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra augue ut eleifend tellus at viverra egestas pellentesque. Suspendisse placerat cursus dolor proin massa, scelerisque. Risus, est tristique ullamcorper scelerisque purus non. Convallis ornare ac quis nec dui ullamcorper semper. Eget enim, nullam consectetur egestas ut rutrum eu elementum. Lorem libero etiam malesuada vivamus nec mauris.
            </p>
          </Question>
          <Question
            type="about"
            onClick={handleClick}
            index={1}
            opened={currentIndex === 1}
            content="How to sell NFTs?">
            {
              steps.map(({ title, imageUrl }) => (
                <div key={title} className={styles.step}>
                  <h6>{ title }</h6>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra augue ut eleifend tellus at viverra egestas pellentesque. Suspendisse placerat cursus dolor proin massa, scelerisque. Risus, est tristique ullamcorper scelerisque purus non. Convallis ornare ac quis nec dui ullamcorper semper. Eget enim, nullam consectetur egestas ut rutrum eu elementum. Lorem libero etiam malesuada vivamus nec mauris.
                  </p>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageWrapper}>
                      <Image src={imageUrl} width={587} height={332} layout="responsive" alt={title} />
                    </div>
                  </div>
                </div>
              ))
            }
          </Question>
        </div>
      </div>
    </section>
  )
}

export default FAQ