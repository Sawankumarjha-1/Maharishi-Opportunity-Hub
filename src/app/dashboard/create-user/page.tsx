"use client";
import React, { FormEvent, TextareaHTMLAttributes, useState } from "react";
import styles from "../../dash.module.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import Image from "next/image";
import LoadingImg from "../../../../public/loading.gif";
import axios, { isAxiosError } from "axios";

function CreateJobPost() {
  const [data, setData] = useState({
    name: "",
    employeeId: "",
    designation: "",
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  //Update the data field value based on user input
  function updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    console.log(name, value);
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  async function onSubmitFunc(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("username", data.username.trim());
    formData.append("password", data.password.trim());
    formData.append("name", data.name.trim());
    formData.append("designation", data.designation.trim());
    formData.append("employeeId", data.employeeId.trim());
    formData.append("email", data.email.trim());
    axios
      .post(`http://localhost:5000/api/v1/portal/create-user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          alert("User created successfully....");
        } else if (response.status === 401) {
          setError("Invalid Credential");
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log(error);
          setError("Something Wents Wrong");
          setLoading(false);
        }
      });
    setData({
      name: "",
      employeeId: "",
      designation: "",
      username: "",
      password: "",
      email: "",
    });
  }

  return (
    <div className={styles.createPostContainer}>
      <div className={styles.createPostHeader}>
        <h1>Create User</h1>
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
              Password Must Be Alteast 5 Character
            </small>
          </b>
        )}

        <input
          type="text"
          placeholder="Enter your name...."
          name="name"
          autoComplete="off"
          onChange={updateValue}
          value={data.name}
          required
        />
        <input
          type="email"
          placeholder="Enter your email...."
          name="email"
          autoComplete="off"
          onChange={updateValue}
          value={data.email}
          required
        />
        <input
          type="text"
          placeholder="Enter your designation...."
          name="designation"
          autoComplete="off"
          onChange={updateValue}
          value={data.designation}
          required
        />
        <input
          type="text"
          placeholder="Enter your employee id...."
          name="employeeId"
          autoComplete="off"
          onChange={updateValue}
          value={data.employeeId}
          required
        />
        <input
          type="text"
          placeholder="Enter your username...."
          name="username"
          autoComplete="off"
          onChange={updateValue}
          value={data.username}
          required
        />
        <input
          type="password"
          placeholder="Enter your password...."
          name="password"
          autoComplete="off"
          onChange={updateValue}
          value={data.password}
          required
        />
        <div className={styles.loginSubmitButton}>
          {loading == false && <button type="submit">Create user</button>}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateJobPost;
