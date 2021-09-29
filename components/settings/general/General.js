import React from "react";
import styles from './General.module.sass'
import Input from "../../input/Input";
import Textarea from "../../textarea/Textarea";
import CopyIcon from "../../../public/icons/copy.svg";

function General({ onChange, values }) {
  return (
    <div className={styles.root}>
      <Input
        name="walletAddress"
        value={values.walletAddress}
        onChange={onChange}
        iconRight={
          <button className={styles.btnCopy} type="button">
            <CopyIcon />
          </button>
        }
        label="Your wallet address" />
      <Input
        className={styles.field}
        name="username"
        value={values.username}
        onChange={onChange}
        label="Username" />
      <Input
        className={styles.field}
        type="email"
        name="email"
        value={values.email}
        onChange={onChange}
        label="Email" />
      <Textarea
        className={styles.field}
        name="bio"
        value={values.bio}
        onChange={onChange}
        placeholder="Enter your bio"
        label="Bio" />
    </div>
  )
}

export default General