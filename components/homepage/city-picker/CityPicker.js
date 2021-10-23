import React, {useEffect, useState} from "react";
import styles from './CityPicker.module.sass'
import cn from "classnames";
import ArrowShort from "../../../public/icons/arrow-short.svg";
import SearchIcon from '/public/icons/search-icon.svg'
import Typography from "../../Typography";
import Input from "../../input/Input";

function CityPicker({ className, onChange, value, options, fetchOptions }) {
  const [searchValue, setSearchValue] = useState('')
  const [inputName, setInputName] = useState('city')
  const [opened, setOpened] = useState(false)

  const optionsList = options.map((option) => (
    <div key={option.value} onClick={handleClick(option)} className={styles.option}>
      <Typography fontSize={14} color={'rgba(55, 65, 81, 0.8)'}>
        { option.label }
      </Typography>
    </div>
  ))

  function handleInputChange({ target: { value } }) {
    fetchOptions(value)
    setSearchValue(value)
  }

  function handleClick(option) {
    return function () {
      onChange(option)
      togglePicker()
    }
  }

  function togglePicker() {
    if (!opened) {
      setSearchValue('')
      fetchOptions('a')
    }
    setOpened(prevState => !prevState)
  }

  useEffect(function initName() {
    if (opened) setInputName(Date.now() + 'city')
  }, [opened])

  return (
    <>
      {
        opened &&
        <div onClick={togglePicker} className={styles.closeLayer} />
      }
      <div className={cn(className, styles.root, { [styles.opened]: opened })}>
        <button onClick={togglePicker}>
          <span>{value.label}</span>
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
                size="small"
                iconRight={<SearchIcon />}
                name={inputName}
                value={searchValue}
                placeholder="Search"
                autoComplete="chrome-off"
                onChange={handleInputChange} />
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
                      color={'#111'}
                      margin={'10px 0 0 24px'}>
                      No cities
                    </Typography>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CityPicker