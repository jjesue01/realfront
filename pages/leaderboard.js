import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from '../styles/Leaderboard.module.sass'
import { useGetLeaderBoardQuery } from "../services/listings";
import cn from 'classnames'
import ArrowShortIcon from './../public/icons/arrow-sort.svg'
import { getSortedArray } from "../utils";
import Link from "next/link";

const RowDetails = ({item, index}) => {

  return (
  <Link href={`/profile/${item.name}`} passHref>
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colUsername)}>
        <span className={styles.index}>{index + 1}</span>
        <p>{item.name}</p>
      </div>
      <div className={cn(styles.col, styles.colPrice)}>
        <p>{ item.floorPrice }</p>
      </div>
      <div className={cn(styles.col, styles.colItems)}>
        <p>{ item.items }</p>
      </div>
    </div>
  </Link>
  )
}

const Leaderboard = () => {
  const [sortOrder, setSortOrder] = useState(false);
  const [activeSortTab, setActiveSortTab] = useState('');
  const [sortItems, setSortItems] = useState();
  const {data : leaderboard} = useGetLeaderBoardQuery({sort : `${activeSortTab}:${sortOrder ? 'desc' : "asc"}`});

  const rowsList = sortItems?.map((item, index) => (
    <RowDetails key={item._id} item={item} index={index}/>
  ))

  const onChangeActiveTab = (tab) => {
    setActiveSortTab(tab);
    if (activeSortTab === tab) setSortOrder(prev => !prev);
    else setSortOrder(false);
  }

  useEffect(() => {
    setSortItems(leaderboard);
  }, [leaderboard])

  return (
    <main className={styles.root}>
      <Head>
        <title>Leaderboard - real NFT marketplace</title>
      </Head>
      <section className={styles.container}>
          <div className={styles.description}>
            <div className={styles.title}>Top NFTs</div>
            <div className={styles.subtitle}>The top NFTs on real marketplace, ranked by volume, floor price and othen statistics</div>
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                  <div className={cn(styles.col, styles.colUsername)} onClick={() => onChangeActiveTab('name')}>
                    <p>Username</p>
                    {
                    activeSortTab === 'name' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
                  <div className={cn(styles.col, styles.colPrice)} onClick={() => onChangeActiveTab('price')}>
                    <p>Floor Price</p>
                    {
                    activeSortTab === 'price' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
                  <div className={cn(styles.col, styles.colItems)} onClick={() => onChangeActiveTab('items')}>
                    <p>Items</p>
                    {
                    activeSortTab === 'items' && 
                    <div className={cn(styles.icon)}>
                      <ArrowShortIcon className={cn({[styles.iconActive] : sortOrder})}/>
                    </div>
                    }
                  </div>
              </div>
              
              <div className={styles.tableBody}>
                 { rowsList }
              </div>
            </div>
          </div>
      </section>
    </main>
  )
  
}

export default Leaderboard;