import { useState } from "react";
import styles from "./RoleSwitch.module.css";
import ThemeToggle from "./ThemeCode/ThemeToggle";

const ROLES = ["User", "Advisor", "Developer", "Tester", "Admin"];

export default function RoleSwitch() {
  const [role, setRole] = useState("User");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.dot} />
          <div>
            <p className={styles.tiny}>FASHION</p>
            <p className={styles.name}>ADVICE — Settings</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.section}>
          <h2 className={styles.h2}>Switch Role</h2>
          <div className={styles.roles}>
            {ROLES.map((r) => (
              <button
                key={r}
                className={`${styles.pill} ${role === r ? styles.active : ""}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.h2}>Preferences</h2>
          <p className={styles.muted}>Use the toggle in the header to switch between Dark/Light themes.</p>
        </div>

        <button className={styles.cta}>Save Settings</button>
      </div>
    </div>
  );
}
