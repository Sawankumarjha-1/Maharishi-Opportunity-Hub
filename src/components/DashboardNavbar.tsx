"use client";
import React, { useState } from "react";
import Image from "next/image";
import CircleLogo from "../../public/CircleIcon.png";
import { FaFile, FaHome, FaUser, FaUserFriends } from "react-icons/fa";
import Link from "next/link";
import { IoLogOut, IoSettings } from "react-icons/io5";
import styles from "../app/dash.module.css";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { MdAddChart, MdEdit } from "react-icons/md";

function DashboardNavbar() {
  const [expand, setExpand] = useState<boolean>(true);
  const pathname = usePathname();

  function logout() {
    axios
      .get(`http://localhost:5000/api/v1/portal/logout`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          return window.location.reload();
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
  return (
    <nav className={styles.dashboardNavbar}>
      <span className={styles.imageSpan}>
        <Image
          src={CircleLogo}
          alt="Not Found"
          onClick={() => {
            if (expand === false) {
              setExpand(true);
            } else {
              setExpand(false);
            }
          }}
        />
        {expand && <p>Maharishi University</p>}
      </span>

      <span>
        <Link href={"/dashboard"}>
          <FaHome size={30} className={styles.icon} />
          {expand && (
            <p className={`${pathname === "/dashboard" && styles.activeLink}`}>
              Dashboard
            </p>
          )}
        </Link>
      </span>

      <span>
        <Link href={"/dashboard/create-job-post"}>
          <MdAddChart size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/create-job-post" && styles.activeLink
              }`}
            >
              Create Job Post
            </p>
          )}
        </Link>
      </span>
      <span>
        <Link href={"/dashboard/create-user"}>
          <FaUser size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/create-user" && styles.activeLink
              }`}
            >
              Create User
            </p>
          )}
        </Link>
      </span>

      <span>
        <Link href={"/dashboard/view-job-post"}>
          <FaFile size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/view-job-post" && styles.activeLink
              }`}
            >
              Listed Job Posts
            </p>
          )}
        </Link>
      </span>

      <span>
        <Link href={"/dashboard/listed-user"}>
          <FaUser size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/listed-user" && styles.activeLink
              }`}
            >
              Listed User
            </p>
          )}
        </Link>
      </span>
      <span>
        <Link href={"/dashboard/filter-candidates"}>
          <FaUser size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/filter-candidates" && styles.activeLink
              }`}
            >
              Filtered Candidates
            </p>
          )}
        </Link>
      </span>

      <span>
        <Link href={"/dashboard/account-info"}>
          <IoSettings size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/account-info" && styles.activeLink
              }`}
            >
              Account Info
            </p>
          )}
        </Link>
      </span>
      <span>
        <Link href={"/dashboard/account-info/update-password"}>
          <MdEdit size={30} className={styles.icon} />
          {expand && (
            <p
              className={`${
                pathname === "/dashboard/account-info/update-password" &&
                styles.activeLink
              }`}
            >
              Update Password
            </p>
          )}
        </Link>
      </span>
      <span>
        <Link href={""} onClick={logout}>
          <IoLogOut size={30} className={styles.icon} />
          {expand && <p>Logout</p>}
        </Link>
      </span>
    </nav>
  );
}

export default DashboardNavbar;
