import styles from "./FashionChoices.module.css";

export default function FashionChoices() {
  const recs = [
    { id: 1, title: "Blazer + Denim", items: ["blazer", "jeans", "heels"], img: "https://picsum.photos/seed/fit1/600/600" },
    { id: 2, title: "Cozy Pastel", items: ["sweater", "skirt", "flats"], img: "https://picsum.photos/seed/fit2/600/600" },
    { id: 3, title: "Street Minimal", items: ["jacket", "tee", "sneakers"], img: "https://picsum.photos/seed/fit3/600/600" },
    { id: 4, title: "Smart Casual", items: ["cardigan", "pants", "loafers"], img: "https://picsum.photos/seed/fit4/600/600" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <div className={styles.brandDot} />
          <div>
            <p className={styles.brandTiny}>FASHION</p>
            <p className={styles.brandName}>ADVICE</p>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.title}>Fashion Choices</h2>
          <p className={styles.subtitle}>
            Here are some fashion choices based on the image you uploaded.
          </p>

          <div className={styles.grid}>
            {recs.map((r) => (
              <article key={r.id} className={styles.item}>
                <img src={r.img} alt={r.title} className={styles.img} />
                <div className={styles.itemBody}>
                  <h3 className={styles.itemTitle}>{r.title}</h3>
                  <p className={styles.meta}>{r.items.join(" • ")}</p>
                  <div className={styles.actions}>
                    <button className={styles.like}>Like</button>
                    <button className={styles.alt}>View Details</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
