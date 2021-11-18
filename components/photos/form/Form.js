import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from './Form.module.sass'
import { useFormik } from "formik";
import * as Yup from 'yup'
import Typography from "../../Typography";
import Input from "../../input/Input";
import Select from "../../select/Select";
import Button from "../../button/Button";
import Textarea from "../../textarea/Textarea";
import FileUploader from "./file-uploader/FileUploader";
import Image from "next/image";
import ButtonCircle from "../../button-circle/ButtonCircle";
import PenIcon from '/public/icons/pen.svg'
import DoneCongratulation from "../../dialogs/done-congratulation/DoneCongratulation";
import {useRouter} from "next/router";
import {citiesApi, useCreateCityMutation} from "../../../services/cities";
import {
  listingsApi,
  useCreateListingMutation,
  useDeleteListingMutation,
  useUpdateListingMutation
} from "../../../services/listings";
import {buildPlace, decodeTags, encodeTags, getImageUrl, scrollToTop} from "../../../utils";
import {useLoadScript} from "@react-google-maps/api";
import {useDispatch, useSelector} from "react-redux";
import FullscreenLoader from "../../fullscreen-loader/FullscreenLoader";
import Error from "../../error/Error";
import cn from "classnames";

const selectOptions = [
  {
    label: 'Ethereum',
    value: 'ethereum'
  },
  {
    label: 'Bitcoin',
    value: 'bitcoin'
  },
]

const libraries = ['places']

