"use client";
import React, { useEffect, useState } from "react";
import styles from "../dash.module.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import {
  MdOutlineClosedCaptionDisabled,
  MdOutlineFileOpen,
} from "react-icons/md";
import { RiFileCopy2Line } from "react-icons/ri";
import axios, { AxiosError } from "axios";

function Dashboard() {
  const [total, setTotal] = useState(() => 0);
  const [opened, setOpened] = useState(() => 0);
  const [closed, setClosed] = useState(() => 0);
  const date = new Date();
  const actualDate =
    date.getDate() + " - " + (date.getMonth() + 1) + " - " + date.getFullYear();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/portal/job-data/`)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setTotal(data.length);
          const fdata = response.data.data.filter((dt, i) => {
            return dt.status == "OPEN";
          });

          setOpened(fdata.length);

          const c = data.length - fdata.length;
          setClosed(c);
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.dashboardContentContainer}>
      <div className={styles.dashboardLeft}>
        <div className={styles.dashboardHeader}>
          <h1>Dashboard</h1>
          <p>
            <IoCalendarNumberOutline size={25} className={styles.calender} />
            {actualDate}
          </p>
        </div>

        <div className={styles.dashboardAnalytics}>
          <div className={styles.dashboardAnalyticsInner}>
            <div className={styles.analyticIconContainer}>
              <RiFileCopy2Line size={40} className={styles.analyticIcon} />
            </div>
            <div className={styles.analyticContent}>
              <p>Total Posted Jobs</p>
              <b>{total}</b>
            </div>
          </div>

          <div className={styles.dashboardAnalyticsInner}>
            <div className={styles.analyticIconContainer}>
              <MdOutlineFileOpen size={40} className={styles.analyticIcon} />
            </div>
            <div className={styles.analyticContent}>
              <p>Active Job Posts</p>
              <b>{opened}</b>
            </div>
          </div>

          <div className={styles.dashboardAnalyticsInner}>
            <div className={styles.analyticIconContainer}>
              <MdOutlineClosedCaptionDisabled
                size={40}
                className={styles.analyticIcon}
              />
            </div>
            <div className={styles.analyticContent}>
              <p>Closed Job Posts</p>
              <b>{closed}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
