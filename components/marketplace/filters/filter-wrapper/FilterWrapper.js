import React, { useState } from "react";
import styles from './FilterWrapper.module.sass'
import cn from "classnames";

function FilterWrapper({ className, title, onApply, children }) {
  const [opened, setOpened] = useState(false)

  function toggleFilter() {
    setOpened(prevState => !prevState)
  }

  function handleApply() {
    onApply()
    toggleFilter()
  }

  return (
    <>
      {
        opened &&
          <div onClick={toggleFilter} className={styles.closeLayer} />
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