import React, {useState} from "react";
import styles from './index.module.sass'
import Textarea from "../../textarea/Textarea";

function Details() {
  const [details, setDetails] = useState('')

  function handleChange({ target: { value } }) {
    setDetails(value)
  }

  return (
    <div className={styles.root}>
      <Textarea
        value={details}
        onChange={handleChange}
        label="Details" />
    </div>
  )
}

export default Details