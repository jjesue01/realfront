import React, {useEffect, useState} from "react";
import Head from "next/head";
import CollectionForm from "../../../components/collections/form/CollectionForm";

function MyCollections() {

  return (
    <main className="page-container">
      <Head>
        <title>HOMEJAB - Edit Collection New York, Manhattan</title>
      </Head>
      <div className="border-wrapper">
        <CollectionForm />
      </div>
    </main>
  )
}

export default MyCollections