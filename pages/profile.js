import React, { useState } from "react";
import styles from '../styles/Profile.module.sass'
import Head from "next/head";
import UserInfo from "../components/profile/user-info/UserInfo";
import cn from "classnames";
import Typography from "../components/Typography";
import PhotoItem from "../components/photo-item/PhotoItem";
import TradingHistory from "../components/profile/trading-history/TradingHistory";

const tabs = ['collected', 'created', 'favorited', 'activity']
const data = [
  {
    name: 'Item 1',
    address: 'New York, Manhattan',
    location: {
      lat: -31.56391,
      lng: 147.154312
    },
    collections: ['New York'],
    price: 2.59,
    resources: ['Photo'],
    types: ['Residential']
  },
  {
    name: 'Item 2',
    address: 'Wentworth Falls',
    location: {
      lat: -33.718234,
      lng: 150.363181
    },
    collections: ['New York'],
    price: 1.4,
    resources: ['Photo'],
    types: ['Residential']
  },
  {
    name: 'Item 3',
    address: 'Wentworth Falls',
    location: {
      lat: -33.727111,
      lng: 150.371124
    },
    collections: ['Los Angeles'],
    price: 0.453,
    resources: ['Photo'],
    types: ['Residential']
  },
]

function MyProfile() {
  const [currentTab, setCurrentTab] = useState('collected')

  const tabsList = tabs.map(tab => (
    <button
      key={tab}
      onClick={handleTabChange(tab)}
      className={cn(styles.tab, { [styles.tabActive]: tab === currentTab })}>
      { tab }
    </button>
  ))

  const itemsList = data.map((item) => (
    <PhotoItem
      key={item.name}
      data={item}
      type="full" />
  ))

  function handleTabChange(value) {
    return function () {
      setCurrentTab(value)
    }
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - My Profile</title>
      </Head>
      <UserInfo />
      <div className={styles.content}>
        <div className="container">
          <div className={styles.tabs}>
            { tabsList }
          </div>
          <div className={styles.filterControls}>

          </div>
          <div className={styles.tabContent}>
            {
              currentTab !== 'activity' ?
                <div className={styles.itemsContainer}>
                  <Typography fontSize={16} lHeight={20}>
                    3 items
                  </Typography>
                  <div className={styles.items}>
                    { itemsList }
                  </div>
                </div>
                :
                <TradingHistory />
            }
          </div>
        </div>
      </div>
    </main>
  )
}

export default MyProfile