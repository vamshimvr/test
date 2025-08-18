import { useMemo, useState } from "react";
import styles from "./Wardrobe.module.css";

export default function Wardrobe() {
  const [items, setItems] = useState([]); // {src, name}
  const [dragOver, setDragOver] = useState(false);

  const onFiles = (files) => {
    const mapped = [...files].slice(0, 12).map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setItems((prev) => [...mapped, ...prev].slice(0, 12));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  };

  const grid = useMemo(() => {
    const placeholders = Array(Math.max(0, 8 - items.length)).fill(null);
    return [...items, ...placeholders];
  }, [items]);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandDot} />
            <div>
              <p className={styles.brandTiny}>FASHION</p>
              <p className={styles.brandName}>ADVICE</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.title}>My Wardrobe</h2>

          <div
            className={`${styles.drop} ${dragOver ? styles.dropActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <input
              id="wardrobeFile"
              type="file"
              accept="image/*"
              multiple
              className={styles.hidden}
              onChange={(e) => e.target.files && onFiles(e.target.files)}
            />
            <label htmlFor="wardrobeFile" className={styles.dropLabel}>
              <div className={styles.dot} />
              <p>Upload an image</p>
              <small>Drag & drop or click to select</small>
            </label>
          </div>

          <div className={styles.grid}>
            {grid.map((it, i) =>
              it ? (
                <figure key={i} className={styles.tile} title={it.name}>
                  <img src={it.src} alt={it.name} className={styles.img} />
                </figure>
              ) : (
                <div key={i} className={`${styles.tile} ${styles.placeholder}`} />
              )
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cta}
              onClick={() => document.getElementById("wardrobeFile")?.click()}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
