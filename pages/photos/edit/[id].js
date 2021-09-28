import React from "react";
import styles from '../../../styles/CreateItem.module.sass'
import Head from "next/head";
import Form from "../../../components/photos/form/Form";

function EditItem() {
  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - Edit 366 Madison Ave</title>
      </Head>
      <Form mode="edit" />
    </main>
  )
}

export default EditItem