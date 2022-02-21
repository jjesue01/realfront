import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from './Form.module.sass'
import { useFormik } from "formik";
import Typography from "../../Typography";
import Input from "../../input/Input";
import Select from "../../select/Select";
import Button from "../../button/Button";
import Textarea from "../../textarea/Textarea";
import FileUploader from "./file-uploader/FileUploader";
import Image from "next/image";
import ButtonCircle from "../../button-circle/ButtonCircle";
import PenIcon from '/public/icons/pen.svg'
import CrossIcon from '/public/icons/cross.svg'
import DoneCongratulation from "../../dialogs/done-congratulation/DoneCongratulation";
import {useRouter} from "next/router";
import {citiesApi, useCreateCityMutation} from "../../../services/cities";
import {
  listingsApi,
  useCreateListingMutation,
  useDeleteListingMutation,
  useUpdateListingMutation
} from "../../../services/listings";
import {
  buildPlace,
  decodeTags,
  encodeTags,
  getBlockchain,
  getFormattedFileFormats,
  getImageUrl,
  scrollToTop, switchNetwork
} from "../../../utils";
import {useLoadScript} from "@react-google-maps/api";
import {useDispatch, useSelector} from "react-redux";
import FullscreenLoader from "../../fullscreen-loader/FullscreenLoader";
import Error from "../../error/Error";
import cn from "classnames";
import MediaFile from "../../media-file/MediaFile";
import ConfirmationDialog from "../../dialogs/confirmation-dialog/ConfirmationDialog";
import Tabs from "../../tabs/Tabs";
import AspectRatioBox from "../../aspect-ratio-box/AspectRatioBox";
import {blockchainOptions} from "../../../fixtures";
import {pushToast} from "../../../features/toasts/toastsSlice";
import {getConfig} from "../../../app-config";

const libraries = ['places']

const RESOURCE_TYPES = ['Image', 'Video', '360 Tour']

