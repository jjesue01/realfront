import React, { useState } from "react";
import styles from './FilterWrapper.module.sass'
import cn from "classnames";

function FilterWrapper({ className, title, onApply, onClose = () => {}, children, mode }) {
  const [opened, setOpened] = useState(false)

  function toggleFilter() {
    setOpened(prevState => !prevState)
  }

  function handleApply() {
    onApply()
    toggleFilter()
  }

  function handleClose() {
    toggleFilter()
    onClose()
  }

  if (mode === 'flat')
    return (
      <div className={cn(className, styles.content)}>
        { children }
      </div>
    )

  return (
    <>
      {
        opened &&
          <div onClick={handleClose} className={styles.closeLayer} />
      }
      <div className={cn(className, styles.root, { [styles.opened]: opened })}>
        <button onClick={toggleFilter} className={styles.btnFilter}>
          { title }
        </button>
        <div className={styles.dropdown}>
          <div className={styles.content}>
            { children }
          </div>
          <div className={styles.actions}>
            <button onClick={handleApply} className={styles.btnApply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterWrapper