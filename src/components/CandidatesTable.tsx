import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiTrash } from "react-icons/fi";
import styles from "../app/table.module.css";
import axios from "axios";
import { candidates } from "@/types/index.types";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaLinkedin,
  FaRegEnvelope,
  FaRegFilePdf,
} from "react-icons/fa";

function CandidatesTable({
  filtreData,
  data,
  tableHead,
  setFiltreData,
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
    const fdata = data.filter((item, index) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });
    setFiltreData(fdata);
  }

  function deleteJobpost(id: string) {
    const value = confirm("Are you sure ?");
    if (value) {
      axios
        .get(`http://localhost:5000/api/v1/portal/delete-candidate/${id}`, {
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
      {/***********Table*******/}
      <div className={styles.jTable}>
        {/* Table Filtering Container */}
        <div className={styles.jHeader}>
          <h2>
            {heading}( {filtreData.length} )
          </h2>
          <span>
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
          filtreData.map((data: candidates, index: number) => {
            return (
              <div
                key={"jobPostRow" + index}
                className={`${styles.userJData} ${styles.jData}`}
              >
                <p>{index + 1}</p>
                <p>{data.name}</p>
                <p>{data.email}</p>
                <p>{data.education}</p>
                <p>{data.skills.substring(0, 20) + "..."}</p>
                <p>
                  <Link href={data.resumeLink} target="_blank" title="resume">
                    <FaRegFilePdf size={25} color="red" />
                  </Link>
                </p>{" "}
                <p>
                  <Link href={"mailto:" + data.email}>
                    {" "}
                    <FaRegEnvelope
                      size={20}
                      className={`${styles.tableIcon3} ${styles.tableIcon}`}
                    />
                  </Link>
                  <Link href={"/dashboard/filter-candidates/view/" + data._id}>
                    <FiEye
                      size={20}
                      className={`${styles.tableIcon1} ${styles.tableIcon}`}
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

export default CandidatesTable;
