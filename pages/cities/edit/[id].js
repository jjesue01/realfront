import React, {useEffect, useState} from "react";
import Head from "next/head";
import CollectionForm from "../../../components/cities/form/CollectionForm";
import Error from "next/error";

function MyCollections() {

  return <Error statusCode={404} />

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