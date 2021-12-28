import React, {useEffect, useState} from "react";
import styles from './TimePicker.module.sass'
import cn from "classnames";

function TimePicker({ name, value, onChange }) {
  const [time, setTime] = useState({
    hours: 4,
    minutes: 30,
    mode: 'pm'
  })

  function handleChangeTime(field, value) {
    return function () {
      const { hours, minutes, mode } = { ...time, [field]: value }
      const timeStr = `${hours}:${('0' + minutes).slice(-2)} ${mode.toUpperCase()}`
      onChange({ target: { name, value: timeStr } })
    }
  }

  useEffect(function initValue() {
    const splitValue = value.toLowerCase().split(':')

    const hours = +splitValue[0]
    const minutes = parseInt(splitValue[1])
    const mode = splitValue[1].endsWith('am') ? 'am' : 'pm'

    setTime({ hours, minutes, mode })
  }, [value])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <p>Select time</p>
        <div className={styles.modes}>
          {
            ['am', 'pm'].map(value => (
              <button
                key={value}
                className={cn(styles.mode, { [styles.active]: time.mode === value })}
                type="button"
                onClick={handleChangeTime('mode', value)}>
                { value }
              </button>
            ))
          }
        </div>
      </div>
      <div className={styles.timeContainer}>
        <div className={styles.numbers}>
          {
            Array.from({length: 12}, (_, i) => i + 1)
              .map(item => (
                <button
                  onClick={handleChangeTime('hours', item)}
                  className={cn(styles.btnNumber, { [styles.active]: item === time.hours })}
                  key={item}
                  type="button">
                  { item }
                </button>
              ))
          }
        </div>
        <div className={styles.numbers}>
          {
            Array.from({length: 12}, (_, i) => i * 5)
              .map(item => (
                <button
                  onClick={handleChangeTime('minutes', item)}
                  className={cn(styles.btnNumber, { [styles.active]: item === time.minutes })}
                  key={item}
                  type="button">
                  { ('0' + item).slice(-2) }
                </button>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default TimePicker