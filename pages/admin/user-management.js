import React, {useState} from "react";
import Head from "next/head";
import Link from 'next/link'
import Image from "next/image";
import styles from '../../styles/UserManagement.module.sass'
import cn from "classnames";
import Typography from "../../components/Typography";
import Switcher from "../../components/switcher/Switcher";
import DetailsIcon from '/public/icons/details.svg'
import SearchIcon from "../../public/icons/search-icon.svg";
import Input from "../../components/input/Input";
import {useGetAllUsersQuery} from "../../services/admin";

function UserManagement() {
  const { data: users = [] } = useGetAllUsersQuery()
  const [searchValue, setSearchValue] = useState('')

  const rowsList = users.map((user, index) => (
    <div key={user._id} className={styles.tableItem}>
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
            value={user.invited}
            size="small"
            onChange={() => {}} />
        </div>
        <div className={cn(styles.col, styles.colVerified)}>
          <Switcher
            name="verified"
            value={user.verified}
            size="small"
            onChange={() => {}} />
        </div>
        <Link href={'/marketplace'}>
          <a className={styles.btnIcon}>
            <DetailsIcon />
          </a>
        </Link>
      </div>
    </div>
  ))

  function handleChangeSearch({ target: { value } }) {
    setSearchValue(value)
  }

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