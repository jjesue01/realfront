import React, {useEffect, useState} from "react";
import styles from './DatePicker.module.sass'
import Calendar from "../calendar/Calendar";
import Day from "./Day";
import ButtonCircle from "../button-circle/ButtonCircle"
import ArrowShortSmall from '/public/icons/arrow-short-small.svg'

function DatePicker({ name, onChange, value, noPast }) {
  const [date, setDate] = useState(new Date())

  function handleChangeMonth(direction) {
    return function () {
      const updatedDate = new Date(date);
      updatedDate.setMonth(date.getMonth() + direction)
      setDate(updatedDate)
    }
  }

  function getCurrentMonth() {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  useEffect(function init() {
    setDate(new Date(value))
  }, [value])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <p>{getCurrentMonth()} </p>
        <div className={styles.actions}>
          <ButtonCircle onClick={handleChangeMonth(-1)}>
            <ArrowShortSmall />
          </ButtonCircle>
          <ButtonCircle onClick={handleChangeMonth(1)}>
            <ArrowShortSmall />
          </ButtonCircle>
        </div>
      </div>
      <Calendar
        dayComponent={Day}
        year={date.getFullYear()}
        month={date.getMonth() + 1}
        customData={{ value, onChange, name }}
        withNeighbors
        daysOfWeek 
        noPast={noPast}/>
    </div>
  )
}

export default DatePicker