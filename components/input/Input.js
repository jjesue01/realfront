import React from "react";
import styles from './Input.module.sass'
import cn from "classnames";

function Input({ className, name, value, type, onChange, placeholder, label }) {
  return (
    <div className={cn(className, styles.inputContainer)}>
      <input
        className={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}/>
    </div>
  )
}

export default Input