import React from "react";
import styles from './DatePicker.module.sass'
import Calendar from "../calendar/Calendar";
import Day from "./Day";

function DatePicker() {
  return (
    <div className={styles.root}>
      <Calendar
        dayComponent={Day}
        year={2021}
        month={12}
        withNeighbors
        daysOfWeek
      />
    </div>
  )
}

export default DatePicker