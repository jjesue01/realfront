import React from "react";
import styles from './MoreFromCollection.module.sass'
import Typography from "../../../Typography";
import PhotoItem from "../../../photo-item/PhotoItem";
import Button from "../../../button/Button";

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

function MoreFromCollection() {
  const itemsList = data.map((item) => (
    <PhotoItem
      className={styles.item}
      key={item.name}
      data={item}
      type="full" />
  ))

  return (
    <section className={styles.root}>
      <div className="container">
        <Typography fontSize={18} fontWeight={600} lHeight={22} color={'#000000'}>
          More from this collection
        </Typography>
        <div className={styles.items}>
          { itemsList }
        </div>
        <div className={styles.actions}>
          <Button className={styles.btnCollection} type="outlined">
            View Collection
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MoreFromCollection