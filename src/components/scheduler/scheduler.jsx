import React from "react";
import styles from "./scheduler.module.sass";
import { Icons } from "../../icons";
import { csvToArray } from "../../utils/utils";
import cn from "classnames";
import { TableEvents } from "../table-events";
import { FileUploader } from "../file-uploader/file-uploader";

export function Scheduler() {
  const [isLoading, setIsLoading] = React.useState("none");
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState('')

  function handleChangeFile(files) {
    setIsLoading("load");
    const reader = new FileReader();

    try {
      reader.onload = function ({ target: { result } }) {
        const data = csvToArray(result);
        setTimeout(() => {
          setIsLoading("done")
          setTimeout(() => setData(data), 300)
        }, 500);
      };

      if (typeof files === 'string') throw new Error(files)

      reader.readAsText(files[0]);
    } catch (e) {
      setError(e.message)
      setIsLoading("error");
    }
  }

  function handleClickTryAgain(e) {
    e.stopPropagation();

    setError('')
    setIsLoading("none");
  }

  function resetData() {
    setData([]);
    setIsLoading('none')
  }

  return data.length === 0 ? (
    <FileUploader 
      className={styles.uploader} 
      onChange={handleChangeFile}
      accept=".csv,.xls,.xlsx,.ods,.ots,.xltx"
      error={error}
    >
      <div className={cn(styles.icon_wrapper, { [styles.hidden]: isLoading !== "none" })}>
        <Icons.Download />
        <div className={styles.choose_text}>
          <p>Choose file</p>
        </div>
      </div>
      <div className={cn(styles.box_upload, { [styles.show]: isLoading === "load" })}>
        Uploading...
      </div>
      <div className={cn(styles.box_success, { [styles.show]: isLoading === "done" })}>Done!</div>
      <div className={cn(styles.box_error, { [styles.show]: isLoading === "error" })}>
        {error}<br/>
        <span role="button" onClick={handleClickTryAgain}>
          Try again!
        </span>
      </div>
    </FileUploader>
  ) : (
    <TableEvents data={data} resetData={resetData}/>
  );
}
