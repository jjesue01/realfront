import React, {useEffect, useState} from "react";
import Head from "next/head";
import Link from 'next/link'
import Image from "next/image";
import styles from '../../../styles/UserManagement.module.sass'
import cn from "classnames";
import Typography from "../../../components/Typography";
import Switcher from "../../../components/switcher/Switcher";
import DetailsIcon from '/public/icons/details.svg'
import SearchIcon from "../../../public/icons/search-icon.svg";
import Input from "../../../components/input/Input";
import {useGetAllUsersQuery, useUpdateUserMutation} from "../../../services/admin";

function UserRow({ user }) {
  const [updateUser] = useUpdateUserMutation()
  const [switchers, setSwitchers] = useState({
    invited: false,
    verified: false
  })

  function toggleSwitcher({ target: { name, value } }) {
    setSwitchers(prevState => ({
      ...prevState,
      [name]: value
    }))
    updateUser({ ...user, [name]: value })
  }

  useEffect(function () {
    if (user) {
      setSwitchers({
        invited: user.invited,
        verified: user.verified
      })
    }
  }, [user])

  return (
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colLogo)}>
        <div className={styles.logoWrapper}>
          {
            user.logoImage &&
            <Image src={user.logoImage} alt="logo" layout="fill" objectFit="cover" />
          }
        </div>
      </div>
      <div className={cn(styles.col, styles.colUsername)}>
        <p>{ user.username }</p>
      </div>
      <div className={cn(styles.col, styles.colEmail)}>
        <p>{ user.email }</p>
      </div>
      <div className={styles.colActions}>
        <div className={cn(styles.col, styles.colInvited)}>
          <Switcher
            name="invited"
            value={switchers.invited}
            size="small"
            onChange={toggleSwitcher} />
        </div>
        <div className={cn(styles.col, styles.colVerified)}>
          <Switcher
            name="verified"
            value={switchers.verified}
            size="small"
            onChange={toggleSwitcher} />
        </div>
        <Link href={`/admin/user-management/${user._id}`}>
          <a className={styles.btnIcon}>
            <DetailsIcon />
          </a>
        </Link>
      </div>
    </div>
  )
}

function UserManagement() {
  const [searchValue, setSearchValue] = useState('')
  //TODO : узнать про пагинацию
  const { data: users = [], refetch } = useGetAllUsersQuery({ search: searchValue })

  const rowsList = users.map((user, index) => (
    <UserRow key={user._id} user={user} />
  ))

  function handleChangeSearch({ target: { value } }) {
    setSearchValue(value)
  }

  useEffect(function init() {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Head>
        <title>HOMEJAB - Admin. User Management</title>
      </Head>
      <div className={styles.title}>
        <Typography tag="h3" fontSize={20} fontWeight={600}>
          Users
        </Typography>
        <Input
          className={cn(styles.inputSearch, { [styles.inputSearchActive]: searchValue !== '' } )}
          type="search"
          name="searchValue"
          value={searchValue}
          onChange={handleChangeSearch}
          size="small"
          iconRight={<SearchIcon />}
          placeholder="Search" />
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={cn(styles.col, styles.colLogo)}>
              <p>Logo</p>
            </div>
            <div className={cn(styles.col, styles.colUsername)}>
              <p>Username</p>
            </div>
            <div className={cn(styles.col, styles.colEmail)}>
              <p>Email</p>
            </div>
            <div className={styles.colActions}>
              <div className={cn(styles.col, styles.colInvited)}>
                <p>Invited</p>
              </div>
              <div className={cn(styles.col, styles.colVerified)}>
                <p>Verified</p>
              </div>
            </div>
          </div>
          <div className={styles.tableBody}>
            { rowsList }
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement