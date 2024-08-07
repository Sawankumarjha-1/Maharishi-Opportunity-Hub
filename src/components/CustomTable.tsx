import React, { useState } from "react";
import Link from "next/link";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import styles from "../app/table.module.css";
import { individualJob } from "@/types/index.types";
import axios from "axios";

function CustomTable({
  filtreData,
  data,
  tableHead,
  setFiltreData,
  viewLink,
  editLink,
  deleteLink,
  heading,
}: {
  filtreData: [];
  data: [];
  tableHead: [];
  setFiltreData: Function;
  viewLink: string;
  editLink: string;
  deleteLink: string;
  heading: string;
}) {
  const [toggle, setToggle] = useState<string>(() => "ALL");
  const [searchValue, setSearchValue] = useState<string>(() => "");

  //Search Value Change
  function searchFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearchValue(value);
    const fdata = data.filter((item: individualJob, index) => {
      if (toggle === "ALL") {
        return item.company.toLowerCase().includes(value.toLowerCase());
      }

      return (
        item.status == toggle &&
        item.company.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFiltreData(fdata);
  }

  function statusBasedFiltre(s: string) {
    if (s === "All") {
      setFiltreData(data);
      return;
    }
    const fdata = data.filter((item: individualJob, index) => {
      return item.status.toLowerCase().includes(s.toLowerCase());
    });
    setFiltreData(fdata);
  }

  function deleteJobpost(id: string) {
    const value = confirm("Are you sure ?");
    if (value) {
      axios
        .get(`http://localhost:5000/api/v1/portal/delete/job-listing/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            alert("Delete Successfully....");
            return window.location.reload();
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  return (
    <div className={styles.allJobContainer}>
      <div className={styles.jTable}>
        {/* Table Filtering Container */}
        <div className={styles.jHeader}>
          <h2>
            {heading}( {filtreData.length} )
          </h2>
          <span>
            <b
              className={`${toggle === "ALL" && styles.active}`}
              onClick={() => {
                setToggle("ALL");
                statusBasedFiltre("All");
              }}
            >
              All
            </b>
            <b
              className={`${toggle === "OPEN" && styles.active}`}
              onClick={() => {
                setToggle("OPEN");
                statusBasedFiltre("Open");
              }}
            >
              Open
            </b>
            <b
              className={`${toggle === "CLOSED" && styles.active}`}
              onClick={() => {
                setToggle("CLOSED");
                statusBasedFiltre("Close");
              }}
            >
              Closed
            </b>
            <input
              type="search"
              placeholder="Search for specific job role..."
              name="search"
              value={searchValue}
              onChange={searchFieldChange}
              autoComplete="off"
            />
          </span>
        </div>
        {/*Table Column Names */}
        <div className={styles.jThead}>
          {tableHead.map((item: string, index: number) => {
            return <b key={"jobTableHead" + index}>{item}</b>;
          })}
        </div>

        {filtreData.length != 0 &&
          filtreData.map((data: individualJob, index: number) => {
            return (
              <div
                key={"jobPostRow" + index}
                className={`${
                  data.status == "CLOSED"
                    ? styles.jDataClosed
                    : styles.jDataOpened
                } ${styles.jData}`}
              >
                <p>{index + 1}</p>
                <p>{data.company}</p>
                <p>{data.title}</p>
                <p>{data.experience}</p>
                <p>{data.salary}</p>

                <p
                  className={`${
                    data.status == "OPEN" ? styles.open : styles.closed
                  }`}
                >
                  {data.status}
                </p>
                <p>
                  <Link href={viewLink + "/" + data._id}>
                    <FiEye
                      size={20}
                      className={`${styles.tableIcon1} ${styles.tableIcon}`}
                    />
                  </Link>

                  <Link href={editLink + "/" + data._id}>
                    {" "}
                    <FiEdit
                      size={20}
                      className={`${styles.tableIcon2} ${styles.tableIcon}`}
                    />
                  </Link>
                  <Link
                    href={"#"}
                    onClick={() => {
                      deleteJobpost(data._id);
                    }}
                  >
                    {" "}
                    <FiTrash
                      size={20}
                      className={`${styles.tableIcon3} ${styles.tableIcon}`}
                    />
                  </Link>
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default CustomTable;
