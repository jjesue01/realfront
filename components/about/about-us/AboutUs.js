import React from "react";
import styles from './AboutUs.module.sass'
import Image from "next/image";
import SectionTitle from "../../section-title/SectionTitle";
import Typography from "../../Typography";

function AboutUs({ title, imageUrl, children }) {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <Image src={imageUrl} layout="fill" objectFit="cover" alt={title} />
          </div>
          <div className={styles.info}>
            <SectionTitle>
              { title }
            </SectionTitle>
            { children }
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs