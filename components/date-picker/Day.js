import React from "react";
import styles from './DatePicker.module.sass'
import cn from "classnames";

function Day({ date, inactiveMonth }) {
  return (
    <div className={cn(styles.day, { [styles.inactiveMonth]: inactiveMonth })}>
      { date.getDate() }
    </div>
  )
}

export default Day