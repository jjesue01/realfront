import React from 'react'
import styles from './CreateCongratulation.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Image from "next/image";
import ButtonCircle from "../../button-circle/ButtonCircle";

function CreateCongratulation({ opened, onClose, name, imageUrl }) {
  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          Done
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={600}
          lHeight={17}
          align="center"
          margin={'32px 0 0'}
          color={'#000000'}>
          Great! You just created - {name}
        </Typography>
        <div className={styles.imageWrapper}>
          {
            imageUrl &&
              <Image src={imageUrl} layout="fill" objectFit="cover" alt={name} />
          }
        </div>
        <div className={styles.share}>
          <Typography
            fontSize={14}
            fontWeight={600}
            lHeight={17}
            align="center"
            color={'#000000'}>
            Share
          </Typography>
          <div className={styles.buttons}>
            <ButtonCircle>
              <Image src="/icons/fb.svg" width={9} height={18} alt="facebook" />
            </ButtonCircle>
            <ButtonCircle>
              <Image src="/icons/twitter.svg" width={20} height={20} alt="twitter" />
            </ButtonCircle>
            <ButtonCircle>
              <Image src="/icons/tg.svg" width={22} height={22} alt="telegram" />
            </ButtonCircle>
            <ButtonCircle>
              <Image src="/icons/link.svg" width={22} height={22} alt="link" />
            </ButtonCircle>
          </div>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default CreateCongratulation