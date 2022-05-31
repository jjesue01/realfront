import React from 'react'
import styles from './button.module.sass'
import cn from 'classnames'

export function Button({children, htmlType = "button" , onClick, className, disabled = false}) {
  return (
    <button 
      className={cn(className,styles.button, {[styles.disabled] : disabled})} 
      onClick={onClick}
      type={htmlType}
    >
      {children}
    </button>
  )
}