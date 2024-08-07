"use client";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../../dash.module.css";
import Image from "next/image";
import LoadingImg from "../../../../public/loading.gif";
import axios, { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/navigation";

function CreateJobPost() {
  const [data, setData] = useState({
    name: "",
    employeeId: "",
    designation: "",
    username: "",
    password: "",
    email: "",
  });

  //use effect
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/account-info`, {
        withCredentials: true,
      })
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
        <h1>Account Info</h1>
      </div>

      <form className={styles.createJobPostForm}>
        <input
          type="text"
          placeholder="Enter your name...."
          name="name"
          autoComplete="off"
          value={data.name}
          disabled
        />
        <input
          type="email"
          placeholder="Enter your email...."
          name="email"
          autoComplete="off"
          disabled
          value={data.email}
        />
        <input
          type="text"
          placeholder="Enter your designation...."
          name="designation"
          autoComplete="off"
          disabled
          value={data.designation}
        />
        <input
          type="text"
          placeholder="Enter your employee id...."
          name="employeeId"
          autoComplete="off"
          disabled
          value={data.employeeId}
        />
        <input
          type="text"
          placeholder="Enter your username...."
          name="username"
          autoComplete="off"
          value={data.username}
          disabled
        />
      </form>
    </div>
  );
}

export default CreateJobPost;
