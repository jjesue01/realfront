import React from "react";
import styles from './General.module.sass'
import Input from "../../input/Input";
import Textarea from "../../textarea/Textarea";
import CopyIcon from "../../../public/icons/copy.svg";
import ButtonCopy from "../../button-copy/ButtonCopy";

function General({ onChange, values, errors }) {
  return (
    <div className={styles.root}>
      <Input
        name="walletAddress"
        value={values.walletAddress}
        onChange={onChange}
        readOnly
        iconRight={
          <ButtonCopy className={styles.btnCopy} value={values.walletAddress} />
        }
        label="Your wallet address" />
      <Input
        className={styles.field}
        name="username"
        value={values.username}
        onChange={onChange}
        error={errors.username}
        errorText={errors.username}
        label="Username" />
      <Input
        className={styles.field}
        type="email"
        name="email"
        value={values.email}
        onChange={onChange}
        error={errors.email}
        errorText={errors.email}
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