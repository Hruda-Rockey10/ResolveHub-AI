import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Hrudananda Behera</p>

        <div className="flex gap-4">
          <Link
            href="https://github.com/Hruda-Rockey10"
            target="_blank"
            className="underline"
          >
            GitHub
          </Link>

          <Link
            href="https://www.linkedin.com/in/hruda10/"
            target="_blank"
            className="underline"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