const FORMATS = {
  'Image': {
    preview: ['.jpg'],
    raw: ['.raw', '.cr2', '.nef', '.arw', '.dng', '.raf', '.jpg']
  },
  'Video': {
    preview: ['.mp4', '.webm'],
    raw: ['.mp4', '.webm']
  },
  '360 Tour': {
    preview: ['.jpg'],
    raw: ['.jpg']
  },
}

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
  const [resourceType, setResourceType] = useState('Image')
  const [isDeleting, setDeleting] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [deleteConfirmationOpened, setDeleteConfirmation] = useState(false)
  const [filesForDelete, setFilesForDelete] = useState([])
  const [file, setFile] = useState([])
  const [rawFile, setRawFile] = useState([])
  const [filePreview, setFilePreview] = useState(null)
  const [tourPreviews, setTourPreviews] = useState([])
  const [location, setLocation] = useState({})
  const [id, setId] = useState(null)
  const [listing, setListing] = useState({})
  const [listingError, setListingError] = useState({})
  const isTour = resourceType.includes('360')
  const { setValues, errors, touched, ...formik } = useFormik({
    initialValues: {
      name: '',
      address: '',
      description: '',
      link360: '',
      tags: '',
      blockchain: 'binance_smart_chain',
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
  const isReseller = mode === 'edit' && listing?.tokenIds?.length !== 0

  function handleFileJPGChange(files) {
    if (files.length > 0 ) {
      if (isTour) {
        setFile(prevState => [...prevState, ...files])
        setTourPreviews(prevState => [
          ...prevState,
          ...[...files].map((item, index) => ({
            id: `${Date.now()}-${index}`,
            content: getImageUrl(item)
          }))
        ])
      } else {
        setFile([...files])
      }
      setFilePreview(files.length > 0 ? getImageUrl(files[0]) : null)
    }
  }

  function handleFileRAWChange(files) {
    if (files.length > 0)
      setRawFile([...files])
  }

  function handleResourceChange({ target: { value } }) {
    if (isReseller) return;

    const previewFormats = FORMATS[value].preview
    //const rawFormats = FORMATS[value].raw

    const formats = value === 'Video' ? previewFormats : [...previewFormats, '.jpeg']
    const updatedFiles = file.filter((item) =>
      formats.includes('.' + (item?.name ? item.name : item).split('.').reverse()[0]))

    setResourceType(value)

    switch (value) {
      case 'Image':
      case 'Video': {
        setFile(updatedFiles)
        setFilePreview(updatedFiles.length > 0 ? getImageUrl(updatedFiles[0]) : null)
        setRawFile([])
        setTourPreviews([])
        break;
      }
      case '360 Tour': {
        setFile(updatedFiles)
        setTourPreviews(
          [...updatedFiles].map((item, index) => ({
            id: `${Date.now()}-${index}`,
            content: getImageUrl(item)
          }))
        )
        setRawFile([])
        break;
      }
      default: {
        setFile([])
        setRawFile([])
      }
    }
  }

  function handleRemoveImage(index) {
    return function () {
      setFile(prevState => prevState.filter((item, i) => index !== i))
      setTourPreviews(prevState => prevState.filter((item, i) => index !== i))
      setFilesForDelete(prevState => [...prevState, tourPreviews[index]?.nftId || ''])
    }
  }

  function handleCloseCongratulations() {
    router.push(`/photos/${id}`)
  }

  function toggleDeleteConfirmation() {
    switchNetwork(listing.blockchain)
      .then(() => setDeleteConfirmation(prevState => !prevState))
  }

  function handleValidate(values) {
    const errors = {}

    if (!values.name) errors.name = 'Name is required'
    if (!values.address) errors.address = 'Address is required'
    if (!values.city.value) errors.city = 'City is required'
    if (isTour && !values.link360) errors.link360 = '360 Tour Link is required'

    if (mode === 'create' && !location.latitude && !!values.address)
      errors.address = 'Please, select your address from list'

    return errors
  }

  const getCities = useCallback(async (value) => {
    return dispatch(citiesApi.endpoints.getAutocompleteCities.initiate({ search: value }))
  }, [dispatch])

  function handleSubmit(values, { setSubmitting }) {
    if (file.length !== 0 && (rawFile.length !== 0 || isTour)) {
      const data = {
        ...values,
        file: file,
        raw: rawFile,
        tags: decodeTags(values.tags),
        city: values.city.value,
        resource: resourceType,
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
        const formattedFilesForDelete = filesForDelete.join(',')
        data.id = router.query.id
        if (formattedFilesForDelete.length > 0) {
          data.filesForDelete = formattedFilesForDelete
        }
        console.log(data)
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
    const contractApi = require('/services/contract/index')[listing.blockchain]

    setDeleting(true)

    try {
      if (listing?.isPublished)
        await contractApi.revokeSell(listing.tokenIds[0], user.walletAddress)

      deleteListing(router.query.id).unwrap()
        .then(result => {
          router.push('/profile')
        })
        .catch(result => {
          setDeleting(false)
        })
    } catch (error) {
      dispatch(pushToast({ type: 'error', message: 'Revoke sell is cancelled by user' }))
      setDeleting(false)
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
              },
              link360: data?.link360 || ''
            })

            if (data?.resource === 'Video') {
              setFile([data?.assets?.[0].path])
              setRawFile([data?.rawFileName])
            } else if (data?.resource === 'Image') {
              setFile([data?.assets?.[0].path])
              setRawFile([data?.rawFileName])
            } else {
              setFile(data?.assets?.map(asset => asset.path))
              setTourPreviews(data?.assets?.map((asset, index) => ({
                id: `${Date.now()}-${index}`,
                content: asset?.path,
                nftId: asset._id
              })))
            }
            setResourceType((data?.resource?.includes('360') ? '360 Tour' : data?.resource) || 'Image')

            getBlockchain().then(blockchain => {
              const currentNetwork = data.blockchain === 'polygon' ?
                getConfig().POLYGON_NETWORK
                :
                getConfig().BSC_NETWORK

              if (data?.blockchain !== blockchain) {
                dispatch(pushToast({
                  type: 'info',
                  message: `Please use ${currentNetwork.chainName} network for this NFT`
                }))
              }
            })

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
        fields: ["address_components", "formatted_address", "geometry"],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options)
      autocompleteRef.current.addListener("place_changed", handlePlaceChange)
    }
  }, [createCity, getCities, isLoaded, mode, setValues])

  if (listingError?.message)
    return <Error errorCode={'Listing' + listingError.message} />

  if (mode === 'edit' && listing.name && !ownItem)
    return <Error errorCode={'ListingNoAccess' } />

  if (mode === 'create' && user && !user?.invited)
    return <Error errorCode={'PageNotFound' } />

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
        <Tabs
          className={cn(styles.resourceTypes, { [styles.readOnly]: isReseller })}
          name="resourceType"
          value={resourceType}
          onChange={handleResourceChange}
          tabs={RESOURCE_TYPES} />
        <div className={styles.uploadSection}>
          <Typography
            fontWeight={600}
            fontSize={16}
            lHeight={20}>
            Upload a { resourceType === 'Video' ? 'video' : `photo${ resourceType.includes('360') ? 's' : '' }` }
          </Typography>
          <Typography
            fontFamily={'Lato'}
            fontSize={14}
            lHeight={22}
            margin={'10px 0 0'}
            color={'rgba(55, 65, 81, 0.8)'}>
            NFT file types: { getFormattedFileFormats(FORMATS[resourceType].preview) }.
          </Typography>
          <Typography
            fontFamily={'Lato'}
            fontSize={14}
            lHeight={22}
            color={'rgba(55, 65, 81, 0.8)'}>
            Raw file types: { getFormattedFileFormats(FORMATS[resourceType].raw) }.
          </Typography>
          <Typography
            fontFamily={'Lato'}
            fontSize={14}
            lHeight={22}
            color={'rgba(55, 65, 81, 0.8)'}>
            Max size: 80 Mb
          </Typography>
          <div className={styles.uploaders}>
            <div className={styles.uploader}>
              <FileUploader
                onChange={handleFileJPGChange}
                accept={FORMATS[resourceType].preview.join() + (resourceType !== 'Video' && ',.jpeg')}
                disabled={isReseller}
                multiple={isTour}
                error={file.length === 0 && touched.name}>
                { 
                  file.length === 0 || isTour ?
                    <div className={styles.uploaderContainer}>
                      <Image src="/images/form-jpg.svg" width={50} height={50} alt="jpg file" />
                      <Typography fontSize={20} fontWeight={600} lHeight={24} margin={'24px 0 0'}>
                        { isTour ? 'Upload 360 tour images': 'Upload NFT file' }
                      </Typography>
                      <p className={styles.uploaderText}>
                        Drag & drop file{ isTour && 's' } or <span>browse media on your device</span>
                      </p>
                    </div>
                    :
                    <div className={styles.imageContainer}>
                      <MediaFile
                        src={filePreview !== null ? filePreview : file[0]}
                        videoSrc={resourceType === 'Video' && (filePreview !== null ? filePreview : file[0])}
                        autoPlay
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
            {
              isTour ?
                <div className={styles.photoPreviews}>
                  {
                    new Array(Math.max(file.length, 6)).fill(null).map((item, index) => (
                      <div key={tourPreviews[index]?.id || index} className={cn(styles.photoPreview, { [styles.noBorder]: file[index] })}>
                        {
                          tourPreviews[index] ?
                            <>
                              <MediaFile src={tourPreviews[index].content} alt="VR" />
                              {
                                !isReseller &&
                                <ButtonCircle onClick={handleRemoveImage(index)} className={styles.btnRemove}>
                                  <CrossIcon />
                                </ButtonCircle>
                              }
                            </>
                            :
                            <AspectRatioBox />
                        }
                      </div>
                    ))
                  }
                </div>
                :
                <div className={styles.uploader}>
                  <FileUploader
                    onChange={handleFileRAWChange}
                    accept={FORMATS[resourceType].raw.join() + (resourceType !== 'Video' && ',.jpeg')}
                    disabled={isReseller}
                    error={rawFile.length === 0 && touched.name}>
                    <div className={styles.uploaderContainer}>
                      <Image src="/images/form-raw.svg" width={50} height={50} alt="raw file" />
                      <Typography fontSize={20} fontWeight={600} lHeight={24} margin={'24px 0 0'} align="center">
                        { rawFile.length === 0 ? 'Upload raw file' : (rawFile[0]?.name || rawFile[0] )}
                      </Typography>
                      {
                        rawFile.length === 0 &&
                        <p className={styles.uploaderText}>
                          Drag & drop file or <span>browse media on your device</span>
                        </p>
                      }
                      {
                        rawFile.length !== 0 && !isReseller &&
                        <ButtonCircle className={styles.btnEdit}>
                          <PenIcon />
                        </ButtonCircle>
                      }
                    </div>
                  </FileUploader>
                </div>
            }
          </div>
        </div>
        {
          isTour &&
          <Input
            type="url"
            className={styles.input}
            name="link360"
            value={formik.values.link360}
            onChange={formik.handleChange}
            placeholder="Item 360 Tour Link"
            required
            error={errors.link360}
            errorText={errors.link360 && touched.link360}
            label="360 Tour URL*" />
        }
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
          options={blockchainOptions}
          value={formik.values.blockchain}
          onChange={formik.handleChange}
          disabled={isReseller}
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
              <Button onClick={toggleDeleteConfirmation} className={styles.btnDelete} type="outlined" loading={isDeleting}>
                Delete item
              </Button>
          }
        </div>
      </form>
      <DoneCongratulation
        imageUrl={file !== null && filePreview}
        message={`Great! You just created - ${formik.values.name}`}
        opened={isCreated}
        listing={{...listing, resource: resourceType}}
        hasShare={false}
        onClose={handleCloseCongratulations} />
      <ConfirmationDialog
        opened={deleteConfirmationOpened}
        onClose={toggleDeleteConfirmation}
        onSubmit={handleDelete}
        title={'Delete listing'}
        message={'Do you really what to delete this listing?'} />
      <FullscreenLoader opened={(mode === 'edit' && !listing.name)} />
    </div>
  )
}

export default Form