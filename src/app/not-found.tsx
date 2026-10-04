import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-medium text-muted">Page not found</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="mt-4 text-muted">The link may be old, or the page may have moved.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-medium text-on-accent hover:bg-accent-hover"
      >
        Go to the home page
      </Link>
    </div>
  );
}
