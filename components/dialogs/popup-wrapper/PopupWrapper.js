import React, { useRef, useEffect } from 'react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import styles from './PopupWrapper.module.sass'
import cn from "classnames";

function PopupWrapper({ className, opened, onClose, children }) {
  const containerRef = useRef()

  useEffect(function toggleScrollLock() {
    if (containerRef.current)
      if (opened)
        disableBodyScroll(containerRef.current)
      else
        enableBodyScroll(containerRef.current)

    return function clear() {
      clearAllBodyScrollLocks();
    }
  }, [opened])

  return (
    <div className={cn(styles.root, { [styles.opened]: opened })}>
      <div onClick={onClose} className={styles.closeLayer} />
      <div ref={ containerRef } className={cn(className, styles.container)}>
        <button className={styles.btnClose} onClick={onClose} />
        { children }
      </div>
    </div>
  )
}

export default PopupWrapper