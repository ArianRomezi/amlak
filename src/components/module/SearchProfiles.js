"use client";

import { useState } from "react";
import { searchProfiles } from "@/app/actions/searchProfiles";
import Card from "@/module/Card";
import Loader from "@/module/Loader";
import styles from "@/module/SearchProfiles.module.css";

export default function SearchProfiles() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const { profiles: results, error: err } = await searchProfiles({ query });

      if (err) {
        setError(err);
        setProfiles([]);
      } else {
        setProfiles(results || []);
      }
    } catch {
      setError("خطایی در جستجو به وجود آمد.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>جستجوی املاک بر اساس عنوان</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="کلمات کلیدی را وارد کنید (مثال: ویلای 200)"
          aria-label="جستجوی عنوان ملک"
          autoComplete="off"
          className={styles.input}
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "جستجو در حال انجام..." : "جستجو"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {profiles.length === 0 && !loading && !error && (
        <p className={styles.hint}>نتیجه‌ای پیدا نشد.</p>
      )}

      {loading && <p className={styles.hint}>در حال بارگذاری...</p>}

      <div className={styles.grid}>
        {profiles.map((profile) => (
          <Card key={profile._id} data={profile} />
        ))}
      </div>
    </section>
  );
}
