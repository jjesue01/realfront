import React from "react";
import styles from './Button.module.sass'
import cn from'classnames'

function Button({ className, children, type = 'accent', htmlType = 'button', onClick }) {

  const buttonClassNames = cn(
    className,
    styles.button,
    {
      [styles.buttonAccent]: type === 'accent',
      [styles.buttonOutlined]: type === 'outlined',
    }
  )

  return (
    <button className={buttonClassNames} onClick={onClick} type={htmlType}>
      { children }
    </button>
  )
}

export default Button