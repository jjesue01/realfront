import React, {useEffect, useState} from "react";
import styles from './CollectionForm.module.sass'
import Typography from "../../Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import PenIcon from "../../../public/icons/pen.svg";
import FileUploader from "../../photos/form/file-uploader/FileUploader";
import {escapeValue, getImageUrl} from "../../../utils";
import Input from "../../input/Input";
import Textarea from "../../textarea/Textarea";
import Select from "../../select/Select";
import Button from "../../button/Button";
import {useRouter} from "next/router";
import {
  useDeleteCollectionMutation,
  useGetCollectionByIdQuery,
  useUpdateCollectionMutation
} from "../../../services/collections";
import FullscreenLoader from "../../fullscreen-loader/FullscreenLoader";

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

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  url: Yup.string().required(`URL name can't be empty`),
  description: Yup.string(),
  payoutAddress: Yup.string(),
  blockchain: Yup.string().required()
})

function CollectionForm() {
  const router = useRouter()
  const { id } = router.query
  const [updateCollection] = useUpdateCollectionMutation()
  const [deleteCollection] = useDeleteCollectionMutation()
  const { data: collection, isFetching } = useGetCollectionByIdQuery(id, { skip: !id })
  const [isDeleting, setDeleting] = useState(false)
  const [files, setFiles] = useState({
    logo: null,
    featured: null,
    banner: null
  })
  const {setValues, errors, touched, ...formik} = useFormik({
    initialValues: {
      name: 'New York, Manhattan',
      url: '',
      description: '',
      payoutAddress: '',
      blockchain: 'ethereum'
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  function handleFileChange(name) {
    return function (file) {
      setFiles(prevFiles => ({
        ...prevFiles,
        [name]: file
      }))
    }
  }

  function handleUrlChange({ target: { value } }) {
    setValues(prevState => ({
      ...prevState,
      url: escapeValue(value)
    }))
  }

  function handleSubmit(values, { setSubmitting }) {
    const data = {
      ...values,
      logoImage: files.logo,
      featureImage: files.featured,
      bannerImage: files.banner,
      id
    }
    updateCollection(data).unwrap()
      .then(result => {
        router.push('/collections')
      })
      .catch(result => {
        setSubmitting(false)
      })
  }

  function handleDelete() {
    setDeleting(true)
    deleteCollection(id).unwrap()
      .then(() => {
        router.push('/collections')
      })
      .catch(() => {
        setDeleting(false)
      })
  }

  useEffect(function initCollection() {
    if (collection) {
      setValues({
        name: collection.name,
        url: collection.url,
        description: collection.description || '',
        payoutAddress: collection.payoutAddress || '',
        blockchain: collection.blockchain || 'ethereum'
      })
      setFiles({
        logo: collection.logoImage,
        featured: collection.featureImage || null,
        banner: collection.bannerImage || null,
      })
    }
  }, [collection, setValues])

  return (
    <form className={styles.root} onSubmit={formik.handleSubmit}>
      <Typography tag="h1" fontWeight={600} fontSize={36} lHeight={44}>
        Edit collection
      </Typography>
      <div className={styles.formField}>
        <p className={styles.formLabel}>
          Logo image*
        </p>
        <p className={styles.formSubLabel}>
          This image will also be used for navigation. 350 x 350 recommended.
        </p>
        <FileUploader
          className={styles.uploader}
          onChange={handleFileChange('logo')}
          accept=".jpg,.jpeg,.png">
          {
            files.logo === null ?
              <Image src="/icons/image.svg" width={40} height={40} alt="logo" />
              :
              <div className={styles.logoWrapper}>
                <Image
                  src={getImageUrl(files.logo)}
                  layout="fill"
                  objectFit="cover"
                  alt="logo" />
              </div>
          }
          <div className={styles.editLogo}>
            <PenIcon /> Edit
          </div>
        </FileUploader>
      </div>
      <div className={styles.formField}>
        <p className={styles.formLabel}>
          Featured image
        </p>
        <p className={styles.formSubLabel}>
          (optional) This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of HomeJab. 600 x 400 recommended.
        </p>
        <FileUploader
          className={styles.featuredUploader}
          onChange={handleFileChange('featured')}
          accept=".jpg,.jpeg,.png">
          {
            files.featured === null ?
              <Image src="/icons/image.svg" width={40} height={40} alt="featured" />
              :
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(files.featured)}
                  layout="fill"
                  objectFit="cover"
                  alt="logo" />
              </div>
          }
          <div className={styles.editImage}>
            <PenIcon /> Edit
          </div>
        </FileUploader>
      </div>
      <div className={styles.formField}>
        <p className={styles.formLabel}>
          Banner image
        </p>
        <p className={styles.formSubLabel}>
          (optional) This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.
        </p>
        <FileUploader
          className={styles.bannerUploader}
          onChange={handleFileChange('banner')}
          accept=".jpg,.jpeg,.png">
          {
            files.banner === null ?
              <Image src="/icons/image.svg" width={40} height={40} alt="banner" />
              :
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(files.banner)}
                  layout="fill"
                  objectFit="cover"
                  alt="logo" />
              </div>
          }
          <div className={styles.editImage}>
            <PenIcon /> Edit
          </div>
        </FileUploader>
      </div>
      <Input
        className={styles.formField}
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        placeholder="Collection name"
        required
        error={errors.name && touched.name}
        label="Name*" />
      <Input
        type="url"
        urlPrefix={'https://homejab.com/assets/'}
        className={styles.formField}
        name="url"
        value={formik.values.url}
        onChange={handleUrlChange}
        placeholder="your-url"
        subLabel="Customize your URL on HomeJab. Must only contain lowercase letters, numbers, and hyphens."
        error={errors.url}
        errorText={errors.url}
        label="URL" />
      <Textarea
        className={styles.formField}
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        placeholder="Describe your collection"
        label="Description" />
      <Input
        className={styles.formField}
        name="payoutAddress"
        value={formik.values.payoutAddress}
        onChange={formik.handleChange}
        placeholder="Enter an address, e.g. 0x1ef4... or destination.eth"
        label="Your payout wallet address" />
      <Select
        className={styles.formField}
        name="blockchain"
        options={selectOptions}
        value={formik.values.blockchain}
        onChange={formik.handleChange}
        label="Blockchain" />
      <div className={styles.actions}>
        <Button className={styles.btnSave} htmlType="submit" loading={formik.isSubmitting}>
          Save
        </Button>
        <Button onClick={handleDelete} className={styles.btnDelete} type="outlined" loading={isDeleting}>
          Delete collection
        </Button>
      </div>
      <FullscreenLoader opened={isFetching} />
    </form>
  )
}

export default CollectionForm