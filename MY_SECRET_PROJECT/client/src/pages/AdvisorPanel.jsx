import { useState } from "react";
import styles from "./AdvisorPanel.module.css";
import ThemeToggle from "../components/ThemeCode/ThemeToggle";

export default function AdvisorPanel() {
  const [notes, setNotes] = useState("");
  const suggestions = [
    { id: 1, title: "Weekend Casual", img: "https://picsum.photos/seed/a1/640/480" },
    { id: 2, title: "Office Smart", img: "https://picsum.photos/seed/a2/640/480" },
    { id: 3, title: "Evening Chic", img: "https://picsum.photos/seed/a3/640/480" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.dot} />
          <div>
            <p className={styles.tiny}>FASHION</p>
            <p className={styles.name}>ADVICE — Advisor</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className={styles.layout}>
        <section className={styles.card}>
          <h2 className={styles.title}>Client Upload</h2>
          <img className={styles.preview} src="https://picsum.photos/seed/client/640/800" alt="client"/>
        </section>

        <section className={styles.card}>
          <h2 className={styles.title}>AI Suggestions</h2>
          <div className={styles.grid}>
            {suggestions.map(s => (
              <figure key={s.id} className={styles.sugg}>
                <img src={s.img} alt={s.title} />
                <figcaption>{s.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.title}>Advisor Notes</h2>
          <textarea
            className={styles.textarea}
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your advice here…"
          />
          <div className={styles.actions}>
            <button className={styles.primary}>Send Advice</button>
            <button className={styles.secondary}>Save Draft</button>
          </div>
        </section>
      </div>
    </div>
  );
}
