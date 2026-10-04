"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  /** The inline trigger content (a word, or a citation label). */
  trigger: ReactNode;
  /** Accessible name for the popover panel. */
  label: string;
  children: ReactNode;
  triggerClassName?: string;
}

/**
 * A small inline disclosure: tap or click the trigger (or press Enter/Space)
 * to show a panel, Escape or tapping elsewhere to close. Mouse users also get
 * it on hover. Built from spans so it can sit inside a paragraph.
 */
export function InlinePopover({ trigger, label, children, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // On wider screens the panel hangs below the trigger; nudge it sideways so
  // it stays on screen. On phones it's a sheet pinned to the bottom (CSS).
  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const rect = panelRef.current.getBoundingClientRect();
    const gutter = 12;
    const overflowRight = rect.right - (window.innerWidth - gutter);
    const overflowLeft = gutter - rect.left;
    if (overflowRight > 0) setShift((s) => s - overflowRight);
    else if (overflowLeft > 0) setShift((s) => s + overflowLeft);
  }, [open]);

  const onMouseEnter = (e: React.MouseEvent) => {
    if ((e.nativeEvent as PointerEvent).pointerType === "touch") return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(true), 250);
  };
  const onMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <span ref={wrapRef} className="relative inline" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setShift(0);
          setOpen((o) => !o);
        }}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <span
          ref={panelRef}
          id={id}
          role="dialog"
          aria-label={label}
          style={{ transform: `translateX(${shift}px)` }}
          className="fixed inset-x-3 bottom-3 z-40 block rounded-xl border border-border bg-surface p-4 text-left text-base font-normal leading-relaxed text-text shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:w-80 sm:rounded-lg sm:p-3 sm:text-[0.95rem] sm:shadow-lg"
        >
          <button
            type="button"
            onClick={() => {
              close();
              buttonRef.current?.focus();
            }}
            className="float-right -mr-1 -mt-1 ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 sm:hidden"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close</span>
          </button>
          {children}
        </span>
      )}
    </span>
  );
}
