"use client";
import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import CustomTable from "@/components/CustomTable";

function ViewJobPost() {
  const [data, setData] = useState(() => []);
  const [filtreData, setFiltreData] = useState(() => []);
  const tableHead = [
    "sno",
    "company",
    "title",
    "experience",
    "salary",
    "status",
    "actions",
  ];
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/job-data/`)
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
    <CustomTable
      data={data}
      filtreData={filtreData}
      tableHead={tableHead}
      setFiltreData={setFiltreData}
      viewLink={"/dashboard/view-job-post/see"}
      editLink={"/dashboard/view-job-post/edit"}
      deleteLink={"#"}
      heading={"All Listed Job Posts"}
    />
  );
}

export default ViewJobPost;
