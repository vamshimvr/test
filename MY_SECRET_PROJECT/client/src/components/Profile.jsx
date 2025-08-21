import { useRef, useState } from "react";
import styles from "./Profile.module.css";
import ThemeToggle from "./ThemeCode/ThemeToggle";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Alexandra Parker",
    email: "alexandra.parker@example.com",
    mobile: "+1 234 567 8900",
    age: "28",
    gender: "Female",
    country: "United States",
  });
  const [avatar, setAvatar] = useState("");
  const fileRef = useRef(null);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.dot} />
          <div>
            <p className={styles.tiny}>FASHION</p>
            <p className={styles.name}>ADVICE</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className={styles.card}>
        <div className={styles.avatarWrap} onClick={() => fileRef.current?.click()}>
          <img
            className={styles.avatar}
            src={avatar || "https://picsum.photos/seed/profile/200/200"}
            alt="Profile"
          />
          <div className={styles.avatarBadge}>Change</div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hidden}
            onChange={onAvatar}
          />
        </div>

        <h1 className={styles.title}>{form.name}</h1>

        <div className={styles.grid}>
          {["email","mobile","age","gender","country"].map((key) => (
            <label className={styles.field} key={key}>
              <span className={styles.label}>{key[0].toUpperCase()+key.slice(1)}</span>
              <input
                className={styles.input}
                name={key}
                value={form[key]}
                onChange={onChange}
              />
            </label>
          ))}
        </div>

        <button className={styles.cta}>Save Profile</button>
      </div>
    </div>
  );
}
