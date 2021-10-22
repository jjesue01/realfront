import React from "react";
import styles from './Input.module.sass'
import cn from "classnames";
import {getMoneyView} from "../../utils";

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
  subLabel,
  urlPrefix,
  error,
  errorText,
  disabled,
  ...otherProps
}, ref) {

  const inputClassNames = cn(
    styles.input,
    {
      [styles.small]: size === 'small',
      [styles.iconRight]: !!iconRight,
      [styles.withUrlPrefix]: urlPrefix,
      [styles.price]: type === 'price',
      [styles.error]: error
    }
  )

  function getType() {
    let result = type

    if (type === 'price') result = 'number'
    if (type === 'url') result = 'text'

    return result
  }

  return (
    <div className={cn(className, styles.inputContainer, { [styles.label]: label, [styles.disabled]: disabled })}>
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
        {
          urlPrefix &&
            <p className={styles.urlPrefix}>{urlPrefix}</p>
        }
        {
          type === 'price' &&
          <p className={styles.currency}>usd</p>
        }
        <input
          ref={ref}
          id={name}
          className={inputClassNames}
          type={getType()}
          name={name}
          value={value}
          onWheel={(e) => e.target.blur()}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          { ...otherProps } />
        { iconRight }
        {
          error && errorText &&
          <p className={styles.errorText}>{ errorText }</p>
        }
      </div>
    </div>
  )
}

export default React.forwardRef(Input)