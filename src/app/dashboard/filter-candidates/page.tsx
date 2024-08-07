"use client";
import { useRouter } from "next/navigation";
import styles from "../../page.module.css";
import { useEffect, useState } from "react";
import {
  MdWorkHistory,
  MdLocationPin,
  MdDateRange,
  MdOutlineArrowRightAlt,
} from "react-icons/md";
import { individualJob } from "@/types/index.types";
import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { JobAndCandidate } from "@/types/index.types";

export default function FilterCandidates() {
  //All Hooks Declaration
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>(() => "");
  const [allJobPosts, setAllJobPosts] = useState([]);
  const [filtrePost, setAllFiltrePost] = useState([]);
  //All Function Definition
  function searchFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearchValue(value);
    const fdata = allJobPosts.filter((item: individualJob, index) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
    setAllFiltrePost(fdata);
  }
  //For fetching the all job post
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/portal/candidates/for-all-post")
      .then((response) => {
        if (response.status === 200) {
          setAllJobPosts(response.data.data);
          setAllFiltrePost(response.data.data);
        }
      })
      .catch((error: ApiError) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.filtreCompanyContainer}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search for specific job role..."
        name="search"
        value={searchValue}
        onChange={searchFieldChange}
        autoComplete="off"
      />

      <small>
        All Available Oppurtunity <b> {allJobPosts.length}</b>
      </small>

      <div className={styles.listedJobCardContainer}>
        {filtrePost.length != 0 ? (
          filtrePost.map((data: JobAndCandidate, index) => {
            return (
              <div
                className={styles.individualListedJobCard}
                key={"ListedJobCard" + index}
              >
                <p className={styles.companyName}>{data.company}</p>
                <h3 className={styles.jobTitle}>{data.title}</h3>
                <div className={styles.experienceContainer}>
                  <span>
                    <MdWorkHistory className={styles.cardIcon} />{" "}
                    <small>{data.experience}</small>
                  </span>

                  <span>
                    <MdLocationPin className={styles.cardIcon} />{" "}
                    <small>{data?.location}</small>
                  </span>
                  <span>
                    <MdDateRange className={styles.cardIcon} />
                    <small>{data.postedDate.substring(0, 10)}</small>
                  </span>
                </div>

                <div className={styles.reuiredSkills}>
                  {data.skills
                    .trim()
                    .split(",")
                    .map((skill, index) => {
                      return (
                        index < 3 && (
                          <span key={"skill" + index + data._id}>{skill}</span>
                        )
                      );
                    })}
                </div>
                <div className={styles.buttonConatiner}>
                  <b>{data.salary}</b>
                  {data?.candidates.length != 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/dashboard/filter-candidates/${data._id}`);
                      }}
                    >
                      Total Applied Candiddates : {data?.candidates.length}{" "}
                      <MdOutlineArrowRightAlt
                        size={20}
                        className={styles.insideBtnIcon}
                      />
                    </button>
                  ) : (
                    <p>Total Applied Candiddates : 0</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No Oppurtunity Found !</p>
        )}
      </div>
    </div>
  );
}