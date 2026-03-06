"use client";

import Link from "next/link";

interface Props {
  /** If provided, the arrow navigates to this href. If omitted, the arrow is hidden. */
  nextHref?: string;
}

export function HeroSplash({ nextHref }: Props) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Ken Burns image */}
      <div
        className="ken-burns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/couple.jpg')" }}
        aria-hidden="true"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Centred text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        <p
          className="text-lg md:text-xl tracking-[0.25em] uppercase mb-2 font-light"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
        >
          The Love Story of
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
        >
          Marissa &amp; Ross
        </h1>
      </div>

      {/* Circular arrow button */}
      {nextHref && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <Link
            href={nextHref}
            aria-label="Continue to invitation"
            className="bounce-slow flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/80 text-white hover:bg-white/20 transition-colors"
          >
            {/* Circular arrow (down chevron) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
