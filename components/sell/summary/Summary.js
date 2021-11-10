import React from 'react'
import styles from './Summary.module.sass'
import Typography from "../../Typography";
import Button from "../../button/Button";


function Summary({ loading, royalty, marketplaceFee }) {
  return (
    <div className={styles.summary}>
      <Typography fontWeight={600} fontSize={20} lHeight={24}>
        Summary
      </Typography>
      <div className={styles.hr} />
      <Typography fontWeight={600} fontSize={16} lHeight={20}>
        Fees
      </Typography>
      <Typography
        fontFamily={'Lato'}
        fontSize={14}
        lHeight={22}
        color={'rgba(55, 65, 81, 0.8)'}
        margin={'16px 0 0'}>
        Listing is free! At the time of the sale, the following fees will be deducted.
      </Typography>
      <div className={styles.fee}>
        <p>To Home Jab</p>
        <div className={styles.feeLine} />
        <span>{marketplaceFee}%</span>
      </div>
      {
        !!royalty &&
        <div className={styles.fee}>
          <p>Royalty</p>
          <div className={styles.feeLine} />
          <span>{royalty}%</span>
        </div>
      }
      <div className={styles.fee}>
        <p>Total</p>
        <div className={styles.feeLine} />
        <span>{marketplaceFee + royalty}%</span>
      </div>
      <Button className={styles.btnSubmit} htmlType="submit" loading={loading}>
        Post your listing
      </Button>
    </div>
  )
}

export default Summary