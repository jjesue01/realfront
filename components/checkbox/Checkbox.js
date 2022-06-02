import React from "react";
import styles from './Checkbox.module.sass'
import cn from "classnames";
import CheckMarkIcon from '/public/icons/checkmark.svg'

function Checkbox({ className, checked, onChange, name, label, type = 'square' }) {
  return (
    <label className={cn(className, styles.root)}>
      {
        type === 'square' &&
        <div className={cn(styles.checkmark, { [styles.checked]: checked })}>
          <CheckMarkIcon />
        </div>
      }
      {
        type === 'circle' &&
          <div className={cn(styles.checkmarkCircle, { [styles.checkedCircle]: checked })}/>
      }
      <p>{ label }</p>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    </label>
  )
}

export default Checkbox