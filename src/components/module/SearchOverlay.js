"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { searchProfiles } from "@/app/actions/searchProfiles";
import Card from "@/module/Card";
import Loader from "@/module/Loader";
import styles from "@/module/SearchOverlay.module.css";

const DEBOUNCE_MS = 5000;

/**
 * Client-side search overlay for the buy-residential page.
 *
 * - A floating search icon button opens/closes a modal.
 * * While the user types, searchProfiles is debounced by 5 seconds.
 * - Loading state, results (as Cards), errors, and empty state are rendered
 *   inside the same modal as they come in.
 */
export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const activeRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cancel pending debounce when the component unmounts or the modal closes.
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Guard against state updates after unmount.
  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  // Close modal on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Debounced search: fires DEBOUNCE_MS after the user stops typing.
  useEffect(() => {
    clearTimer();
    setError(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      try {
        const { profiles: results, error: err } = await searchProfiles({
          query: trimmed,
        });

        if (!activeRef.current) return;

        if (err) {
          setError(err);
          setProfiles([]);
        } else {
          setProfiles(results || []);
        }
      } catch {
        if (!activeRef.current) return;
        setError("خطایی در جستجو به وجود آمد.");
        setProfiles([]);
      } finally {
        if (!activeRef.current) return;
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [query, clearTimer]);

  const open = () => {
    setQuery("");
    setProfiles([]);
    setError(null);
    setLoading(false);
    setIsOpen(true);
  };

  const close = () => {
    clearTimer();
    setIsOpen(false);
  };

  const toggle = () => (isOpen ? close() : open());

  return (
    <>
      {/* Floating search icon button */}
      <button
        type="button"
        className={styles.fab}
        onClick={toggle}
        aria-label="جستجوی املاک"
        aria-expanded={isOpen}
      >
        {isOpen ? <BiX /> : <BiSearch />}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="جستجوی املاک"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header + search input */}
            <div className={styles.searchBar}>
              <BiSearch className={styles.searchIcon} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="عنوان ملک را جستجو کنید (مثلاً ویلای 200 متری)"
                className={styles.input}
                aria-label="متن جستجو"
              />
              {query.trim() && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setQuery("")}
                  aria-label="پاک کردن متن جستجو"
                >
                  <BiX />
                </button>
              )}
            </div>

            <div className={styles.body}>
              {loading ? (
                <div className={styles.center}>
                  <Loader />
                  <p className={styles.hint}>در حال جستجو...</p>
                </div>
              ) : error ? (
                <p className={styles.error}>{error}</p>
              ) : profiles.length === 0 && query.trim().length > 0 ? (
                <p className={styles.hint}>نتیجه‌ای پیدا نشد.</p>
              ) : (
                <div className={styles.grid}>
                  {profiles.map((profile) => (
                    <Card key={profile._id} data={profile} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
