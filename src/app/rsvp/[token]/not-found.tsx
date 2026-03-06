import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-serif text-stone-800 mb-4">
        Invalid RSVP Link
      </h1>
      <p className="text-stone-600 text-lg mb-8 max-w-md">
        We couldn&apos;t find a family invitation matching this link. Please
        double-check the URL from your invitation or contact the family for
        assistance.
      </p>
      <Link
        href="/"
        className="bg-rose-900 text-white px-8 py-3 rounded-lg text-lg hover:bg-rose-800 transition-colors"
      >
        Go to Home
      </Link>
    </main>
  );
}
