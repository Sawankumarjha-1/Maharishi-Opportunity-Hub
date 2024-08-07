import React, { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { individualJob } from "@/types/index.types";
import axios, { AxiosError } from "axios";
function JobDescription({
  changeDisplay,
  jobId,
}: {
  changeDisplay: Function;
  jobId: any;
}) {
  const [data, setData] = useState<individualJob>();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/job-data/${jobId}`)
      .then((response) => {
        if (response.status === 200) {
          setData(response.data.data);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      {" "}
      {/*Job Description */}
      <h3 className={styles.detailsJobTitle}>{data?.title}</h3>
      <p className={styles.detailsCompany}>{data?.company}</p>
      <b className={styles.jobHeading}>About Company </b>
      <p className={styles.jobDescription}>{data?.aboutCompany}</p>
      <b className={styles.jobHeading}>Job Description</b>
      <p className={styles.jobDescription}>{data?.description}</p>
      <b className={styles.jobHeading}>Required Skills :</b>
      <div className={styles.reuiredSkills}>
        {data?.skills
          .trim()
          .split(",")
          .map((skill, index) => {
            return <span key={"skill" + index + data._id}>{skill}</span>;
          })}
      </div>
      <div className={styles.detailsSpanContainer}>
        <span>
          <b>Job Location : </b>
          {data?.location}
        </span>
        <span>
          <b>Minimum Experience : </b> {data?.experience}
        </span>
        <span>
          <b>Minimum Education : </b> {data?.minimumEducation}
        </span>
        <span>
          <b>Posted Date : </b>
          {data?.postedDate.substring(0, 10)}
        </span>
        <span>
          <b>Joining Within : </b>
          {data?.joining}
        </span>
        <span>
          <b>Expected Salary : </b>
          {data?.salary}
        </span>
      </div>
      <div className={styles.buttonConatiner}>
        <button type="button" onClick={() => changeDisplay(true)}>
          Apply Now
        </button>
      </div>
    </>
  );
}

export default JobDescription;
