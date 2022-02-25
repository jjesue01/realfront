import React, { useState } from "react";
import styles from './FilterWrapper.module.sass'
import cn from "classnames";

function FilterWrapper({ className, title, onApply, onClose = () => {}, children, mode, active = false }) {
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
      <div className={cn(className, styles.root, { [styles.opened]: opened })}>
        <button onClick={toggleFilter} className={cn(styles.btnFilter, { [styles.active]: opened || active })}>
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
        {
          opened &&
          <div onClick={handleClose} className={styles.closeLayer} />
        }
      </div>
    </>
  )
}

export default FilterWrapper