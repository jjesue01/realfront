import React from 'react'
import styles from './ButtonCircle.module.sass'
import cn from "classnames";

function ButtonCircle({ className, onClick, children }) {
  return (
    <button onClick={onClick} className={cn(className, styles.root)} type="button">
      { children }
    </button>
  )
}

export default ButtonCircle