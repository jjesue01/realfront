import React from "react";
import styles from './SignUp.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Input from "../../input/Input";
import Button from "../../button/Button";
import {useFormik} from "formik";
import * as Yup from "yup";
import {escapeValue} from "../../../utils";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(5, 'It can’t be less than 5 characters')
    .max(30, 'It can’t be more than 30 characters')
    .required('Username is required'),
  email: Yup.string().required(`Email is required`),
})

function SignUp({ opened, onClose, onSignUp }) {
  const { values, errors, touched, setValues, ...formik } = useFormik({
    initialValues: {
      username: '',
      email: '',
    },
    validationSchema,
    onSubmit: handleSubmit
  })

  function handleClose() {
    if (formik.isSubmitting) return;
    onClose()
  }

  async function handleSubmit(values, { setSubmitting, resetForm }) {
    try {
      await onSignUp(values)
      setSubmitting(false)
      onClose()
      resetForm()
    } catch (error) {
      console.log(error)
    }
  }

  function handleChange({ target: { name, value } }) {
    let result = value;

    if (name === 'username') result = escapeValue(value)

    setValues(prevValues => ({
      ...prevValues,
      [name]: result
    }))
  }

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={handleClose}>
      <form className={styles.dialog} onSubmit={formik.handleSubmit}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          Sign up
        </Typography>
        <Input
          className={styles.input}
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username && touched.username}
          errorText={errors.username}
          required
          placeholder="Enter your username"
          label="Username*" />
        <Input
          className={styles.input}
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email && touched.email}
          errorText={errors.email}
          required
          placeholder="Enter your email"
          label="Email*" />
        <Button
          className={styles.btnSubmit}
          htmlType="submit"
          loading={formik.isSubmitting}>
          Continue
        </Button>
      </form>
    </PopupWrapper>
  )
}

export default SignUp