"use client";
import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";

import UserTable from "@/components/UserTable";

function ViewJobPost() {
  const [data, setData] = useState(() => []);
  const [filtreData, setFiltreData] = useState(() => []);
  const tableHead = [
    "sno",
    "name",
    "Username",
    "Email",
    "Employee Id",
    "Designation",
    "Actions",
  ];
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/other-user/`, {
        withCredentials: true,
      })
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
    <UserTable
      data={data}
      filtreData={filtreData}
      tableHead={tableHead}
      setFiltreData={setFiltreData}
      viewLink={"/dashboard/view-job-post/see"}
      editLink={"/dashboard/view-job-post/edit"}
      deleteLink={"#"}
      heading={"Listed Users"}
    />
  );
}

export default ViewJobPost;
