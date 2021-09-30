import React, { useState } from "react";
import styles from './Form.module.sass'
import { useFormik } from "formik";
import * as Yup from 'yup'
import Typography from "../../Typography";
import Input from "../../input/Input";
import Select from "../../select/Select";
import Button from "../../button/Button";
import Textarea from "../../textarea/Textarea";
import CollectionPicker from "./collection-picker/CollectionPicker";
import FileUploader from "./file-uploader/FileUploader";
import Image from "next/image";
import ButtonCircle from "../../button-circle/ButtonCircle";
import PenIcon from '/public/icons/pen.svg'
import CreateCollection from "../../dialogs/create-collection/CreateCollection";
import DoneCongratulation from "../../dialogs/done-congratulation/DoneCongratulation";
import {useRouter} from "next/router";
import {useGetUserCollectionsQuery} from "../../../services/collections";

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

const collectionsData = [
  {
    id: 1,
    name: 'New York, Manhattan',
    url: '/hero-aparts-big.jpg',
    checked: false
  },
  {
    id: 2,
    name: 'Collection name',
    url: '/hero-aparts-big.jpg',
    checked: false
  },
]

const validationSchema = Yup.object({
  name: Yup.string().required(),
  location: Yup.string().required(),
  address: Yup.string().required(),
  description: Yup.string(),
  tags: Yup.string(),
  blockchain: Yup.string().required()
})

function Form({ mode }) {
  const router = useRouter()
  // const { data } = useGetUserCollectionsQuery()
  const [createOpened, setCreateOpened] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [collections, setCollections] = useState(collectionsData)
  const [jpgFile, setJpgFile] = useState(null)
  const [rawFile, setRawFile] = useState(null)
  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      address: '',
      description: '',
      tags: '',
      blockchain: 'ethereum'
    },
    validationSchema,
    onSubmit: values => {
      if (jpgFile !== null && rawFile !== null){
        if (mode === 'create') {
          setIsCreated(true)
        } else {
          router.push(`/photos/${router.query.id}`)
        }
      }
    },
  });

  function handleCollectionsChange(data) {
    setCollections([...data])
  }

  function handleFileJPGChange(file) {
    setJpgFile(file)
  }

  function handleFileRAWChange(file) {
    setRawFile(file)
  }

  function toggleCreateCollection() {
    setCreateOpened(prevState => !prevState)
  }

  function handleCloseCongratulations() {
    router.push('/collections')
  }

  function handleCreateCollection(item) {
    setCollections(prevCollections => ([
      ...prevCollections,
      {
        id: Date.now(),
        url: item.logo,
        name: item.name,
        description: item.description,
        checked: false
      }
    ]))
  }

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
              'Edit 366 Madison Ave'
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
              <FileUploader onChange={handleFileJPGChange} accept=".jpg">
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
                      <Image src={URL.createObjectURL(jpgFile)} layout="fill" objectFit={'cover'} alt="nft item" />
                      <ButtonCircle className={styles.btnEdit}>
                        <PenIcon />
                      </ButtonCircle>
                    </div>
                }
              </FileUploader>
            </div>
            <div className={styles.uploader}>
              <FileUploader onChange={handleFileRAWChange} accept=".raw">
                <div className={styles.uploaderContainer}>
                  <Image src="/images/form-raw.svg" width={50} height={50} alt="raw file" />
                  <Typography fontSize={20} fontWeight={600} lHeight={24} margin={'24px 0 0'}>
                    { rawFile === null ? 'Upload RAW file' : rawFile.name }
                  </Typography>
                  {
                    rawFile === null &&
                    <p className={styles.uploaderText}>
                      Drag & drop file or <span>browse media on your device</span>
                    </p>
                  }
                  {
                    rawFile !== null &&
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
          label="Name*" />
        <Input
          className={styles.input}
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          placeholder="Enter location"
          required
          label="Location*" />
        <Input
          className={styles.input}
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          placeholder="Enter address"
          required
          label="Address*" />
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
        <CollectionPicker
          className={styles.input}
          collections={collections}
          onChange={handleCollectionsChange}
          onCreate={toggleCreateCollection} />
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
              <Button htmlType="submit">
                Create
              </Button>
              :
              <Button className={styles.btnSave} htmlType="submit">
                Save
              </Button>
          }
          {
            mode === 'edit' &&
              <Button className={styles.btnDelete} type="outlined">
                Delete item
              </Button>
          }
        </div>
      </form>
      <CreateCollection
        opened={createOpened}
        onClose={toggleCreateCollection}
        onCreate={handleCreateCollection} />
      <DoneCongratulation
        imageUrl={jpgFile !== null && URL.createObjectURL(jpgFile)}
        message={`Great! You just created - ${formik.values.name}`}
        opened={isCreated}
        onClose={handleCloseCongratulations} />
    </div>
  )
}

export default Form