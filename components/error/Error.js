import React from "react";
import styles from './Error.module.sass'
import Typography from "../Typography";
import Link from "next/link";
import Button from "../button/Button";

const errors = {
  'PageNotFound': 'This page could not be found',
  'ListingDeleted': 'This listing is no longer available',
  'ListingNotFound': 'This listing could not be found',
  'ListingNoAccess': `You don't have access to this listing`
}

function Error({ errorCode = 'PageNotFound' }) {
  return (
    <div className={styles.root}>
      <Typography fontWeight={600} fontSize={48} align="center">
        { errors[errorCode] }
      </Typography>
      <Link href="/marketplace">
        <a className={styles.link}>
          <Button>
            Go To Marketplace
          </Button>
        </a>
      </Link>
    </div>
  )
}

export default Error