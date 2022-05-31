import React from "react";
import styles from "./table-events.module.sass";
import cn from "classnames";
import { Pagination } from "../pagination";
import { Button } from "../button";
import { Toasts } from "../toasts";
import { SchedulerAPI } from "../../api";

const LIMIT_PER_PAGE = 30;

function EventRow({ item }) {
  if (!item.contact_name && !item.contact_email) return;
  return (
    <div className={styles.tableItem}>
      <div className={cn(styles.col, styles.colName)}>
        <p title={item.contact_name}>{item.contact_name}</p>
      </div>
      <div className={cn(styles.col, styles.colPhone)}>
        <p>{item.contact_phone}</p>
      </div>
      <div className={cn(styles.col, styles.colEmail)}>
        <p title={item.contact_email}>{item.contact_email}</p>
      </div>
      <div className={cn(styles.col, styles.colAddress)}>
        <p title={item.property_address}>{item.property_address}</p>
      </div>
      <div className={cn(styles.col, styles.colDate)}>
        <p>{item.schedule_date + " " + item.schedule_time}</p>
      </div>
    </div>
  );
}

export function TableEvents({ data = [], resetData }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [toast, setToast] = React.useState({text: "", type: ""})

  const rowsList = data
    .map((item) => <EventRow item={item} key={item.homejab_id} />)
    .slice(LIMIT_PER_PAGE * (currentPage - 1), LIMIT_PER_PAGE * currentPage);
  const countPage = Math.ceil(data.length / LIMIT_PER_PAGE);

  function handleNextPage() {
    if (currentPage < countPage) setCurrentPage((prev) => prev + 1);
  }

  function handlePrevPage() {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }

  function handleClickBack() {
    resetData();
  }

  async function handleClickUpload() {
    let response = await SchedulerAPI.postData(data);
    if (response.status === 200) setToast({text: "Success", type : "success"})
    else setToast({text: "Error, try again", type: "error"})
  }

  function handleRemoveToast(type) {
    if (type === "success") {
      setToast({text: "Redirect...", type: "info"})
      setTimeout(() => {
        resetData()
        setToast({text: "", type: ""})
      }, 1000);
    } else {
      setToast({text: "", type: ""})
    }
  }   

  return (
    <div className={styles.root}>
      {toast.text ? (
        <Toasts 
          text={toast.text} 
          type={toast.type}
          removeToast={handleRemoveToast}/>
      ) : null}
      <div className={styles.container}>
        <div className={styles.blockButtons}>
          <Button onClick={handleClickBack} className={styles.button}>
            Back
          </Button>
          <Button 
            onClick={handleClickUpload} 
            className={styles.button}
            disabled={!!toast.text}>
            Upload to server
          </Button>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={cn(styles.col, styles.colName)}>
              <p>Name</p>
            </div>
            <div className={cn(styles.col, styles.colPhone)}>
              <p>Phone</p>
            </div>
            <div className={cn(styles.col, styles.colEmail)}>
              <p>Email</p>
            </div>
            <div className={cn(styles.col, styles.colAddress)}>
              <p>Address</p>
            </div>
            <div className={cn(styles.col, styles.colDate)}>
              <p>Date</p>
            </div>
          </div>
          <div className={styles.tableBody}>{rowsList}</div>
        </div>
        <Pagination
          currentPage={currentPage}
          count={countPage}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          className={styles.pagination}
        />
      </div>
    </div>
  );
}
