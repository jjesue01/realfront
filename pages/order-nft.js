import React, {useState} from "react";
import styles from '../styles/OrderNFT.module.sass'
import Head from "next/head";
import ButtonCircle from "../components/button-circle/ButtonCircle";
import Typography from "../components/Typography";
import ArrowShort from '/public/icons/arrow-short.svg'
import cn from "classnames";
import KindOfNft from "../components/order-nft/kind-of-nft";
import TypeOfPhotos from "../components/order-nft/type-of-photos";
import WhatIsIt from "../components/order-nft/what-is-it";
import Location from "../components/order-nft/location";
import Details from "../components/order-nft/details";
import ContactChannel from "../components/order-nft/contact-channel";
import {useCreateOrderMutation} from "../services/misc";
import FullscreenLoader from "../components/fullscreen-loader/FullscreenLoader";
import PopupWrapper from "../components/dialogs/popup-wrapper/PopupWrapper";
import Button from "../components/button/Button";
import {useRouter} from "next/router";

const tabs = [
  {
    title: 'What kind of NFT do you want?',
    component: <KindOfNft />
  },
  {
    title: 'What type of photos (videos)?',
    component: <TypeOfPhotos />
  },
  {
    title: 'What is it?',
    component: <WhatIsIt />
  },
  {
    title: 'What is the location?',
    subTitle: 'Input exact address or city/state',
    component: <Location />
  },
  {
    title: 'Provide more details about location and shot needed',
    subTitle: 'Optional',
    component: <Details />
  },
  {
    title: 'Where should we send your quote?',
    component: <ContactChannel />
  },
]

function OrderNft() {
  const router = useRouter()
  const [createOrder] = useCreateOrderMutation()
  const [isLoading, setLoading] = useState(false)
  const [isDialogOpened, setDialogOpened] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({
    resource: 'Photography',
    type: 'Ground',
    object: 'Historical Landmark',
    location: '',
    details: '',
    contactMethod: 'Email',
    contactInfo: ''
  })

  function handleChangeStep(direction) {
    return function () {
      setActiveTab(prevState => prevState + direction)
    }
  }

  function handleDone(data) {
    setLoading(true)

    const result = { ...formData, ...data }

    const body = {
      type: result.resource,
      isAerial: result.type === 'Aerial',
      object: result.object,
      location: result.location,
      details: result.details,
      contactMethod: result.contactMethod,
      contactInfo: result.contactInfo
    }

    createOrder(body).unwrap()
      .then(() => {
        setDialogOpened(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleNext(data = {}) {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }))
    handleChangeStep(1)()
  }

  function handleCloseDialog() {
    setDialogOpened(false)
    router.push('/')
  }

  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - Order Custom NFT</title>
      </Head>
      <div className={styles.navigation}>
        <p>
          Step <span>{activeTab + 1}</span>/6
        </p>
        <div className={styles.steps}>
          {
            tabs.map((t, index) => (
              <button
                key={index}
                onClick={handleChangeStep(index - activeTab)}
                className={cn(styles.step, { [styles.stepActive]: index <= activeTab })} />
            ))
          }
        </div>
      </div>
      <div className={styles.content}>
        <div className="container">
          <div className={styles.titleContainer}>
            {
              activeTab > 0 &&
              <ButtonCircle
                onClick={handleChangeStep(-1)}
                className={styles.btnBack}>
                <ArrowShort />
              </ButtonCircle>
            }
            <div className={styles.titleContent}>
              <Typography fontWeight={600} fontSize={24} lHeight={36}>
                { tabs[activeTab].title }
              </Typography>
              {
                tabs[activeTab].subTitle &&
                <Typography fontWeight={500} fontSize={16} lHeight={20} margin="13px 0 0">
                  { tabs[activeTab].subTitle }
                </Typography>
              }
            </div>
          </div>
          {
            React.cloneElement(
              tabs[activeTab].component,
              {
                data: formData,
                onNext: handleNext,
                onDone: handleDone,
              })
          }
        </div>
      </div>
      <FullscreenLoader opened={isLoading} />
      <PopupWrapper
        className={styles.dialog}
        opened={isDialogOpened}
        onClose={handleCloseDialog}>
        <Typography
          fontWeight={600}
          fontSize={24}
          lHeight={29}>
          Done
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={14}
          maxWidth={430}
          align={'center'}
          margin={'20px 0 0'}
          lHeight={22}>
          We will respond to your request as soon as possible
        </Typography>
        <Button onClick={handleCloseDialog} className={styles.btnOk}>
          Ok
        </Button>
      </PopupWrapper>
    </main>
  )
}

export default OrderNft