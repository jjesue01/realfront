import React from "react";
import styles from './Tooltip.module.sass'
import cn from "classnames";

function Tooltip({ className, opened, direction = 'top', children, content }) {
  const rootClassNames = cn(
    className,
    styles.root,
    styles[direction],
    {
      [styles.manual]: opened !== undefined,
      [styles.opened]: opened
    }
  )

  return (
    <span className={rootClassNames}>
      { children }
      <span className={styles.tooltip}>
        { content }
      </span>
    </span>
  )
}

export default Tooltip