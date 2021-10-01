import React, {useEffect, useState} from "react";
import styles from './CollectionForm.module.sass'
import Typography from "../../Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import PenIcon from "../../../public/icons/pen.svg";
import FileUploader from "../../photos/form/file-uploader/FileUploader";
import {getImageUrl} from "../../../utils";
import Input from "../../input/Input";
import Textarea from "../../textarea/Textarea";
import Select from "../../select/Select";
import Button from "../../button/Button";
import {useRouter} from "next/router";
import {
  useGetCollectionByIdQuery,
  useUpdateCollectionMutation
} from "../../../services/collections";

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
  name: Yup.string().required(),
  url: Yup.string(),
  description: Yup.string(),
  royalties: Yup.number().positive().min(0).max(100),
  walletAddress: Yup.string(),
  blockchain: Yup.string().required()
})

function CollectionForm() {
  const router = useRouter()
  const { query: { id } } = useRouter()
  const [updateCollection] = useUpdateCollectionMutation()
  const { data: collection  } = useGetCollectionByIdQuery(id)
  const [files, setFiles] = useState({
    logo: '/collection-logo.jpg',
    featured: null,
    banner: null
  })
  const {setValues, ...formik} = useFormik({
    initialValues: {
      name: 'New York, Manhattan',
      url: '',
      description: '',
      royalties: '',
      walletAddress: '',
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

  function handleSubmit(values) {
    const data = {
      ...values,
      file: files.logo
    }
    router.push('/collections')
    // updateCollection(data).unwrap()
    //   .then(result => {
    //
    //   })
    //   .catch(result => {
    //
    //   })
  }

  useEffect(function initCollection() {
    if (collection) {
      setValues({
        name: collection.name,
        url: collection.url || collection._id,
        description: collection.description || '',
        royalties: collection.royalties || 0,
        walletAddress: collection.walletAddress || '',
        blockchain: collection.blockchain || 'ethereum'
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
        label="Name*" />
      <Input
        type="url"
        urlPrefix={'https://homejab.com/assets/'}
        className={styles.formField}
        name="url"
        value={formik.values.url}
        onChange={formik.handleChange}
        placeholder="your-url"
        subLabel="Customize your URL on HomeJab. Must only contain lowercase letters, numbers, and hyphens."
        label="URL" />
      <Textarea
        className={styles.formField}
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        placeholder="Describe your collection"
        label="Description" />
      <Input
        type="number"
        className={styles.formField}
        name="royalties"
        value={formik.values.royalties}
        onChange={formik.handleChange}
        placeholder="Percentage fee"
        iconRight={<span className={styles.percentIcon}>%</span>}
        subLabel="Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price and paid monthly to a payout address of your choosing."
        label="Royalties" />
      <Input
        className={styles.formField}
        name="walletAddress"
        value={formik.values.walletAddress}
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
        <Button className={styles.btnSave} htmlType="submit">
          Save
        </Button>
        <Button className={styles.btnDelete} type="outlined">
          Delete collection
        </Button>
      </div>
    </form>
  )
}

export default CollectionForm