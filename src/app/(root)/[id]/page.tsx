"use client";
import { useParams } from "next/navigation";
import styles from "../../page.module.css";
import JobDescription from "@/components/JobDescription";
import ApplyForm from "@/components/ApplyForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const isValidObjectId = (id: any) => {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(id);
  };
  const id = useParams().id;
  const router = useRouter();
  if (!isValidObjectId(id)) {
    return router.replace("/");
  }

  const [displayForm, setDisplayForm] = useState<boolean>(() => false);

  return (
    <div className={styles.individualJobDetailsContainer}>
      {displayForm ? (
        <ApplyForm jobId={id} />
      ) : (
        <JobDescription changeDisplay={setDisplayForm} jobId={id} />
      )}
    </div>
  );
}
