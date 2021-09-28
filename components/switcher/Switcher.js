import React from "react";
import styles from './Switcher.module.sass'
import cn from "classnames";

function Switcher({ className, name, value, onChange }) {

  function handleClick() {
    onChange({ target: { name, value: !value } })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(className, styles.root, { [styles.active]: value })}>
      <span />
    </button>
  )
}

export default Switcher