import React from "react";
import Head from "next/head";
import styles from '../styles/Leaderboard.module.sass'
import { useGetLeaderBoardQuery } from "../services/listings";
import cn from 'classnames'


const Leaderboard = () => {
  const {data : leaderboard} = useGetLeaderBoardQuery();
  console.log(leaderboard);

  return (
    <main className={styles.root}>
      <Head>
        <title>Leaderboard - real NFT marketplace</title>
      </Head>
      <section>
          <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colUsername)}>
                    <p>Username</p>
                  </div>
                  <div className={cn(styles.col, styles.colPrice)}>
                    <p>Floor Price</p>
                  </div>
                  <div className={cn(styles.col, styles.colItems)}>
                    <p>Items</p>
                  </div>
              </div>
              
              <div className={styles.tableBody}>
                 {/* { rowsList } */}
              </div>
            </div>
          </div>
      </section>
    </main>
  )
  
}

export default Leaderboard;