"use client";

import { useEffect } from "react";

export default function HashCleaner() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = setTimeout(() => {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  return null;
}
