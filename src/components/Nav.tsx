"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  token: string;
  familyName: string;
}

export function Nav({ token, familyName }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const items: NavItem[] = [
    { label: "Stories", href: `/rsvp/${token}/stories` },
    { label: "Events", href: `/rsvp/${token}/events` },
    { label: "Hotels", href: `/rsvp/${token}/hotels` },
    { label: "RSVP", href: `/rsvp/${token}/rsvp` },
  ];

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Wordmark / home link */}
        <Link
          href={`/rsvp/${token}/home`}
          className="font-serif text-xl text-stone-800 tracking-wide hover:text-rose-900 transition-colors"
        >
          M &amp; R
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {items.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-rose-900 text-white"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={`block w-5 h-0.5 bg-stone-700 transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-stone-700 transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-stone-700 transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-stone-100 bg-white py-2 px-4"
          aria-label="Mobile navigation"
        >
          <p className="text-xs text-stone-400 uppercase tracking-widest px-2 pt-2 pb-3">
            {familyName}
          </p>
          {items.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-3 rounded-lg text-base font-medium mb-1 transition-colors ${
                isActive(href)
                  ? "bg-rose-900 text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
