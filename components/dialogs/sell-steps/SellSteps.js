import React from "react";
import styles from './SellSteps.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";

function SellSteps({ opened, onClose, onDone }) {
  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography tag="h3" fontSize={24} fontWeight={600} lHeight={29} align="center">
          Follow steps
        </Typography>
        <p className={styles.subTitle}>
          Your wallet balance is below <span>0.05 ETH</span>. The next steps require small transaction fees, so you may have to deposit additional funds to complete them.
        </p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.info}>
              <div className={styles.circleContainer}>
                <Typography fontSize={20} fontWeight={600}>
                  1
                </Typography>
                <svg viewBox="0 0 48 48" width={48} height={48} version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="21" strokeWidth={5} stroke="#1DC3A6" fill="none" />
                </svg>
              </div>
              <p className={styles.stepTitle}>
                Initialize your wallet
              </p>
              <div className={styles.stepStatus}>
                Waiting for initialization
              </div>
            </div>
            <p className={styles.stepDescription}>
              To get set up for selling on Home Jab for the first time, you must initialize your wallet, which requires a one-time gas fee.
            </p>
          </div>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default SellSteps