import React from "react";
import {useRouter} from "next/router";
import {useGetUserByIdQuery} from "../../../services/admin";
import styles from '/styles/UserDetail.module.sass'
import Head from "next/head";
import cn from "classnames";
import {getShortWalletAddress} from "../../../utils";
import ButtonCopy from "../../../components/button-copy/ButtonCopy";

function UserDetails() {
  const { query: { id }, ...router } = useRouter()
  const { data: user } = useGetUserByIdQuery(id, {
    skip: !id,
  })
  return (
    <div className={styles.root}>
      <Head>
        <title>HOMEJAB - Admin. User Details</title>
      </Head>
      {
        user &&
        <div className={styles.userContent}>
          <div className={styles.logoContainer}>
            logo
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
                <ButtonCopy value={user.walletAddress} />
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
                <p>{  }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Verified</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{  }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Created</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ user.createdAt }</p>
              </div>
            </div>
            <div className={styles.field}>
              <div className={cn(styles.detailsCol, styles.colName)}>
                <p>Last Login</p>
              </div>
              <div className={cn(styles.detailsCol, styles.colContent)}>
                <p>{ user.lastLoginAt }</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default UserDetails