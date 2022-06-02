import React from "react";
import styles from './SkeletonBox.module.sass'
import cn from "classnames";

function SkeletonBox({ className, loading }) {
  return (
    <div className={cn(className, styles.root, { [styles.opened]: loading })}>
      <div className={styles.gradient} />
    </div>
  )
}

export default SkeletonBox