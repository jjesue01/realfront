import React, { useState } from "react";
import styles from './CityPicker.module.sass'
import cn from "classnames";
import ArrowShort from "../../../public/icons/arrow-short.svg";
import SearchIcon from '/public/icons/search-icon.svg'
import Typography from "../../Typography";
import Input from "../../input/Input";

function CityPicker({ className, onChange, value, options }) {
  const [searchValue, setSearchValue] = useState('')
  const [opened, setOpened] = useState(false)

  const label = options.find(option => option.value === value)?.label

  const optionsList = options
    .filter(option => option.label.toLowerCase().includes(searchValue.toLowerCase()))
    .map(({ label, value }) => (
    <div key={value} onClick={handleClick(value)} className={styles.option}>
      <Typography fontSize={14} color={'rgba(55, 65, 81, 0.8)'}>
        { label }
      </Typography>
    </div>
  ))

  function handleInputChange({ target: { value } }) {
    setSearchValue(value)
  }

  function handleClick(value) {
    return function () {
      onChange(value)
    }
  }

  function togglePicker() {
    setOpened(prevState => !prevState)
  }

  return (
    <div className={cn(className, styles.root, { [styles.opened]: opened })}>
      <button onClick={togglePicker}>
        <span>{label}</span>
        <ArrowShort />
      </button>
      <div className={styles.picker}>
        <div className={styles.header}>
          <Typography
            fontWeight={600}
            fontSize={14}
            lHeight={20}
            color={'#111'}>
            Choose a city
          </Typography>
          <div className={styles.inputWrapper}>
            <Input
              className={styles.input}
              name="city"
              value={searchValue}
              placeholder="Search"
              onChange={handleInputChange} />
            <SearchIcon />
          </div>
        </div>
        <div className={styles.optionsWrapper}>
          <div className={styles.optionsContainer}>
            <div className={styles.optionsContent}>
              {
                optionsList.length > 0 ?
                  optionsList
                  :
                  <Typography
                    fontSize={14}
                    color={'rgba(55, 65, 81, 0.8)'}
                    margin={'10px 0 0 24px'}>
                    No cities
                  </Typography>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CityPicker