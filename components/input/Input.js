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
  iconRight,
  required,
  subLabel
}) {
  const inputClassNames = cn(
    styles.input,
    {
      [styles.small]: size === 'small',
      [styles.iconRight]: !!iconRight
    }
  )

  return (
    <div className={cn(className, styles.inputContainer, { [styles.label]: label })}>
      {
        label &&
        <label htmlFor={name}>
          { label }
        </label>
      }
      {
        subLabel &&
          <p>{subLabel}</p>
      }
      <div className={styles.inputWrapper}>
        <input
          id={name}
          className={inputClassNames}
          type={type}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          placeholder={placeholder}/>
        { iconRight }
      </div>
    </div>
  )
}

export default Input