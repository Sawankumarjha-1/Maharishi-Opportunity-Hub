"use client";
import React, { FormEvent, useState } from "react";
import styles from "../../dash.module.css";
import Image from "next/image";
import Logo from "../../../../public/MUIT.png";
import LoadingImg from "../../../../public/loading.gif";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
function Login() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //Update the data field value based on user input
  function updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

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
    axios
      .post(`http://localhost:5000/api/v1/portal/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          return router.replace("/dashboard");
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
    setData({ username: "", password: "" });
  }
  return (
    <div className={styles.credentialFormContainer}>
      <form
        className={styles.loginForm}
        onSubmit={onSubmitFunc}
        encType="multipart/form-data"
        method="post"
      >
        <Image src={Logo} alt="Logo" priority />
        <h2>Welcome Back: Let's Get Started</h2>
        <p>Enter Your Credentials to Proceed</p>
        {error != "" && (
          <b>
            Error :<small className={styles.error}>{error}</small>
          </b>
        )}
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
          {loading == false && <button type="submit">Login</button>}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}
export default Login;
