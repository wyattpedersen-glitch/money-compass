"use client";

import { useLayoutEffect } from "react";
import { applyBootState } from "@/lib/boot";
import { expectedPasscodeHash } from "@/lib/gate/hash";

/** Re-applies theme and gate state before paint after any client render of <html>. */
export function BootSync() {
  useLayoutEffect(() => {
    applyBootState(expectedPasscodeHash);
  }, []);
  return null;
}
