import React from "react";
import styles from './Timer.module.sass'
import cn from "classnames";
import Typography from "../../../Typography";

function Timer({ className, date }) {
  return (
    <div className={cn(className, styles.root)}>
      <div className={styles.content}>
        <Typography
          fontWeight={600}
          fontSize={12}
          lHeight={15}
          color={'#878D97'}>
          Sale Ends
        </Typography>
        <Typography
          fontWeight={600}
          fontSize={14}
          lHeight={17}
          margin={'8px 0 0'}>
          November 17, 2021 at 10:pm EET
        </Typography>
      </div>
      <div className={styles.timer}>

      </div>
    </div>
  )
}

export default Timer