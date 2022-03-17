import React, {useState} from "react";
import styles from './index.module.sass'
import Textarea from "../../textarea/Textarea";
import pageStyles from "../../../styles/OrderNFT.module.sass";
import Button from "../../button/Button";

function Details({ data, onNext }) {
  const [details, setDetails] = useState(data.details)

  function handleChange({ target: { value } }) {
    setDetails(value)
  }

  function handleNext() {
    onNext({ details })
  }

  return (
    <div className={styles.root}>
      <Textarea
        value={details}
        onChange={handleChange}
        label="Details" />
      <Button onClick={handleNext} className={pageStyles.btnContinue}>
        Continue
      </Button>
    </div>
  )
}

export default Details