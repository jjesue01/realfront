import React, { useState } from "react";
import styles from './Select.module.sass'
import cn from "classnames";
import Typography from "../Typography";
import ArrowIcon from '/public/icons/arrow-short.svg'

function Select({ className, value, name, options = [], onChange, size = 'default', placeholder }) {
  const [opened, setOpened] = useState(false)

  const label = options.find(option => option.value === value)?.label || ''

  const selectClassNames = cn(
    className,
    styles.root,
    {
      [styles.small]: size === 'small',
      [styles.opened]: opened,
      [styles.noValue]: value === ''
    }
  )

  const optionsList = options.map(({ label, value }) => (
    <div key={value} onClick={ handleClick(value) } className={styles.option}>
      <p>{ label }</p>
    </div>
  ))

  function toggleList() {
    setOpened(prevState => !prevState)
  }

  function handleClick(value) {
    return function () {
      onChange({ target: { name, value } })
      toggleList()
    }
  }

  return (
    <>
      {
        opened &&
        <div onClick={toggleList} className={styles.closeLayer} />
      }
      <div className={selectClassNames}>
        <button onClick={toggleList} className={styles.select}>
          <Typography fontSize={14}>
            { label || placeholder }
          </Typography>
          <ArrowIcon />
        </button>
        <div className={styles.dropdown}>
          { optionsList }
        </div>
      </div>
    </>
  )
}

export default Select