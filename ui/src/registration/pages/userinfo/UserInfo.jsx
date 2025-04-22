"use client";

import React, { useState } from "react";
import { Auth, API } from "aws-amplify";
import { useRouter } from "next/navigation";
import styles from "./UserInfo.module.css";

export default function UserInfo() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // get the Cognito user sub to use as your DynamoDB key
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.attributes.sub;

      // replace 'UserApi' and '/users' with your actual API name and path
      await API.post("UserApi", "/users", {
        body: {
          userId,
          firstName,
          lastName,
          ssn,
          profileComplete: true,
          approved: false,
        },
      });

      setSuccessMsg("Info saved! Redirecting...");
      setTimeout(() => {
        router.push("/waiting-approval");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save information.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Arbitrage</h1>
        </header>

        <h2 className={styles.title}>Complete Your Profile</h2>

        <form className={styles.infoForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className={styles.inputField}
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className={styles.inputField}
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ssn" className={styles.label}>
              Social Security Number
            </label>
            <input
              type="text"
              id="ssn"
              className={styles.inputField}
              placeholder="XXX-XX-XXXX"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

          <button type="submit" className={styles.submitBtn}>
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
