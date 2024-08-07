"use client";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../../../../dash.module.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import Image from "next/image";
import LoadingImg from "../../../../../../public/loading.gif";
import axios, { AxiosError, isAxiosError } from "axios";
import { useParams } from "next/navigation";

function CreateJobPost() {
  const id = useParams().id; //Getting id from params
  //all hooks variable
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
    status: "",
  });

  //all functions
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
    if (data.status != "OPEN" && data.status != "CLOSED") {
      setError("STATUS can only be OPEN or CLOSED");
      setLoading(false);
      return;
    }
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
    formData.append("status", data.status.trim());

    axios
      .post(
        `http://localhost:5000/api/v1/portal/update/job-listing/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          alert("Updated Successfully...");
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
            status: "",
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
  //use effect
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
      <div className={styles.createPostHeader}>
        <h1>Edit Job Posts</h1>
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
              All fields are required and Status Either (OPEN OR CLOSED){" "}
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
          placeholder="Minimum Experience Required"
          name="experience"
          autoComplete="off"
          onChange={updateValue}
          value={data.experience}
          minLength={1}
          maxLength={2}
          required
        />
        <input
          type="text"
          placeholder="Minimum Qualification"
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
          required
        />
        <input
          type="text"
          placeholder="Salary Range (Per Year)"
          name="salary"
          autoComplete="off"
          onChange={updateValue}
          value={data.salary}
          required
        />
        <input
          type="text"
          placeholder="Joining Timing"
          name="joining"
          autoComplete="off"
          onChange={updateValue}
          value={data.joining}
          required
        />
        <input
          type="text"
          placeholder="Status Either (OPEN OR CLOSED)"
          name="status"
          autoComplete="off"
          onChange={updateValue}
          value={data.status}
          required
        />
        <textarea
          name="description"
          id=""
          value={data.description}
          onChange={updateValue}
          placeholder="Job Description"
          autoComplete="off"
          required
        ></textarea>
        <textarea
          name="skills"
          id=""
          value={data.skills}
          onChange={updateValue}
          placeholder="Skills Required (Separated by comman(,))"
          autoComplete="off"
          required
        ></textarea>
        <textarea
          name="aboutCompany"
          id=""
          value={data.aboutCompany}
          onChange={updateValue}
          placeholder="About Company"
          autoComplete="off"
          required
        ></textarea>

        <div className={styles.loginSubmitButton}>
          {loading == false && (
            <>
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => {
                  window.history.back();
                }}
              >
                Go Back
              </button>
            </>
          )}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateJobPost;
