import React, {useEffect, useRef, useState} from "react";
import styles from './Toasts.module.sass'
import Image from "next/image";
import Typography from "../Typography";
import {useDispatch, useSelector} from "react-redux";
import {removeNotification} from "../../features/notifications/notificationsSlice";
import {removeToast} from "../../features/toasts/toastsSlice";

function Toasts() {
  const dispatch = useDispatch()
  const toasts = useSelector(state => state.toasts)
  const [currentToast, setToast] = useState({})
  const toastRef = useRef()


  function handleTransitionEnd(e) {
    if (+toastRef.current.style.opacity === 0) {
      dispatch(removeToast())
      setToast({})
      toastRef.current.style.transform = 'translateY(110%)'
    }
  }

  useEffect(function manageToasts() {
    if (toasts.length !== 0 && !currentToast.id) {
      setToast(toasts[0])

      toastRef.current.style.transform = 'translateY(0)'
      toastRef.current.style.opacity = 1

      setTimeout(() => {
        toastRef.current.style.opacity = 0
      }, 6000)
    }
  }, [toasts, currentToast])

  return (
    <div ref={toastRef} className={styles.root} onTransitionEnd={handleTransitionEnd}>

    </div>
  )
}

export default Toasts