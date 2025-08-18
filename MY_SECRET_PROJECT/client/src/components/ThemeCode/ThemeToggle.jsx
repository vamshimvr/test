import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [mode, setMode] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <button
      className={styles.switch}
      onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className={styles.knob} data-mode={mode} />
      <span className={styles.label}>{mode === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
