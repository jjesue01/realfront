import React, {useEffect, useRef, useState} from "react";
import styles from './Toasts.module.sass'
import Typography from "../Typography";
import {useDispatch, useSelector} from "react-redux";
import {removeToast} from "../../features/toasts/toastsSlice";
import cn from "classnames";

function Toasts() {
  const dispatch = useDispatch()
  const toasts = useSelector(state => state.toasts)
  const [currentToast, setToast] = useState({})
  const toastRef = useRef()

  const toastClassNames = cn(
    styles.root,
    styles[currentToast?.type]
  )

  function handleTransitionEnd(e) {
    if (+toastRef.current.style.opacity === 0) {
      dispatch(removeToast())
      setToast({})
      toastRef.current.style.transform = 'translate(-50%, -151px)'
    }
  }

  useEffect(function manageToasts() {
    if (toasts.length !== 0 && !currentToast.id) {
      setToast({ id: Date.now(), ...toasts[0] })

      toastRef.current.style.transform = 'translate(-50%, 0)'
      toastRef.current.style.opacity = 1

      setTimeout(() => {
        toastRef.current.style.opacity = 0
      }, 6000)
    }
  }, [toasts, currentToast])

  return (
    <div
      ref={toastRef}
      className={toastClassNames}
      onTransitionEnd={handleTransitionEnd}>
      <Typography
        fontWeight={600}
        align="center"
        fontSize={16}>
        { currentToast.message }
      </Typography>
    </div>
  )
}

export default Toasts