import React from 'react'
import styles from './input.module.sass'
import cn from 'classnames'

export function Input({value, onChange, name, type="text", className, label, error, errorText}) {
  return (
    <div className={cn(className , styles.inputContainer)}>
        <label htmlFor={name}>{label}</label>
        <div>
          <input
            type={type}
            id={name}
            name={name}
            className={cn(styles.input, {[styles.errorInput] : error})}
            value={value}
            onChange={onChange}
          />
          <p className={styles.errorText}>{errorText}</p>
        </div>
      </div>
  )
}