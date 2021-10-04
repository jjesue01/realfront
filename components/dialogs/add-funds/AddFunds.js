import React from "react";
import styles from './AddFunds.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import ExchangeIcon from '/public/icons/exchange.svg'
import CardIcon from '/public/icons/credit-card.svg'

function AddFunds({ opened, onClose, onExchange, onBuy }) {

  function handleExchange() {
    onExchange()
  }

  function handleBuy() {
    onBuy()
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          tag="h2"
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          Add ETH to your wallet
        </Typography>
        <Typography
          fontFamily={'Lato'}
          fontSize={14}
          lHeight={22}
          color={'rgba(55, 65, 81, 0.8)'}
          margin={'20px 0 0'}
          align="center">
          Select one of the options to deposit ETH to your wallet
        </Typography>
        <div className={styles.actions}>
          <button onClick={handleExchange} className={styles.btnBuy}>
            <span>
              <ExchangeIcon />
            </span>
            <p>Deposit from an exchange</p>
          </button>
          <button onClick={handleBuy} className={styles.btnBuy}>
            <span>
              <CardIcon />
            </span>
            <p>Buy with card</p>
          </button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default AddFunds