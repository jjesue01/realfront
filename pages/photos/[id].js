import React from "react";
import styles from '../../styles/PhotoDetails.module.sass'
import PhotoInfo from "../../components/photos/details/info/PhotoInfo";
import TradingHistory from "../../components/photos/details/trading-history/TradingHistory";
import MoreFromCollection from "../../components/photos/details/more/MoreFromCollection";

function PhotoDetails() {
  return (
    <main className={styles.root}>
      <div className={styles.content}>
        <PhotoInfo />
        <TradingHistory />
        <MoreFromCollection />
      </div>
    </main>
  )
}

export default PhotoDetails