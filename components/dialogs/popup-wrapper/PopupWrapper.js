import React from 'react'
import styles from './PopupWrapper.module.sass'
import cn from "classnames";

function PopupWrapper({ className, opened, onClose, children }) {
  return (
    <div className={cn(styles.root, { [styles.opened]: opened })}>
      <div onClick={onClose} className={styles.closeLayer} />
      <div className={cn(className, styles.container)}>
        { children }
      </div>
    </div>
  )
}

export default PopupWrapper