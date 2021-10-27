import React, {useCallback, useEffect, useState} from 'react'
import styles from './CreateCollection.module.sass'
import PopupWrapper from "../popup-wrapper/PopupWrapper";
import Typography from "../../Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import FileUploader from "../../photos/form/file-uploader/FileUploader";
import Input from "../../input/Input";
import Textarea from "../../textarea/Textarea";
import Button from "../../button/Button";
import Image from "next/image";
import PenIcon from "../../../public/icons/pen.svg";
import {
  citiesApi,
  useCreateCollectionMutation,
} from "../../../services/cities";
import Autocomplete from "../../autocomplete/Autocomplete";
import {useDispatch} from "react-redux";

function CreateCollection({ opened, onClose, onCreate }) {
  const dispatch = useDispatch()
  const [createCollection, { isLoading }] = useCreateCollectionMutation()
  const [cities, setCities] = useState([])
  const [logo, setLogo] = useState(null)
  const { errors, touched, ...formik } = useFormik({
    initialValues: {
      name: '',
      city: {
        label: '',
        value: ''
      },
      description: '',
    },
    validate: handleValidate,
    onSubmit: handleSubmit,
  });

  function handleLogoChange(file) {
    setLogo(file)
  }

  function handleValidate(values) {
    const errors = {}

    if (!values.name) errors.name = 'Name is required'
    if (!values.city.value) errors.city = 'City is required'

    return errors
  }

  const getCities = useCallback((value) => {
    dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value }))
      .then(({data}) => {
        setCities(data)
      })
  }, [dispatch])

  function handleSubmit(values, { setSubmitting, resetForm }) {
    if (logo !== null) {

      const data = {
        logo,
        ...values,
        city: values.city.value
      }

      createCollection(data).unwrap()
        .then(result => {
          setSubmitting(false)
          onCreate(result)
          onClose()
          resetForm()
          setLogo(null)
        })
        .catch(() => {
          setSubmitting(false)
        })
    } else {
      setSubmitting(false)
    }
  }

  useEffect(function initCities() {
    getCities('')
  }, [getCities])

  return (
    <PopupWrapper className={styles.root} opened={opened} onClose={onClose}>
      <form onSubmit={formik.handleSubmit} className={styles.dialog} autoComplete="chrome-off">
        <Typography fontWeight={600} fontSize={24} lHeight={29} align="center">
          Create collection
        </Typography>
        <div className={styles.logoField}>
          <Typography
            fontWeight={600}
            fontSize={16}
            lHeight={20}>
            Logo image*
          </Typography>
          <Typography
            fontFamily={'Lato'}
            fontSize={14}
            lHeight={22}
            margin={'10px 0 0'}
            color={'rgba(55, 65, 81, 0.8)'}>
            This image will also be used for navigation. 350 x 350 recommended.
          </Typography>
          <FileUploader
            className={styles.uploader}
            onChange={handleLogoChange}
            error={logo === null && touched.name}
            accept=".jpg,.jpeg,.png">
            {
              logo === null ?
                <Image src="/icons/image.svg" width={40} height={40} alt="logo" />
                :
                <div className={styles.imageWrapper}>
                  <Image src={URL.createObjectURL(logo)} layout="fill" objectFit="cover" alt="logo" />
                </div>
            }
            <div className={styles.editLogo}>
              <PenIcon /> Edit
            </div>
          </FileUploader>
        </div>
        <Autocomplete
          className={styles.input}
          name="city"
          onChange={formik.handleChange}
          label="City*"
          value={formik.values.city}
          required
          options={cities}
          error={errors.city && touched.city}
          errorText={errors.city}
          fetchOptions={getCities}
          placeholder="Enter city"  />
        <Input
          className={styles.input}
          name="name"
          onChange={formik.handleChange}
          label="Name*"
          value={formik.values.name}
          required
          error={errors.name && touched.name}
          errorText={errors.name}
          placeholder="e.g. New York, Manhattan"  />
        <Textarea
          className={styles.textarea}
          name="description"
          onChange={formik.handleChange}
          label="Description"
          value={formik.values.description}
          placeholder="Describe your collection"  />
        <Button className={styles.btnCreate} htmlType="submit" loading={formik.isSubmitting}>
          Create
        </Button>
      </form>
    </PopupWrapper>
  )
}

export default CreateCollection