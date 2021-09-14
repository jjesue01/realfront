import React from "react";
import styles from './Input.module.sass'
import cn from "classnames";

function Input({
  className,
  name,
  value,
  type = 'text',
  onChange,
  placeholder,
  label,
  size = 'default',
  iconRight
}) {
  const inputClassNames = cn(
    styles.input,
    {
      [styles.small]: size === 'small',
      [styles.iconRight]: !!iconRight
    }
  )

  return (
    <div className={cn(className, styles.inputContainer)}>
      <div className={styles.inputWrapper}>
        <input
          className={inputClassNames}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}/>
        { iconRight }
      </div>
    </div>
  )
}

export default Input