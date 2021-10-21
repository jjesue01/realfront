import React, {useEffect, useState} from "react";
import styles from './Autocomplete.module.sass'
import cn from "classnames";
import Input from "../input/Input";
import Typography from "../Typography";

function Autocomplete({ className, name, value, onChange, options = [], fetchOptions, ...otherProps}) {
  const [isOpened, setOpened] = useState(false)
  const [displayValue, setDisplayValue] = useState('')

  const optionsList = options.map((option) => (
    <div key={option.value} onMouseDown={ handleClick(option) } className={styles.option}>
      <p>{ option.label }</p>
    </div>
  ))

  function handleClick(option) {
    return function () {
      onChange({ target: { name, value: option } })
    }
  }

  function toggleDropdown() {
    setOpened(prevState => !prevState)
  }

  function handleChange({ target: { value } }) {
    setDisplayValue(value)
    fetchOptions(value)
  }

  useEffect(function initValue() {
    setDisplayValue(value.label)
  }, [value.label])

  return (
    <div className={cn(className, styles.root, { [styles.opened]: isOpened })}>
      <Input
        onFocus={toggleDropdown}
        onBlur={toggleDropdown}
        onChange={handleChange}
        name={name}
        value={displayValue}
        {...otherProps} />
      <div className={styles.dropdown}>
        <div className={styles.content}>
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
  )
}

export default Autocomplete