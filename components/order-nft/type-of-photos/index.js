import React, {useState} from "react";
import Image from "next/image";

import styles from './index.module.sass'
import Card from "../card";
import Typography from "../../Typography";

const items = [
  {
    value: 'Ground',
    imgUrl: '/images/order-ground.png',
    width: 41,
    height: 45
  },
  {
    value: 'Aerial',
    imgUrl: '/images/order-aerial.png',
    width: 37,
    height: 37
  },
]

function TypeOfPhotos() {
  const [currentValue, setCurrentValue] = useState('Ground')

  function handleClick(value) {
    return function () {
      setCurrentValue(value)
    }
  }

  return (
    <div className={styles.root}>
      {
        items.map(item => (
          <Card
            key={item.value}
            onClick={handleClick(item.value)}
            className={styles.card}
            checkmarkClassName={styles.checkmark}
            active={currentValue === item.value}>
            <div className={styles.imageWrapper}>
              <Image src={item.imgUrl} width={item.width} height={item.height} alt={item.value} />
            </div>
            <Typography
              fontWeight={600}
              fontSize={18}>
              { item.value }
            </Typography>
          </Card>
        ))
      }
    </div>
  )
}

export default TypeOfPhotos