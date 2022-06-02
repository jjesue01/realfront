import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useGetListingsQuery, useGetUserByIdQuery, useUpdateUserMutation} from "../../../services/admin";
import styles from '/styles/UserDetail.module.sass'
import Head from "next/head";
import cn from "classnames";
import {getFormattedEndTime, getShortWalletAddress} from "../../../utils";
import ButtonCopy from "../../../components/button-copy/ButtonCopy";
import Switcher from "../../../components/switcher/Switcher";
import Image from "next/image";
import Typography from "../../../components/Typography";
import Select from "../../../components/select/Select";
import SearchIcon from "../../../public/icons/search-icon.svg";
import Input from "../../../components/input/Input";
import PhotoItem from "../../../components/photo-item/PhotoItem";
import ButtonCircle from "../../../components/button-circle/ButtonCircle";
import ArrowLongIcon from "../../../public/icons/arrow-long.svg";

const sortOptions = [
  {
    label: 'Price: Low to High',
    value: 'bid.highest:desc'
  },
  {
    label: 'Price: High to Low',
    value: 'bid.highest:asc'
  },
]

function UserDetails() {
  const { query: { id }, ...router } = useRouter()
  const { data: user, refetch } = useGetUserByIdQuery(id, {
    skip: !id,
  })
  const [updateUser] = useUpdateUserMutation()
  const [sortBy, setSortBy] = useState('bid.highest:desc')
  const [searchValue, setSearchValue] = useState('')
  const { data: listings } = useGetListingsQuery({ user_id: id, search: searchValue, sort_by: sortBy })
  const [switchers, setSwitchers] = useState({
    invited: false,
    verified: false
  })

  
  function goBack() {
    router.push('/admin/user-management')
  }

  function handleChangeSearch({ target: { value } }) {
    setSearchValue(value)
  }

  function handleChangeSelect({ target: { value } }) {
    setSortBy(value)
  }

  function toggleSwitcher({ target: { name, value } }) {
    setSwitchers(prevState => ({
      ...prevState,
      [name]: value
    }))
    updateUser({ ...user, [name]: value })
  }

  useEffect(function init() {
    if (user) {
      setSwitchers({
        invited: user.invited,
        verified: user.verified
      })
    }
  }, [user])

  useEffect(function () {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.root}>
      <Head>
        <title>HOMEJAB - Admin. User Details</title>
      </Head>
      <ButtonCircle onClick={goBack} className={styles.btnBack}>
        <ArrowLongIcon />
      </ButtonCircle>
      {
        user &&
        <section className={styles.userContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              {
                user?.logoImage ?
                  <Image
                    src={user?.logoImage}
                    layout="fill"
                    objectFit="cover"
                    alt="logo" />
                  :
                  <Image
                    src="/icons/user.svg"
                    width={50}
                    height={50}
                    alt="User" />
              }
            </div>
            <Typography tag="h1" fontWeight={600} fontSize={20} margin="20px 0 0">
              { user?.username }
            </Typography>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Email</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ user.email }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Wallet Address</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ getShortWalletAddress(user.walletAddress) }</p>
                <ButtonCopy
                  className={styles.btnCopy}
                  value={user.walletAddress} />
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>ID</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ user._id }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Invited</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <Switcher
                  name="invited"
                  value={switchers.invited}
                  size="small"
                  onChange={toggleSwitcher} />
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Verified</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <Switcher
                  name="verified"
                  value={switchers.verified}
                  size="small"
                  onChange={toggleSwitcher} />
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Created</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ getFormattedEndTime(user.createdAt) }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Last Login</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                {
                  user?.lastLoginAt ? (
                    <p>{ getFormattedEndTime(user.lastLoginAt) }</p>
                  ) : <p>&mdash;</p>
                }
              </div>
            </div>
          </div>
        </section>
      }
      <section>
        <Typography tag="h1" fontWeight={600} fontSize={20} lHeight={24}>
          NFTs
        </Typography>
        <div className={styles.itemsHeader}>
          <Input
            className={cn(styles.inputSearch, { [styles.inputSearchActive]: searchValue !== '' } )}
            type="search"
            name="searchValue"
            value={searchValue}
            onChange={handleChangeSearch}
            size="small"
            iconRight={<SearchIcon />}
            placeholder="Search" />
          <Typography fontSize={16} margin="0 0 0 auto">
            {listings?.docs?.length || 'No'} results
          </Typography>
          <Select
            className={styles.selectSort}
            name="sortBy"
            value={sortBy}
            onChange={handleChangeSelect}
            options={sortOptions}
            placeholder={'Sort By'}
            size="small" />
        </div>
        <div className={styles.listingsContainer}>
          {
            listings?.docs &&
            listings.docs.map(item => (
              <PhotoItem
                //imageClassName={styles.imageWrapper}
                key={item._id}
                data={item} />
            ))
          }
        </div>
      </section>
    </div>
  )
}

export default UserDetails