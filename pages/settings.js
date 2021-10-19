import React, {useEffect, useState} from "react";
import styles from '../styles/Settings.module.sass'
import Head from "next/head";
import Typography from "../components/Typography";
import Tabs from "../components/tabs/Tabs";
import General from "../components/settings/general/General";
import Button from "../components/button/Button";
import Notifications from "../components/settings/notifications/Notifications";
import {useGetCurrentUserQuery, useUpdateUserMutation} from "../services/auth";
import FullscreenLoader from "../components/fullscreen-loader/FullscreenLoader";

const tabs = ['general', 'notification settings']

function Settings() {
  const { data: user } = useGetCurrentUserQuery()
  const [updateUser] = useUpdateUserMutation()
  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [general, setGeneral] = useState({
    walletAddress: '',
    username: '',
    email: '',
    bio: ''
  })
  const [notifications, setNotifications] = useState({
    itemSold: false,
    bidActivity: false,
    priceChange: false,
    auctionExpiration: false,
    outbid: false,
    referralSuccessful: false,
    ownedUpdate: false,
    successfulPurchase: false,
    newsLetter: false,
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

    const data = {
      ...general,
      notifications
    }

    setIsSubmitting(true)

    updateUser(data).unwrap()
      .then(result => {

      })
      .catch(result => {

      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  useEffect(function initUser() {
    if (user) {
      setGeneral({
        walletAddress: user.walletAddress,
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      })
      setNotifications({
        ...user.notifications
      })
    }
  }, [user])

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
              <Button className={styles.btnSubmit} htmlType="submit" loading={isSubmitting}>
                Save
              </Button>
            </form>
          </div>
        </div>
      </div>
      <FullscreenLoader opened={!user} />
    </main>
  )
}

export default Settings