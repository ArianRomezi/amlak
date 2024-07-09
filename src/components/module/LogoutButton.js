"use client";

import styles from "@/module/LogoutButton.module.css";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  return (
    <button className={styles.button} onClick={signOut}>
      <FiLogOut />
      خروج
    </button>
  );
};

export default LogoutButton;
