"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../../dash.module.css";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

function Details() {
  const router = useRouter();
  const id = useParams().id;
  const [data, setData] = useState({
    company: "",
    aboutCompany: "",
    title: "",
    experience: "",
    skills: "",
    location: "",
    minimumEducation: "",
    salary: "",
    joining: "",
    description: "",
    status: "",
    postedDate: "",
  });
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/job-data/${id}`)
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
    <div className={styles.createPostContainer}>
      <form className={styles.createJobPostForm}>
        <input
          type="text"
          placeholder="Company Name"
          name="company"
          autoComplete="off"
          disabled
          value={"Company : " + data.company}
        />
        <input
          type="text"
          placeholder="Job Position (Title)"
          name="title"
          autoComplete="off"
          value={"Title : " + data.title}
          disabled
        />
        <input
          type="text"
          placeholder="Minimum Experience Required"
          name="experience"
          value={"Minimum Experience : " + data.experience}
          disabled
        />
        <input
          type="text"
          placeholder="Minimum Qualification"
          name="minimumEducation"
          autoComplete="off"
          disabled
          value={"Minimum Education : " + data.minimumEducation}
        />
        <input
          type="text"
          placeholder="Job Location"
          name="location"
          autoComplete="off"
          disabled
          value={"Location : " + data.location}
        />
        <input
          type="text"
          placeholder="Salary Range (Per Year)"
          name="salary"
          autoComplete="off"
          disabled
          value={"Salary : " + data.salary}
        />
        <input
          type="text"
          placeholder="Joining Timing"
          name="joining"
          autoComplete="off"
          disabled
          value={"Joinig Time : " + data.joining}
        />{" "}
        <input
          type="text"
          placeholder="Status"
          name="status"
          autoComplete="off"
          disabled
          value={"Status : " + data.status}
        />
        <input
          type="text"
          placeholder="Posted Date"
          name="status"
          autoComplete="off"
          disabled
          value={"Posted Date : " + data?.postedDate.substring(0, 10)}
        />
        <textarea
          name="description"
          id=""
          value={"Description : " + data.description}
          disabled
          placeholder="Job Description"
          autoComplete="off"
        ></textarea>
        <textarea
          name="skills"
          id=""
          value={"Required Skills : " + data.skills}
          disabled
          placeholder="Skills Required (Separated by comman(,))"
          autoComplete="off"
        ></textarea>
        <textarea
          name="aboutCompany"
          id=""
          value={"About Company : " + data.aboutCompany}
          disabled
          placeholder="About Company"
          autoComplete="off"
        ></textarea>
        <div className={styles.loginSubmitButton}>
          <button
            type="button"
            onClick={() => {
              router.replace(`/dashboard/view-job-post/edit/${id}`);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              window.history.back();
            }}
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default Details;
