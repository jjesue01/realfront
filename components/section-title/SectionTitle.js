import React from 'react'
import styles from './SectionTitle.module.sass'
import cn from "classnames";

function SectionTitle({ className, children, center = false }) {
  return (
    <h2 className={cn(className, styles.root, { [styles.center]: center })}>
      { children }
    </h2>
  )
}

export default SectionTitle