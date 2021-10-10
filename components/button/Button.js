import React from "react";
import styles from './Button.module.sass'
import cn from'classnames'
import Loader from "../loader/Loader";

function Button({
  className,
  children,
  type = 'accent',
  htmlType = 'button',
  onClick,
  loading = false,
  disabled = false }) {

  const buttonClassNames = cn(
    className,
    styles.button,
    {
      [styles.buttonAccent]: type === 'accent',
      [styles.buttonOutlined]: type === 'outlined',
      [styles.disabled]: disabled,
      [styles.loading]: loading
    }
  )

  return (
    <button className={buttonClassNames} onClick={onClick} type={htmlType}>
      { !loading && children }
      <Loader
        className={styles.loader}
        opened={loading}
        color={type === 'outlined' ? 'accent' : 'default'} />
    </button>
  )
}

export default Button