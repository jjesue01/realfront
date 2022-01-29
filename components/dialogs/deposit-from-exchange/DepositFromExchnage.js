import React from "react";
import styles from './DepositFromExchnage.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Input from "../../input/Input";
import {useSelector} from "react-redux";
import Button from "../../button/Button";
import InfoIcon from '/public/icons/info.svg'
import Tooltip from "../../tooltip/Tooltip";
import ButtonCopy from "../../button-copy/ButtonCopy";

function DepositFromExchange({ opened, onClose, onDone }) {
  const { walletAddress } = useSelector(state => state.auth.user)

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          tag="h2"
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          Deposit from an exchange
        </Typography>
        <Typography
          tag="div"
          className={styles.infoText}
          fontFamily={'Lato'}
          fontSize={14}
          lHeight={22}
          color={'rgba(55, 65, 81, 0.8)'}
          margin={'20px 0 0'}
          align="center">
          Deposit ETH from your <span className={styles.accent}>exchange</span>
          <Tooltip
            className={styles.info}
            direction="bottom"
            content={<p>An exchange allows individuals to trade cryptocurrencies. Compatible crypto exchanges include <span>Coinbase</span>, <span>Gemini</span>, <span>Kraken</span>, <span>eToro</span>, and many other exchanges.</p>}>
            <InfoIcon />
          </Tooltip> to the following address:
        </Typography>
        <Input
          className={styles.input}
          value={walletAddress}
          iconRight={
            <ButtonCopy className={styles.btnCopy} value={walletAddress} />
          }
          readOnly />
        <Typography
          fontFamily={'Lato'}
          fontSize={14}
          lHeight={22}
          color={'rgba(55, 65, 81, 0.8)'}
          margin={'32px 0 0'}
          align="center">
          Only send ETH or any other ERC-20 token to this address
        </Typography>
        <div className={styles.actions}>
          <Button onClick={onClose} type="outlined">
            Back
          </Button>
          <Button onClick={onDone}>
            I’ve made my deposit
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default DepositFromExchange