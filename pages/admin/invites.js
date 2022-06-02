import React from "react";
import Head from "next/head";
import styles from '/styles/Admin.module.sass'
import {useFormik} from "formik";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import {useSendInviteMutation} from "../../services/admin";

function Invites() {
  const [sendInvite] = useSendInviteMutation()
  const { values, ...formik } = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: handleSubmit
  });

  function handleSubmit(values, { setSubmitting, resetForm }) {
    sendInvite(values.email).unwrap()
      .then(() => {
        resetForm()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <form onSubmit={ formik.handleSubmit }>
      <Head>
        <title>HOMEJAB - Admin. Invites</title>
      </Head>
      <Input
        type="email"
        name="email"
        value={values.email}
        label="Email"
        placeholder="Email to invite"
        required
        onChange={formik.handleChange} />
      <Button className={styles.btnSubmit} htmlType="submit" loading={formik.isSubmitting}>
        Send
      </Button>
    </form>
  )
}
export default Invites