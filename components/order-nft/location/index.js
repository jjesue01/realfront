import React, {useEffect, useRef, useState} from "react";
import styles from './index.module.sass'
import Input from "../../input/Input";
import LocationIcon from '/public/icons/location.svg'
import {useLoadScript} from "@react-google-maps/api";

const libraries = ['places']

function Location() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDlqMYs6_uXvpAVJkVBf4hsUywAFVo5GBA',
    libraries,
    language: 'en'
  })
  const [address, setAddress] = useState('')

  const inputRef = useRef()
  const autocompleteRef = useRef()

  function handleChange({ target: { value } }) {
    setAddress(value)
  }

  useEffect(function initAutocomplete() {
    if (isLoaded) {
      const handlePlaceChange = () => {
        const { formatted_address } = autocompleteRef.current.getPlace()
        setAddress(formatted_address)
      }

      const options = {
        fields: ["formatted_address"],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options)
      autocompleteRef.current.addListener("place_changed", handlePlaceChange)
    }
  }, [isLoaded])

  return (
    <div className={styles.root}>
      <Input
        ref={inputRef}
        className={styles.input}
        value={address}
        iconRight={<LocationIcon className={styles.icon} />}
        onChange={handleChange}
        label="Location"
        placeholder="Enter property location" />
    </div>
  )
}

export default Location