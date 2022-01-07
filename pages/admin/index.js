import React from "react";
import styles from '/styles/Admin.module.sass'
import Input from "../../components/input/Input";
import {useFormik} from "formik";
import {useRouter} from "next/router";
import Button from "../../components/button/Button";

function Admin() {
  const router = useRouter()
  const { values, ...formik } = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: handleSubmit
  })

  function handleSubmit(values, { setSubmitting }) {
    router.push('/admin/invites')
  }

  return (
    <form onSubmit={formik.handleSubmit} className={styles.root}>
      <h1>Sign in</h1>
      <Input
        name="username"
        value={values.username}
        onChange={formik.handleChange}
        required
        label="Username" />
      <Input
        type="password"
        className={styles.formField}
        name="password"
        value={values.password}
        onChange={formik.handleChange}
        required
        label="Password" />
      <Button className={styles.btnSubmit} htmlType="submit">
        Sign in
      </Button>
    </form>
  )
}

export default Admin