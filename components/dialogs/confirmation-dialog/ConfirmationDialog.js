import React from "react";
import styles from './ConfirmationDialog.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Button from "../../button/Button";

function ConfirmationDialog({ opened, onClose, onSubmit, title, message, btnSubmitTitle = 'Delete' }) {

  function handleSubmit() {
    onSubmit()
    onClose()
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <div className={styles.dialog}>
        <Typography
          fontSize={24}
          fontWeight={600}
          lHeight={29}
          align="center">
          { title }
        </Typography>
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
        <div className={styles.actions}>
          <Button onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmit} type={'outlined'}>
            { btnSubmitTitle }
          </Button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default ConfirmationDialog