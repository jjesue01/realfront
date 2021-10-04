import React from "react";
import styles from './BuyWithCard.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Button from "../../button/Button";

function BuyWithCard({ opened, onClose }) {
  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          tag="h2"
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          Buy with card
        </Typography>
        <div className={styles.widgetContainer}>

        </div>
        <div className={styles.actions}>
          <Button onClick={onClose} type="outlined">
            Back
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default BuyWithCard