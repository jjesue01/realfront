import React from "react";
import styles from './ConfirmationDialog.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Button from "../../button/Button";
import cn from "classnames";

function ConfirmationDialog({ opened, onClose, onSubmit, title, message, btnSubmitTitle = 'Delete', wide = false }) {

  function handleSubmit() {
    onSubmit()
    onClose()
  }

  return (
    <PopupWrapper
      className={cn(styles.root, { [styles.wide]: wide })}
      opened={opened}
      onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          maxWidth={360}
          margin={'0 auto'}
          align="center">
          { title }
        </Typography>
        {
          wide ?
            <Typography
              fontFamily="Lato"
              fontSize={14}
              lHeight={22}
              align="center"
              margin={'20px auto 0'}
              maxWidth={427}
              color={'rgba(55, 65, 81, 0.8)'}>
              { message }
            </Typography>
            :
            <Typography
              fontSize={14}
              fontWeight={600}
              lHeight={17}
              align="center"
              margin={'32px auto 0'}
              maxWidth={427}
              color={'#000000'}>
              { message }
            </Typography>
        }
        <div className={styles.actions}>
          {
            !wide &&
            <Button onClick={onClose}>
              Close
            </Button>
          }
          <Button onClick={handleSubmit} type={wide ? 'accent' : 'outlined'}>
            { btnSubmitTitle }
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmationDialog