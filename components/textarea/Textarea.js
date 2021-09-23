import React from "react";
import styles from './Textarea.module.sass'
import cn from "classnames";

function Input({
  className,
  name,
  value,
  onChange,
  placeholder,
  label,
  required,
  subLabel
}) {

  return (
    <div className={cn(className, styles.root, { [styles.label]: label })}>
      {
        label &&
        <label htmlFor={name}>
          { label }
        </label>
      }
      {
        subLabel &&
          <p>
            { subLabel }
          </p>
      }
      <textarea
        id={name}
        className={styles.textarea}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}/>
    </div>
  )
}

export default Input