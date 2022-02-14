import React, {useEffect, useState} from "react";
import styles from './Timer.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";
import {countDownTime, getFormattedEndTime} from "../../../../utils";

const TimeBox = ({ label, value }) => (
  <div className={styles.timeBox}>
    <p className={styles.timeBoxValue}>
      { value < 10 ? '0' + value : value }
    </p>
    <p className={styles.timeBoxTitle}>
      { label }
    </p>
  </div>
)

function Timer({ className, endDate, onEnd = () => {} }) {
  const [timerData, setTimerData] = useState(null)

  useEffect(function initTimer() {
    if (!!endDate) {
      const timer = countDownTime(endDate)
      setTimerData(timer)

      if (!timer) {
        onEnd()
      }

      const interval = setInterval(() => {
        const timer = countDownTime(endDate)
        setTimerData(timer)

        if (!timer) {
          onEnd()
          clearInterval(interval)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate])

  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.content}>
        {
          timerData !== null &&
          <Typography
            fontWeight={600}
            fontSize={12}
            lHeight={15}
            color={'#878D97'}>
            Sale Ends
          </Typography>
        }
        <Typography
          fontWeight={600}
          fontSize={14}
          lHeight={17}
          margin={'8px 0 0'}>
          {
            timerData !== null ?
              getFormattedEndTime(endDate)
              :
              'Bids are closed, waiting for user’s confirmation'
          }
        </Typography>
      </div>
      {
        timerData !== null &&
        <div className={styles.timer}>
          <TimeBox label="hours" value={timerData.hours} />
          <TimeBox label="min" value={timerData.minutes} />
          <TimeBox label="sec" value={timerData.seconds} />
        </div>
      }
    </div>
  )
}

export default Timer