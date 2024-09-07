"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import CandidatesTable from "@/components/CandidatesTable";
import { useParams, useRouter } from "next/navigation";

function ViewJobPost() {
  const isValidObjectId = (id: any) => {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id);
  };
  const id = useParams().id;
  const router = useRouter();
  if (!isValidObjectId(id)) {
    return router.back();
  }
  const [data, setData] = useState(() => []);
  const [filtreData, setFiltreData] = useState(() => []);
  const tableHead = [
    "sno",
    "name",
    "email",
    "Education",
    "skills",
    "Resume",
    "Actions",
  ];
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/v1/portal/candidates/for-particular-post/${id}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setData(response.data.data);
          setFiltreData(response.data.data);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);

  return (
    <CandidatesTable
      data={data}
      filtreData={filtreData}
      tableHead={tableHead}
      setFiltreData={setFiltreData}
      deleteLink={"#"}
      heading={"Filtred Candidates"}
    />
  );
}

export default ViewJobPost;
