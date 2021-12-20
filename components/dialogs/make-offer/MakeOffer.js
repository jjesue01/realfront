import React, {useEffect, useState} from "react";
import styles from './MakeOffer.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import Input from "../../input/Input";
import Button from "../../button/Button";
import {useFormik} from "formik";
import Checkbox from "../../checkbox/Checkbox";

function MakeOffer({ opened, onClose, onOffer, listing, maxBidPrice, title, btnTitle }) {
  const [checked, setChecked] = useState(false)
  const { errors, touched, setValues, ...formik } = useFormik({
    initialValues: {
      price: 0,
    },
    validate: handleValidate,
    onSubmit: handleSubmit
  })
  const listingPrice = !!maxBidPrice ? maxBidPrice : listing?.price;

  function getDefaultPrice() {
    return listing?.bid?.highestBidder ? listingPrice + 1 : listingPrice
  }

  function handleValidate(values) {
    const errors = {}

    if (!values.price) errors.price = 'Price is required'
    if (!!values.price && values.price <= listingPrice) {
      if (listing?.bid?.highestBidder)
        errors.price = 'Price must be more than last bid price'
      else if (values.price < listingPrice)
        errors.price = 'Price must be more or equal than starting price'
    }
    if (!checked) errors.terms = 'You need to check it'

    return errors
  }

  function toggleCheckbox() {
    setChecked(prevState => !prevState)
  }

  function handleClose() {
    if (formik.isSubmitting) return;
    onClose()
    setValues({ price: getDefaultPrice()})
    setChecked(false)
  }

  function handleSubmit(values, { setSubmitting, resetForm }) {
    onOffer(values.price)
      .then(() => {
        // resetForm()
        setChecked(false)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(function initPrice() {
    if (listingPrice) {
      setValues({ price: listing?.bid?.highestBidder ? listingPrice + 1 : listingPrice })
    }
  }, [listing, listingPrice, setValues])

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={handleClose}>
      <form className={styles.dialog} onSubmit={formik.handleSubmit}>
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          { title }
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
        <Checkbox
          className={styles.checkbox}
          checked={checked}
          label={<>By checking this box, I agree to Home Jab&apos;s <span>Terms of Service</span></>}
          onChange={toggleCheckbox} />
        <Button
          className={styles.btnMakeOffer}
          htmlType="submit"
          disabled={!checked}
          loading={formik.isSubmitting}>
          { btnTitle }
        </Button>
      </form>
    </PopupWrapper>
  )
}

export default MakeOffer