"use client";
import React, { FormEvent, TextareaHTMLAttributes, useState } from "react";
import styles from "../../dash.module.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import Image from "next/image";
import LoadingImg from "../../../../public/loading.gif";
import axios, { isAxiosError } from "axios";

function CreateJobPost() {
  const date = new Date();
  const actualDate =
    date.getDate() + " - " + (date.getMonth() + 1) + " - " + date.getFullYear();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(() => false);
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
  });

  function updateValue(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  async function onSubmitFunc(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setLoading(true);
    if (isNaN(parseInt(data.experience))) {
      setLoading(false);
      return setError("Experince should only be a number !");
    }
    const formData = new FormData();
    formData.append("company", data.company.trim());
    formData.append("aboutCompany", data.aboutCompany.trim());
    formData.append("title", data.title.trim());
    formData.append("experience", data.experience.trim());
    formData.append("skills", data.skills.trim());
    formData.append("location", data.location.trim());
    formData.append("minimumEducation", data.minimumEducation.trim());
    formData.append("salary", data.salary.trim());
    formData.append("joining", data.joining.trim());
    formData.append("description", data.description.trim());

    axios
      .post(`http://localhost:5000/api/v1/portal/job-listing`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          alert("Job Post Created Successfully...");
          window.location.reload();
          setData({
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
          });
        } else if (response.status === 401) {
          setError("All Fields are required!");
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log(error);
          setError("Something Wents Wrong");
          setLoading(false);
        }
      });
  }

  return (
    <div className={styles.createPostContainer}>
      <div className={styles.createPostHeader}>
        <h1>Create Job Posts</h1>
        <p>
          <IoCalendarNumberOutline size={25} className={styles.calender} />
          {actualDate}
        </p>
      </div>

      <form
        className={styles.createJobPostForm}
        method="post"
        onSubmit={onSubmitFunc}
        encType="multipart/form-data"
      >
        {error != "" ? (
          <b>
            Error :<small className={styles.error}>{error}</small>
          </b>
        ) : (
          <b>
            Note :
            <small className={styles.required}>
              All fields are required and experience should be in number
            </small>
          </b>
        )}
        <input
          type="text"
          placeholder="Company Name"
          name="company"
          autoComplete="off"
          onChange={updateValue}
          value={data.company}
          required
        />
        <input
          type="text"
          placeholder="Job Position (Title)"
          name="title"
          autoComplete="off"
          onChange={updateValue}
          value={data.title}
          required
        />

        <input
          type="text"
          placeholder="Minimum Experience Required (In format like 2)"
          name="experience"
          autoComplete="off"
          onChange={updateValue}
          value={data.experience}
          required
          minLength={1}
          maxLength={2}
        />
        <input
          type="text"
          placeholder="Minimum Qualification (In formate like B.tech in CSE)"
          name="minimumEducation"
          autoComplete="off"
          onChange={updateValue}
          value={data.minimumEducation}
          required
        />
        <input
          type="text"
          placeholder="Job Location"
          name="location"
          autoComplete="off"
          onChange={updateValue}
          value={data.location}
        />
        <input
          type="text"
          placeholder="Salary Range (Per Year)"
          name="salary"
          autoComplete="off"
          onChange={updateValue}
          value={data.salary}
        />
        <input
          type="text"
          placeholder="Joining Timing"
          name="joining"
          autoComplete="off"
          onChange={updateValue}
          value={data.joining}
        />
        <textarea
          name="description"
          id=""
          value={data.description}
          onChange={updateValue}
          placeholder="Job Description"
          autoComplete="off"
        ></textarea>
        <textarea
          name="skills"
          id=""
          value={data.skills}
          onChange={updateValue}
          placeholder="Skills Required (Separated by comman(,))"
          autoComplete="off"
        ></textarea>
        <textarea
          name="aboutCompany"
          id=""
          value={data.aboutCompany}
          onChange={updateValue}
          placeholder="About Company"
          autoComplete="off"
        ></textarea>

        <div className={styles.loginSubmitButton}>
          {loading == false && <button type="submit">Submit</button>}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateJobPost;
