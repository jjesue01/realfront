import React from "react";
import styles from './AspectRatioBox.module.sass'
import cn from "classnames";

function AspectRatioBox({ className, children }) {
  return (
    <div className={cn(className, styles.root)}>
      { children }
    </div>
  )
}

export default AspectRatioBox