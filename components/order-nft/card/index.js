import React from "react";
import styles from './index.module.sass'
import cn from "classnames";

import CheckMarkIcon from '/public/icons/checkmark.svg'

function Card({ className, checkmarkClassName, children, onClick, active }) {
  return (
    <div onClick={onClick} className={cn(className, styles.root, { [styles.active]: active })}>
      { children }
      <span className={cn(checkmarkClassName, styles.checkmark)}>
       <CheckMarkIcon />
      </span>
    </div>
  )
}

export default Card