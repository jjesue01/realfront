import React from 'react'
import styles from './Hero.module.sass'
import Image from "next/image";
import Link from "next/link";
import Button from "../../button/Button";

function Hero() {

  return (
    <section className={styles.hero}>
      <div className={styles.bgImage}>
        <Image src="/bg-circle.png" width={416} height={397} alt="circle" />
      </div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.heroContent}>
            <h1>
              Support real artists. Own the real world.
            </h1>
            <p>Collect and trade real world images from real estate photographers worldwide, help support the artists that give us the world.</p>
            <Link href="/marketplace" passHref>
              <a className={styles.btnExplore}>
                <Button>
                  Explore Our Listings
                </Button>
              </a>
            </Link>
          </div>
          <div className={styles.collectionItem}>
            <Image
              src="/Lk9TUqFA.jpeg"
              layout="fill"
              objectFit="cover"
              alt="apartments" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero