"use client";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../../../dash.module.css";
import Image from "next/image";
import LoadingImg from "../../../../../public/loading.gif";
import axios, { isAxiosError } from "axios";

function CreateJobPost() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(() => false);
  const [data, setData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  function updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  async function onSubmitFunc(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    setLoading(true);
    if (
      data.password === "" ||
      data.newPassword === "" ||
      data.confirmPassword === ""
    ) {
      setError("Please fill all the below details!");
      setLoading(false);
      return;
    }
    if (data.newPassword != data.confirmPassword) {
      setError("New Password and Confirm Password Does not match");
      setLoading(false);
      return;
    }
    if (data.newPassword.length < 5) {
      setError("New Password must have alteast 5 character!");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("password", data.password.trim());
    formData.append("newPassword", data.newPassword.trim());
    formData.append("confirmPassword", data.confirmPassword.trim());
    axios
      .post(`http://localhost:5000/api/v1/portal/update/password`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          console.log(200);
          alert("Updated Successfully...");
          setError("");
          setData({
            password: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else if (response.status === 401) {
          setError("All Fields are required!");
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          console.log(error.response?.data?.error);
          setError(error.response?.data?.error);
          setLoading(false);
        }
      });
  }

  return (
    <div className={styles.createPostContainer}>
      <div className={styles.createPostHeader}>
        <h1>Account Info</h1>
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
              All fields are required and Password must have atleast 5 character
            </small>
          </b>
        )}
        <input
          type="password"
          placeholder="Current Password"
          name="password"
          autoComplete="off"
          value={data.password}
          onChange={updateValue}
        />
        <input
          type="text"
          placeholder="New Password"
          name="newPassword"
          autoComplete="off"
          value={data.newPassword}
          onChange={updateValue}
        />
        <input
          type="text"
          placeholder="Confirm Password"
          name="confirmPassword"
          autoComplete="off"
          value={data.confirmPassword}
          onChange={updateValue}
        />

        <div className={styles.loginSubmitButton}>
          {loading == false && <button type="submit">Update</button>}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateJobPost;
