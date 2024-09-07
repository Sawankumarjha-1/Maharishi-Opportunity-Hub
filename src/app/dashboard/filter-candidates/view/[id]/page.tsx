"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../../../app/page.module.css";
import { candidates } from "@/types/index.types";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
function ParticularCandidate() {
  const id = useParams().id;
  const [data, setData] = useState<candidates>();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/particular-candidate/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          setData(response.data.data);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);
  return (
    <div className={styles.candidateDetailsContainer}>
      <h3 className={styles.detailsJobTitle}>{data?.name}</h3>
      <div className={styles.detailsSpanContainer}>
        <span>
          <b>Email Address : </b> {data?.email}
        </span>{" "}
        <span>
          <b>Phone no : </b> {data?.phone}
        </span>{" "}
        {data?.github && (
          <span>
            <b>Github : </b> {data?.github}
          </span>
        )}
        <span>
          <b>Linkedin : </b> {data?.linkedin}
        </span>
        <span>
          <b>Education : </b> {data?.education}
        </span>{" "}
        <span>
          <b>Experience : </b> {data?.experience}
        </span>{" "}
        <span>
          <b>Applied Date : </b> {data?.updatedAt.substring(0, 10)}
        </span>{" "}
        <span>
          <b>Resume : </b>{" "}
          <Link href={data?.resumeLink || ""} download={true}>
            {data?.resumeLink}
          </Link>
        </span>{" "}
        <b className={styles.jobHeading}>Skills :</b>
        <div className={styles.reuiredSkills}>
          {data?.skills
            .trim()
            .split("|")
            .map((skill, index) => {
              return <span key={"skill" + index + data._id}>{skill}</span>;
            })}
        </div>
      </div>

      <div className={styles.buttonConatiner}>
        <button type="button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ParticularCandidate;
