import React from "react";
import styles from '../../styles/CreateItem.module.sass'
import Head from "next/head";
import Form from "../../components/photos/form/Form";

function CreateItem() {
  return (
    <main className={styles.root}>
      <Head>
        <title>HOMEJAB - Create new item</title>
      </Head>
      <Form />
    </main>
  )
}

export default CreateItem