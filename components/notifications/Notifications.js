import React, {useEffect, useRef, useState} from "react";
import styles from './Notifications.module.sass'
import Image from "next/image";
import Typography from "../Typography";
import {useDispatch, useSelector} from "react-redux";
import {removeNotification} from "../../features/notifications/notificationsSlice";
import {getMoneyView} from "../../utils";

function Notifications() {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.notifications)
  const [currentNotification, setNotification] = useState({})
  const notificationRef = useRef()

  function buildNotification(data) {
    let result = {
      image: data.image,
      id: data.id
    }

    switch (data.event) {
      case 'priceChange': {
        result.title = 'Price Changed!'
        result.content = <p><span>{data.name}</span>&apos;s price changed from <span>{getMoneyView(data.oldPrice)}</span> to <span>{getMoneyView(data.newPrice)}</span></p>
        break;
      }
      case 'successfulPurchase': {
        result.title = 'Successful Purchase!'
        result.content = <p>Congratulations! You just bought <span>{data.name}</span> for <span>{getMoneyView(data.price)}</span></p>
        break;
      }
      case 'itemSold': {
        result.title = 'Item has been sold!'
        result.content = <p><span>{data.name}</span> has been sold for <span>{getMoneyView(data.price)}</span></p>
        break;
      }
      default:
        result = {}
    }
    return result
  }

  function handleTransitionEnd(e) {
    if (+notificationRef.current.style.opacity === 0) {
      dispatch(removeNotification())
      setNotification({})
      notificationRef.current.style.transform = 'translateY(110%)'
    }
  }

  useEffect(function manageNotifications() {
    if (notifications.length !== 0 && !currentNotification.id) {
      setNotification(buildNotification(notifications[0]))

      notificationRef.current.style.transform = 'translateY(0)'
      notificationRef.current.style.opacity = 1

      setTimeout(() => {
        notificationRef.current.style.opacity = 0
      }, 6000)
    }
  }, [notifications, currentNotification])

  return (
    <div ref={notificationRef} className={styles.root} onTransitionEnd={handleTransitionEnd}>
      <div className={styles.imageWrapper}>
        {
          currentNotification.image &&
            <Image src={currentNotification.image} layout="fill" objectFit="cover" alt="NFT item" />
        }
      </div>
      <div className={styles.content}>
        <Typography tag="h6" fontSize={14} fontWeight={600}>
          {currentNotification.title}
        </Typography>
        {currentNotification.content}
      </div>
    </div>
  )
}

export default Notifications