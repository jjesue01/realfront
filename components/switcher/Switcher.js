import React from "react";
import styles from './Switcher.module.sass'
import cn from "classnames";

function Switcher({ className, name, value, size = 'default', onChange }) {

  const btnClassNames = cn(
    className,
    styles.root,
    {
      [styles.active]: value,
      [styles.small]: size === 'small'
    }
  )

  function handleClick() {
    onChange({ target: { name, value: !value } })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={btnClassNames}>
      <span />
    </button>
  )
}

export default Switcher