function Form({ mode }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDlqMYs6_uXvpAVJkVBf4hsUywAFVo5GBA',
    libraries,
    language: 'en'
  })
  const user = useSelector(state => state.auth.user)
  const [createListing, { isLoading }] = useCreateListingMutation()
  const [updateListing] = useUpdateListingMutation()
  const [deleteListing] = useDeleteListingMutation()
  const [createCity] = useCreateCityMutation()
  const [isDeleting, setDeleting] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [jpgFile, setJpgFile] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const [jpgFilePreview, setJpgFilePreview] = useState(null)
  const [location, setLocation] = useState({})
  const [id, setId] = useState(null)
  const [listing, setListing] = useState({})
  const [listingError, setListingError] = useState({})
  const { setValues, errors, touched, ...formik } = useFormik({
    initialValues: {
      name: '',
      address: '',
      description: '',
      tags: '',
      blockchain: 'ethereum',
      city: {
        label: '',
        value: ''
      }
    },
    validate: handleValidate,
    onSubmit: handleSubmit
  });
  const inputRef = useRef()
  const autocompleteRef = useRef()
  const ownItem = listing?.owner ? listing.owner === user?._id : listing?.creator?.ID === user?._id
  const isReseller = mode === 'edit' && listing?.tokenID

  function handleFileJPGChange(file) {
    if (file !== null) {
      setJpgFile(file)
      setJpgFilePreview(getImageUrl(file))
    }
  }

  function handleFileRAWChange(file) {
    setRawFile(file)
  }

  function handleCloseCongratulations() {
    router.push(`/photos/${id}`)
  }

  function handleValidate(values) {
    const errors = {}

    if (!values.name) errors.name = 'Name is required'
    if (!values.address) errors.address = 'Address is required'
    if (!values.city.value) errors.city = 'City is required'

    if (mode === 'create' && !location.latitude && !!values.address)
      errors.address = 'Please, select your address from list'

    return errors
  }

  const getCities = useCallback(async (value) => {
    return dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value }))
  }, [dispatch])

  function handleSubmit(values, { setSubmitting }) {
    if (jpgFile !== null && rawFile !== null){
      const data = {
        ...values,
        file: jpgFile,
        raw: rawFile,
        tags: decodeTags(values.tags),
        city: values.city.value,
        ...location
      }

      if (mode === 'create') {
        createListing(data).unwrap()
          .then(result => {
            setListing(result)
            setId(result._id)
            setIsCreated(true)
          })
          .catch(result => {
            console.log(result)
            setSubmitting(false)
          })
      } else {
        data.id = router.query.id
        updateListing(data).unwrap()
          .then(result => {
            router.push(`/photos/${router.query.id}`)
          })
          .catch(error => {
            setSubmitting(false)
          })
      }
    } else {
      scrollToTop()
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    const contractApi = require('/services/contract')

    setDeleting(true)

    try {
      if (listing?.isPublished)
        await contractApi.revokeSell(listing.tokenID, user.walletAddress)

      deleteListing(router.query.id).unwrap()
        .then(result => {
          router.push('/profile')
        })
        .catch(result => {
          setDeleting(false)
        })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(function initListing() {
    if (mode === 'edit' && router.query.id) {
      dispatch(listingsApi.endpoints.getListingById.initiate(router.query.id))
        .then(({ data, error }) => {
          if (data) {
            setListing(data)
            setValues({
              name: data.name,
              address: data.address,
              description: data.description,
              tags: encodeTags(data.tags),
              blockchain: data.blockchain,
              city: {
                label: data?.city?.name || '',
                value: data?.city?.ID || ''
              }
            })
            setJpgFile(data.thumbnail)
            setRawFile(data.rawFileName)
          } else {
            setListingError(error.data)
          }
      })
    }
  }, [mode, router.query.id, dispatch, setValues, getCities])

  useEffect(function initAutocomplete() {
    if (isLoaded && mode === 'create') {
      const handlePlaceChange = async () => {
        const { geometry, formatted_address, address_components } = autocompleteRef.current.getPlace()
        let city = { label: '', value: '' }
        const parsedPlace = buildPlace(address_components)
        const searchCity = `${parsedPlace.city}, ${parsedPlace.state}`

        const { data: cities } = await getCities(searchCity)

        if (cities?.length) {
          city = cities.find(({ label }) => searchCity === label)
          if (!city) city = cities[0]
        } else if (!!parsedPlace.city) {
          const cityData = {
            name: searchCity,
            geoLocation: {
              type: 'Point',
              coordinates: [geometry.location.lng(), geometry.location.lat()]
            }
          }

          const result = await createCity(cityData).unwrap()
          city = {
            label: result?.name || '',
            value: result?._id || ''
          }
          console.log('add city')
        }

        setValues(prevValues => ({
          ...prevValues,
          address: formatted_address,
          city
        }))
        setLocation({
          latitude: geometry.location.lat(),
          longitude: geometry.location.lng()
        })
      }

      const options = {
        componentRestrictions: { country: "us" },
        fields: ["address_components", "formatted_address", "geometry"],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options)
      autocompleteRef.current.addListener("place_changed", handlePlaceChange)
    }
  }, [createCity, getCities, isLoaded, mode, setValues])

  if (listingError.message)
    return <Error errorCode={'Listing' + listingError.message} />

  if (mode === 'edit' && listing.name && !ownItem)
    return <Error errorCode={'ListingNoAccess' } />

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Typography
          tag="h1"
          fontSize={36}
          fontWeight={600}
          lHeight={44}>
          {
            mode === 'edit' ?
              `Edit ${listing.name}`
              :
              'Create new item'
          }
        </Typography>
        <div className={styles.uploadSection}>
          <Typography
            fontWeight={600}
            fontSize={16}
            lHeight={20}>
            Upload a photo
          </Typography>
          <Typography
            fontFamily={'Lato'}
            fontSize={14}
            lHeight={22}
            margin={'10px 0 0'}
            color={'rgba(55, 65, 81, 0.8)'}>
            File types supported: JPG, RAW. Max size: 40 Mb
          </Typography>
          <div className={styles.uploaders}>
            <div className={styles.uploader}>
              <FileUploader
                onChange={handleFileJPGChange}
                accept=".jpg,.jpeg"
                disabled={isReseller}
                error={jpgFile === null && touched.name}>
                { 
                  jpgFile === null ?
                    <div className={styles.uploaderContainer}>
                      <Image src="/images/form-jpg.svg" width={50} height={50} alt="jpg file" />
                      <Typography fontSize={20} fontWeight={600} lHeight={24} margin={'24px 0 0'}>
                        Upload JPG file
                      </Typography>
                      <p className={styles.uploaderText}>
                        Drag & drop file or <span>browse media on your device</span>
                      </p>
                    </div>
                    :
                    <div className={styles.imageContainer}>
                      <Image
                        src={jpgFilePreview !== null ? jpgFilePreview : jpgFile}
                        layout="fill"
                        objectFit={'cover'}
                        alt="nft item" />
                      {
                        !isReseller &&
                        <ButtonCircle className={styles.btnEdit}>
                          <PenIcon />
                        </ButtonCircle>
                      }
                    </div>
                }
              </FileUploader>
            </div>
            <div className={styles.uploader}>
              <FileUploader
                onChange={handleFileRAWChange}
                accept=".raw"
                disabled={isReseller}
                error={rawFile === null && touched.name}>
                <div className={styles.uploaderContainer}>
                  <Image src="/images/form-raw.svg" width={50} height={50} alt="raw file" />
                  <Typography fontSize={20} fontWeight={600} lHeight={24} margin={'24px 0 0'}>
                    { rawFile === null ? 'Upload RAW file' : (rawFile?.name || rawFile )}
                  </Typography>
                  {
                    rawFile === null &&
                    <p className={styles.uploaderText}>
                      Drag & drop file or <span>browse media on your device</span>
                    </p>
                  }
                  {
                    rawFile !== null && !isReseller &&
                    <ButtonCircle className={styles.btnEdit}>
                      <PenIcon />
                    </ButtonCircle>
                  }
                </div>
              </FileUploader>
            </div>
          </div>
        </div>
        <Input
          className={styles.input}
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          placeholder="Item name"
          required
          error={errors.name}
          errorText={errors.name && touched.name}
          label="Name*" />
        <Input
          ref={inputRef}
          className={cn(styles.input, { [styles.readOnly]: isReseller })}
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          placeholder="Enter address"
          required
          error={errors.address && touched.address}
          errorText={errors.address}
          readOnly={isReseller}
          label="Address*" />
        <Input
          className={styles.input}
          name="location"
          value={formik.values.city.label}
          required
          readOnly
          error={errors.city && touched.city}
          errorText={errors.city}
          label="City*" />
        <Textarea
          className={styles.input}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          placeholder="Provide a detailed description of your photo"
          subLabel="The description will be included on the photo's detail page underneath it"
          label="Description" />
        <Input
          className={styles.input}
          name="tags"
          value={formik.values.tags}
          onChange={formik.handleChange}
          placeholder="e.g. #Aerial, #Ground, #Residential etc."
          label="Add tags" />
        <Select
          className={styles.input}
          name="blockchain"
          options={selectOptions}
          value={formik.values.blockchain}
          onChange={formik.handleChange}
          label="Blockchain" />
        <div className={styles.actions}>
          {
            mode === 'create' ?
              <Button htmlType="submit" loading={formik.isSubmitting}>
                Create
              </Button>
              :
              <Button className={styles.btnSave} htmlType="submit" loading={formik.isSubmitting}>
                Save
              </Button>
          }
          {
            mode === 'edit' &&
              <Button onClick={handleDelete} className={styles.btnDelete} type="outlined" loading={isDeleting}>
                Delete item
              </Button>
          }
        </div>
      </form>
      <DoneCongratulation
        imageUrl={jpgFile !== null && jpgFilePreview}
        message={`Great! You just created - ${formik.values.name}`}
        opened={isCreated}
        listing={listing}
        hasShare={false}
        onClose={handleCloseCongratulations} />
      <FullscreenLoader opened={(mode === 'edit' && !listing.name)} />
    </div>
  )
}

export default Form