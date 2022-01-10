import React from "react";
import styles from '/styles/Admin.module.sass'
import Input from "../../components/input/Input";
import {useFormik} from "formik";
import Button from "../../components/button/Button";
import {useDispatch} from "react-redux";
import {setAdmin} from "../../features/auth/authSlice";
import {useRouter} from "next/router";
import Head from "next/head";
import {useAdminLoginMutation} from "../../services/admin";

function Admin() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [adminLogin] = useAdminLoginMutation()
  const { values, ...formik } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: handleSubmit
  })

  function handleSubmit(values, { setSubmitting }) {
    adminLogin(values).unwrap()
      .then(({ token }) => {
        dispatch(setAdmin({ hasAccess: true, token }))
        router.push('/admin/invites')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <form onSubmit={formik.handleSubmit} className={styles.root}>
      <Head>
        <title>HOMEJAB - Admin</title>
      </Head>
      <h1>Sign in</h1>
      <Input
        type="email"
        name="email"
        value={values.email}
        onChange={formik.handleChange}
        required
        label="Email" />
      <Input
        type="password"
        className={styles.formField}
        name="password"
        value={values.password}
        onChange={formik.handleChange}
        required
        label="Password" />
      <Button className={styles.btnSubmit} loading={formik.isSubmitting} htmlType="submit">
        Sign in
      </Button>
    </form>
  )
}

export default Admin