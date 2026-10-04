"use client";

import { useEffect, useRef, useState } from "react";
import { glitchDuration, nextGlitchGap, swapWindow, wantsImmediateGlitch } from "@/lib/glitch/schedule";

const MAIN_TEXT = "For Daniel <3";
const ALT_TEXT = "For Diddy <3";

/**
 * The home-page greeting. Every few minutes (at random) it briefly glitches
 * like a worn VHS tape and, for a split second, reads something else.
 * Disabled entirely when the reader prefers reduced motion.
 * Add ?glitch=now to the URL to trigger it on demand.
 */
export function Greeting() {
  const [glitching, setGlitching] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const [duration, setDuration] = useState(450);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;

    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setGlitching(false);
      setSwapped(false);
    };

    const later = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const runGlitch = () => {
      if (cancelled || motionQuery.matches) return;
      const ms = glitchDuration();
      const { start, end } = swapWindow(ms);
      setDuration(ms);
      setGlitching(true);
      later(() => setSwapped(true), start);
      later(() => setSwapped(false), end);
      later(() => setGlitching(false), ms);
    };

    const scheduleNext = () => {
      later(() => {
        // Only glitch while someone could actually be looking.
        if (!document.hidden) runGlitch();
        scheduleNext();
      }, nextGlitchGap());
    };

    const start = () => {
      clearAll();
      if (motionQuery.matches) return;
      if (wantsImmediateGlitch(window.location.search)) later(runGlitch, 700);
      scheduleNext();
    };

    start();
    motionQuery.addEventListener("change", start);
    return () => {
      cancelled = true;
      motionQuery.removeEventListener("change", start);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const text = swapped ? ALT_TEXT : MAIN_TEXT;

  return (
    <h1 className="font-display text-[clamp(2.75rem,10vw,5.5rem)] font-semibold leading-[1.05] tracking-tight">
      {/* Screen readers always hear the real greeting. */}
      <span className="sr-only">For Daniel, with love</span>
      <span
        aria-hidden="true"
        className="glitch"
        data-text={text}
        data-glitching={glitching ? "true" : "false"}
        style={{ ["--glitch-ms" as string]: `${duration}ms` }}
      >
        {text}
        <span className="glitch-scan" />
      </span>
    </h1>
  );
}
