import React, {useEffect, useRef, useState} from 'react'
import styles from './Hero.module.sass'
import Image from "next/image";
import Input from "../../input/Input";
import Button from "../../button/Button";
import SearchIcon from "../../../icons/search-icon.svg";
import {useRouter} from "next/router";
import {useLoadScript} from "@react-google-maps/api";

const libraries = ['places']

function Hero() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDlqMYs6_uXvpAVJkVBf4hsUywAFVo5GBA',
    libraries,
    language: 'en'
  })
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef()
  const autocompleteRef = useRef()

  function handleChange({ target: { value } }) {
    setSearchValue(value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()

    router.push(`/marketplace?search=${searchValue}`)
  }

  useEffect(function initAutocomplete() {
    if (isLoaded) {
      const handlePlaceChange = () => {
        const { geometry, formatted_address } = autocompleteRef.current.getPlace()
        setSearchValue(formatted_address)
      }

      const options = {
        //componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry"],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options)
      autocompleteRef.current.addListener("place_changed", handlePlaceChange)
    }
  }, [isLoaded])

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
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                ref={inputRef}
                className={styles.searchInput}
                type="search"
                name="search"
                value={searchValue}
                onChange={handleChange}
                placeholder="Enter an address, city or zip code" />
              <Button className={styles.btnSubmit} type="accent" htmlType="submit">
                <SearchIcon />
                <span>Search</span>
              </Button>
            </form>
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