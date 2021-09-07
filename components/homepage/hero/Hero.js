import React, { useState } from 'react'
import styles from './Hero.module.sass'
import Image from "next/image";
import Input from "../../input/Input";
import Button from "../../button/Button";
import SearchIcon from "../../../icons/search-icon.svg";

function Hero() {
  const [searchValue, setSearchValue] = useState('')

  function handleChange({ target: { value } }) {
    setSearchValue(value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()

    console.log(searchValue)
  }

  return (
    <section className={styles.hero}>
      <div className={styles.bgImage}>
        <Image src="/bg-circle.png" width={416} height={397} alt="circle" />
      </div>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.heroContent}>
            <h1>
              Lorem ipsum dolor sit amet, consectetur
            </h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                type="search"
                name="search"
                value={searchValue}
                onChange={handleChange}
                placeholder="Enter an address, neighborhood, city or ZIP code" />
              <Button className={styles.btnSubmit} type="accent" htmlType="submit">
                <SearchIcon />
                Search
              </Button>
            </form>
          </div>
          <div className={styles.collectionItem}>
            <Image
              src="/hero-aparts-big.jpg"
              layout="fill"
              objectFit="cover"
              alt="apartments" />
            <div className={styles.collectionInfo}>
              <div className={styles.collectionInfoImage}>
                <Image src="/hero-aparts-small.jpg" width={50} height={50} alt="logo apartments" />
              </div>
              <div className={styles.collectionDescription}>
                <p className={styles.collectionName}>Collection name</p>
                <p className={styles.collectionBy}>by JOHN DOE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero