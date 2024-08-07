"use client";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../app/page.module.css";
import axios, { AxiosError } from "axios";
import LoadingImg from "../../public/loading.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { individualJob } from "@/types/index.types";
function ApplyForm({ jobId }: { jobId: any }) {
  const [jobData, setJobData] = useState<individualJob>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compatibleFileSize, setCompatibleFileSize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [data, setData] = useState({
    name: "",
    email: "",
    experience: "",
  });
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/job-data/${jobId}`)
      .then((response) => {
        if (response.status === 200) {
          setJobData(response.data.data);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);

  /******************Update Data Value using the user input****************/
  function updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  /*************************Handle File Input Change****************/
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const res = file.size / 1000 <= 1024;
      //Set Compatible and file size to check further whether it is according the our rules or not
      setCompatibleFileSize(res);
      setFileType(file.type);
    }
    setSelectedFile(file || null);
  }

  /*************************Call Whene Data Submit Button Trigger********************/
  async function onSubmitFunc(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (isNaN(parseInt(data.experience))) {
      setLoading(false);
      return setError("Experince should only be a number !");
    }
    if (
      data.name === undefined ||
      data.name === "" ||
      data.email === undefined ||
      data.email === "" ||
      data.experience === undefined ||
      data.experience === "" ||
      selectedFile === null
    ) {
      setLoading(false);
      return setError(
        "Please fill all the below details accurately!. All detials are required "
      );
    }

    /*************Email Validation*****/
    const EmailRE = /\S+@\S+\.\S+/;
    if (!EmailRE.test(data.email)) {
      setLoading(false);
      alert("Invalid Email address !");
      return setError("Invalid Email address !");
    }
    /*******************Image Type Compatibility************* */
    if (fileType !== "application/pdf") {
      setLoading(false);
      alert("Incompatible File Formate!");
      return setError("Incompatible File Formate");
    }
    /**********Image Size Should be less than or equal to 1MB*/
    if (!compatibleFileSize) {
      setLoading(false);
      alert("Image Size Should be less than 1 MB!");
      return setError("Image Size Should be less than 1 MB!");
    }

    let formD = new FormData();
    formD.append("name", data.name);
    formD.append("resume", selectedFile);
    formD.append("email", data.email);
    formD.append("experience", data.experience);

    axios
      .post(
        `http://localhost:5000/api/v1/portal/upload-candidate/${jobId}`,
        formD,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          alert(
            "Your application Submitted Successfully And You will receive mail if your resume shortlisted. Thanks For Applying!"
          );
          router.replace("/");
        }
      })
      .catch((error: AxiosError) => {
        setError("Something Wents Wrong !");
        setLoading(false);
        console.log(error);
      });
    setData({ name: "", email: "", experience: "" });
  }

  return (
    <div className={styles.formContainer}>
      <form method="post" onSubmit={onSubmitFunc} encType="multipart/form-data">
        <h3 className={styles.detailsJobTitle}>{jobData?.title}</h3>
        <p className={styles.detailsCompany}>{jobData?.company}</p>
        <p className={styles.importantNote}>
          Please Fill all the below details and for fresher experienced should
          be 0 !
        </p>
        {error != "" && (
          <b>
            Error :<small>{error}</small>
          </b>
        )}
        <p className={styles.importantNote}></p>

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
          type="text"
          placeholder="Enter your email...."
          name="email"
          autoComplete="off"
          onChange={updateValue}
          value={data.email}
          required
        />
        <input
          type="text"
          placeholder="Enter your experience in year...."
          name="experience"
          autoComplete="off"
          onChange={updateValue}
          value={data.experience}
          maxLength={2}
          minLength={1}
          required
        />
        <b>
          Upload Resume{" "}
          <small>(must be in pdf and size should be less than 1 MB)</small>:
        </b>
        <input type="file" onChange={handleFileChange} />
        <div className={styles.submitButton}>
          {loading == false && <button type="submit">Apply Now</button>}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </div>
  );
}

export default ApplyForm;
