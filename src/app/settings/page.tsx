import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackupPanel } from "./BackupPanel";

export const metadata: Metadata = { title: "Settings and your data" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHeader title="Settings and your data" />
      <BackupPanel />
      <section aria-labelledby="where" className="mt-10 space-y-3 leading-relaxed">
        <h2 id="where" className="text-xl font-semibold">
          Where your data lives
        </h2>
        <p>
          Your budget, goals, tracker entries and lesson progress are saved{" "}
          <strong>only in this browser on this device</strong>, using a browser feature called local storage. Nothing is
          sent to a server, and nobody else can see it, including whoever runs this site.
        </p>
        <p>That has a few consequences worth knowing:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your phone and your laptop each keep their own separate copy. They don&apos;t sync on their own.</li>
          <li>A different browser on the same device (say, Safari and Chrome) also has its own separate copy.</li>
          <li>Clearing your browser&apos;s history or site data, or using a private/incognito window, can erase it.</li>
        </ul>
        <p>
          <strong>To move your data or keep it safe, use the backup above.</strong> Export a file on one device, send it
          to yourself (AirDrop, email, or a cloud drive), then import it on the other device. Importing replaces
          what&apos;s on that device, so export first if it has anything you want to keep.
        </p>
      </section>
    </div>
  );
}
