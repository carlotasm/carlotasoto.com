"use client";

import { useEffect } from "react";

/** Locks page scroll while a full-viewport stage is mounted. */
export function StageLock() {
  useEffect(() => {
    document.body.classList.add("is-stage-locked");
    return () => document.body.classList.remove("is-stage-locked");
  }, []);
  return null;
}
