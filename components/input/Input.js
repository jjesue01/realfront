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
  subLabel,
  urlPrefix,
  usdRate = 3166.41,
  error,
  errorText,
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
        {
          urlPrefix &&
            <p className={styles.urlPrefix}>{urlPrefix}</p>
        }
        {
          type === 'price' &&
          <p className={styles.currency}>eth</p>
        }
        <input
          ref={ref}
          id={name}
          className={inputClassNames}
          type={type === 'price' || type === 'url' ? 'text' : type}
          name={name}
          value={value}
          onWheel={(e) => e.target.blur()}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          { ...otherProps } />
        { iconRight }
        {
          type === 'price' &&
            <p className={styles.usd}>{`($${new Intl.NumberFormat('ru-RU').format(+value * usdRate || 0)})`}</p>
        }
        {
          error && errorText &&
          <p className={styles.errorText}>{ errorText }</p>
        }
      </div>
    </div>
  )
}

export default React.forwardRef(Input)