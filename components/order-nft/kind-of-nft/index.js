import React, {useEffect, useRef, useState} from "react";
import styles from './index.module.sass'
import Typography from "../../Typography";
import Card from "../card";
import Image from 'next/image'

const items = [
  {
    value: 'Photography',
    imgUrl: '/images/order-photo.png',
    width: 43,
    height: 47
  },
  {
    value: 'Video',
    imgUrl: '/images/order-video.png',
    width: 56,
    height: 62
  },
  {
    value: '3D Virtual Tour',
    imgUrl: '/images/order-3d.png',
    width: 48,
    height: 37
  },
]

function KindOfNft() {
  const [currentValue, setCurrentValue] = useState(items[0].value)

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
            className={styles.card}
            checkmarkClassName={styles.checkmark}
            onClick={handleClick(item.value)}
            active={item.value === currentValue}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.imgUrl}
                width={item.width}
                height={item.height}
                alt={item.value} />
            </div>
            <Typography
              fontWeight={600}
              fontSize={16}
              lHeight={20}>
              { item.value }
            </Typography>
          </Card>
        ))
      }
    </div>
  )
}

export default KindOfNft