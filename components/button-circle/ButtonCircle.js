import React from 'react'
import styles from './ButtonCircle.module.sass'
import cn from "classnames";

function ButtonCircle({ className, onClick, tag = 'button', children }) {
  const Tag = tag;

  return (
    <Tag onClick={onClick} className={cn(className, styles.root)} type="button">
      { children }
    </Tag>
  )
}

export default ButtonCircle