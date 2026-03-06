"use client";

import { useState } from "react";
import type { Event } from "@/types";

interface Props {
  events: Event[];
}

function parseDate(dateStr: string) {
  if (!dateStr) return null;
  // Append time to avoid UTC/timezone shift on ISO date strings
  const normalised = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? dateStr + "T12:00:00"
    : dateStr;
  const d = new Date(normalised);
  if (isNaN(d.getTime())) return null;
  return {
    dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

export function EventsList({ events }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="bg-stone-950 text-white">
      {/* Page title */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-xs tracking-[0.35em] uppercase text-white/60 font-medium">
          Events
        </h1>
      </div>

      {/* Event rows */}
      <div>
        {events.map((event) => {
          const date = parseDate(event.event_date);
          const isOpen = openId === event.event_id;

          return (
            <div key={event.event_id}>
              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Row button */}
              <button
                className="w-full flex items-center px-6 py-7 text-left hover:bg-white/[0.04] transition-colors"
                onClick={() => toggle(event.event_id)}
                aria-expanded={isOpen}
              >
                {/* Date column */}
                <div className="w-20 flex-shrink-0 text-center mr-8">
                  {date ? (
                    <>
                      <p className="text-[10px] tracking-widest text-white/40 mb-0.5">
                        {date.dayOfWeek}
                      </p>
                      <p className="text-5xl font-extralight leading-none text-white">
                        {date.day}
                      </p>
                      <p className="text-xl font-light tracking-wider text-white mt-0.5">
                        {date.month}
                      </p>
                      <p className="text-[10px] tracking-widest text-white/40 mt-0.5">
                        {date.year}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/30 text-sm">TBD</p>
                  )}
                </div>

                {/* Name + time */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-serif font-light text-white leading-snug">
                    {event.event_name}
                  </h2>
                  {event.event_time && (
                    <p className="text-white/50 mt-1.5 text-base tabular-nums">
                      {event.event_time}
                    </p>
                  )}
                </div>

                {/* Chevron */}
                <div className="ml-4 flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-white/50 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6l6 6-6 6"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-white/10 bg-white/[0.03] px-6 py-6">
                  <dl className="pl-28 space-y-3 text-sm">
                    {event.venue_name && (
                      <div className="flex flex-col sm:flex-row sm:gap-3">
                        <dt className="text-[10px] uppercase tracking-widest text-white/35 sm:w-24 shrink-0 pt-0.5">
                          Venue
                        </dt>
                        <dd className="text-white/90">{event.venue_name}</dd>
                      </div>
                    )}
                    {event.venue_address && (
                      <div className="flex flex-col sm:flex-row sm:gap-3">
                        <dt className="text-[10px] uppercase tracking-widest text-white/35 sm:w-24 shrink-0 pt-0.5">
                          Address
                        </dt>
                        <dd className="text-white/70">{event.venue_address}</dd>
                      </div>
                    )}
                    {event.map_link && (
                      <div className="flex flex-col sm:flex-row sm:gap-3">
                        <dt className="text-[10px] uppercase tracking-widest text-white/35 sm:w-24 shrink-0 pt-0.5">
                          Map
                        </dt>
                        <dd>
                          <a
                            href={event.map_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-300 underline hover:text-rose-200 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open in Maps ↗
                          </a>
                        </dd>
                      </div>
                    )}
                    {event.dress_code && (
                      <div className="flex flex-col sm:flex-row sm:gap-3">
                        <dt className="text-[10px] uppercase tracking-widest text-white/35 sm:w-24 shrink-0 pt-0.5">
                          Dress Code
                        </dt>
                        <dd className="text-white/80">{event.dress_code}</dd>
                      </div>
                    )}
                    {event.description && (
                      <div className="flex flex-col sm:flex-row sm:gap-3">
                        <dt className="text-[10px] uppercase tracking-widest text-white/35 sm:w-24 shrink-0 pt-0.5">
                          Details
                        </dt>
                        <dd className="text-white/60 leading-relaxed">
                          {event.description}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          );
        })}
        {/* Bottom border */}
        <div className="border-t border-white/10" />
      </div>
    </div>
  );
}
