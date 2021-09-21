import React from 'react'
import styles from './TradingHistory.module.sass'
import Typography from "../../Typography";

function TradingHistory() {
  return (
    <div className={styles.root}>
      <Typography tag="h3" fontSize={20} lHeight={24} fontWeight={600}>
        Trading history
      </Typography>
    </div>
  )
}

export default TradingHistory