import React, {useEffect} from "react";
import styles from './MakeOffer.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Input from "../../input/Input";
import Button from "../../button/Button";
import {useFormik} from "formik";

function MakeOffer({ opened, onClose, onOffer, listing }) {
  const { errors, touched, setValues, ...formik } = useFormik({
    initialValues: {
      price: 0
    },
    validate: handleValidate,
    onSubmit: handleSubmit
  })
  const listingPrice = listing?.price

  function handleValidate(values) {
    const errors = {}

    if (!values.price) errors.price = 'Price is required'
    if (!!values.price && values.price <= listingPrice) errors.price = 'Price must be more than listing price'

    return errors
  }

  function handleSubmit(values, { setSubmitting, resetForm }) {
    onOffer(values.price)
      .then(() => {
        // resetForm()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(function initPrice() {
    if (listingPrice) {
      setValues({ price: listingPrice + 1 })
    }
  }, [listingPrice, setValues])

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <form className={styles.dialog} onSubmit={formik.handleSubmit}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          Make an offer
        </Typography>
        <Input
          className={styles.input}
          type="price"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          label="Price*"
          required
          error={errors.price && touched.price}
          errorText={errors.price}
          placeholder="Enter a price" />
        <Button className={styles.btnMakeOffer} htmlType="submit" loading={formik.isSubmitting}>
          Make offer
        </Button>
      </form>
    </PopupWrapper>
  )
}

export default MakeOffer