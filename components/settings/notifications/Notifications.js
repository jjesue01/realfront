import React from "react";
import styles from './Notifications.module.sass'
import Typography from "../../Typography";
import {notificationItems} from "../fixtures";
import Checkbox from "../../checkbox/Checkbox";

function Notifications({ values, onChange }) {

  const itemsList = notificationItems.map(item => (
    <div key={item.name} className={styles.item}>
      <Checkbox
        onChange={onChange}
        name={item.name}
        checked={values[item.name]}
        label={
          <>
            <Typography
              tag="span"
              fontWeight={600}
              fontSize={14}
              lHeight={17}>
              { item.title }
            </Typography>
            <Typography
              tag="span"
              fontFamily={'Lato'}
              fontSize={12}
              lHeight={14}
              color={'rgba(55, 65, 81, 0.8)'}
              margin={'4px 0 0'}>
              { item.description }
            </Typography>
          </>
        } />
    </div>
  ))

  return (
    <div className={styles.root}>
      <Typography fontFamily={'Lato'} fontSize={14} lHeight={22} color={'rgba(55, 65, 81, 0.8)'}>
        Select which notifications you would like to receive for 0xa364...8815
      </Typography>
      <div className={styles.items}>
        { itemsList }
      </div>
    </div>
  )
}

export default Notifications