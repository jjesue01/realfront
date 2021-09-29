import React, { useState } from "react";
import styles from '../styles/Settings.module.sass'
import Head from "next/head";
import Typography from "../components/Typography";
import Tabs from "../components/tabs/Tabs";
import General from "../components/settings/general/General";
import Button from "../components/button/Button";
import Notifications from "../components/settings/notifications/Notifications";

const tabs = ['general', 'notification settings']

function Settings() {
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [general, setGeneral] = useState({
    walletAddress: '0xa364b0313123c06fb410b69a648b900a66008815',
    username: 'John Doe',
    email: 'test@gmail.com',
    bio: ''
  })
  const [notifications, setNotifications] = useState({
    itemSold: false,
    bidActivity: false,
    priceChange: false,
    auctionExpiration: false,
    outbid: false,
    referralSuccessful: false,
    ownedUpdates: false,
    successfulPurchase: false,
    newsletter: false,
  })

  function handleTabChange({ target: { value } }) {
    setCurrentTab(value)
  }

  function handleGeneralChange({ target: { name, value } }) {
    setGeneral(prevGeneral => ({
      ...prevGeneral,
      [name]: value
    }))
  }

  function handleNotificationsChange({ target: { name, checked } }) {
    setNotifications(prevGeneral => ({
      ...prevGeneral,
      [name]: checked
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()

    alert('nice!')
  }

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - My Account Settings</title>
      </Head>
      <div className="border-wrapper">
        <div className="container">
          <div className={styles.content}>
            <Typography tag="h1" fontSize={36} fontWeight={600} lHeight={44}>
              Settings
            </Typography>
            <Tabs
              className={styles.tabs}
              name="currentTab"
              value={currentTab}
              onChange={handleTabChange}
              tabs={tabs} />
            <form onSubmit={handleSubmit}>
              {
                currentTab === 'general' ?
                  <General
                    values={general}
                    onChange={handleGeneralChange} />
                    :
                  <Notifications
                    values={notifications}
                    onChange={handleNotificationsChange} />
              }
              <Button className={styles.btnSubmit} htmlType="submit">
                Save
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Settings