"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./AuthButton.module.css";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (session) {
    return (
      <div className={styles.container}>
        <div className={styles.profile}>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className={styles.avatar}
            />
          )}
          <span className={styles.name}>{session.user?.name}</span>
        </div>
        <button className={styles.button} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
    </div>
  );
}
