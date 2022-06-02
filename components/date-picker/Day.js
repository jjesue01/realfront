import React from "react";
import styles from './DatePicker.module.sass'
import cn from "classnames";
import {dateToString} from "../../utils";

function Day({ date, inactiveMonth, name, value, onChange, past }) {

  const dayClassNames = cn(
    styles.day,
    {
      [styles.inactiveMonth]: inactiveMonth,
      [styles.active]: dateToString(date) === value,
      [styles.disabled]: past
    }
  )

  function handleClick() {
    onChange({ target: { name, value: dateToString(date) } })
  }

  return (
    <div className={dayClassNames} onClick={handleClick}>
      <div className={styles.circle} />
      <p>{ date.getDate() }</p>
    </div>
  )
}

export default Day