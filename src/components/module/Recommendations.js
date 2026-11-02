"use client";

import { useEffect, useState } from "react";
import Card from "@/module/Card";
import Title from "@/module/Title";
import Loader from "@/module/Loader";
import { getSessionId } from "@/utils/session";
import styles from "@/module/Recommendations.module.css";

const SIMILAR_TITLE = "آگهی‌های مشابه";
const ALSO_VIEWED_TITLE = "کاربران دیگر این آگهی‌ها را نیز دیده‌اند";

function Recommendations({ profileId, similar = [], alsoViewed = [] }) {
  const [data, setData] = useState({ similar, alsoViewed });
  const [loading, setLoading] = useState(!similar.length && !alsoViewed.length);

  // eslint-disable-next-line react-hooks/exhaustive-deps
// deps intentionally limited to profileId: the server already passes
// similar/alsoViewed, so the client fallback fetch must run only once.
useEffect(() => {
    let active = true;

    // Log this page view for co-visitation (collaborative filtering) tracking.
    const sessionId = getSessionId();
    if (sessionId) {
      fetch(`/api/profile/view/${profileId}`, {
        method: "POST",
        headers: { "x-session-id": sessionId },
      }).catch(() => {});
    }

    // Client fallback: fetch recommendations if not passed from the server.
    if (!similar.length && !alsoViewed.length) {
      fetch(`/api/profile/recommendations/${profileId}`)
        .then((res) => res.json())
        .then((res) => {
          if (!active) return;
          setData({ similar: res.similar || [], alsoViewed: res.alsoViewed || [] });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    return () => {
      active = false;
    };
  }, [profileId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  const renderRow = (title, items) => {
    if (!items || !items.length) return null;
    return (
      <section className={styles.section}>
        <Title>{title}</Title>
        <div className={styles.grid}>
          {items.map((p) => (
            <Card key={p._id} data={p} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={styles.container}>
      {renderRow(SIMILAR_TITLE, data.similar)}
      {renderRow(ALSO_VIEWED_TITLE, data.alsoViewed)}
    </div>
  );
}

export default Recommendations;
