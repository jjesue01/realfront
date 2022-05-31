import React, {useEffect, useRef, useState} from "react";
import styles from './toasts.module.sass'
import cn from "classnames";

export function Toasts({text, type, removeToast}) {
  const [currentToast, setToast] = useState({})
  const toastRef = useRef()

  const toastClassNames = cn(
    styles.root,
    styles[type],
  )

  function handleTransitionEnd(e) {
    if (+toastRef.current.style.opacity === 0) {
      removeToast(type);
      setToast({})
      toastRef.current.style.transform = 'translate(-50%, -151px)'
    }
  }

  useEffect(function manageToasts() {
    if (!currentToast.id) {
      
      toastRef.current.style.transform = 'translate(-50%, -80px)'
      toastRef.current.style.opacity = 1

      setTimeout(() => {
        toastRef.current.style.opacity = 0
      }, 2000)
    }
  }, [currentToast])

  return (
    <div
      ref={toastRef}
      className={toastClassNames}
      onTransitionEnd={handleTransitionEnd}>
      <p className={styles.messageToast}>
        { text }
      </p>
    </div>
  )
}