"use client";

import { useState, useTransition } from "react";
import { submitRsvpAction } from "@/app/actions";
import { EventCard } from "@/components/EventCard";
import type { FamilyPageData, Member, Event } from "@/types";

interface Props {
  data: FamilyPageData;
}

type AttendanceMap = Record<string, boolean | undefined>;

function buildInitialState(data: FamilyPageData): AttendanceMap {
  const map: AttendanceMap = {};
  for (const rsvp of data.existingRsvps) {
    map[`${rsvp.member_id}|${rsvp.event_id}`] = rsvp.attending;
  }
  return map;
}

export function RsvpForm({ data }: Props) {
  const { members, invitedEvents } = data;
  const [attendance, setAttendance] = useState<AttendanceMap>(() =>
    buildInitialState(data)
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setAttendanceValue(memberId: string, eventId: string, value: boolean) {
    setAttendance((prev) => ({ ...prev, [`${memberId}|${eventId}`]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    for (const [key, value] of Object.entries(attendance)) {
      if (value !== undefined) {
        formData.set(key, String(value));
      }
    }

    startTransition(async () => {
      const result = await submitRsvpAction(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "An error occurred.");
      }
    });
  }

  if (submitted) {
    return <SuccessMessage familyName={data.family.family_name} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-10">
        {invitedEvents.map((event) => (
          <EventSection
            key={event.event_id}
            event={event}
            members={members}
            attendance={attendance}
            onChange={setAttendanceValue}
          />
        ))}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-rose-900 text-white text-lg font-medium px-12 py-4 rounded-xl hover:bg-rose-800 active:bg-rose-950 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px]"
        >
          {isPending ? "Submitting…" : "Submit RSVP"}
        </button>
        <p className="text-stone-500 text-sm mt-3">
          You can update your RSVP at any time by returning to this link.
        </p>
      </div>
    </form>
  );
}

// ── EventSection ──────────────────────────────────────────────────────────────

interface EventSectionProps {
  event: Event;
  members: Member[];
  attendance: AttendanceMap;
  onChange: (memberId: string, eventId: string, value: boolean) => void;
}

function EventSection({ event, members, attendance, onChange }: EventSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <EventCard event={event} />

      <div className="p-6">
        <h3 className="font-semibold text-stone-700 mb-5 text-lg">
          Who will be attending?
        </h3>
        <div className="divide-y divide-stone-100">
          {members.map((member) => {
            const key = `${member.member_id}|${event.event_id}`;
            const value = attendance[key];
            return (
              <MemberRow
                key={member.member_id}
                member={member}
                eventId={event.event_id}
                value={value}
                onChange={onChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MemberRow ─────────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: Member;
  eventId: string;
  value: boolean | undefined;
  onChange: (memberId: string, eventId: string, value: boolean) => void;
}

function MemberRow({ member, eventId, value, onChange }: MemberRowProps) {
  const name = `${member.first_name} ${member.last_name}`;

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span className="text-stone-800 text-lg font-medium">{name}</span>
      <div className="flex gap-3">
        <label
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer transition-colors select-none text-base font-medium ${
            value === true
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
          }`}
        >
          <input
            type="radio"
            name={`${member.member_id}|${eventId}`}
            value="true"
            checked={value === true}
            onChange={() => onChange(member.member_id, eventId, true)}
            className="sr-only"
          />
          <span aria-hidden="true">{value === true ? "✓" : "○"}</span>
          Attending
        </label>
        <label
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer transition-colors select-none text-base font-medium ${
            value === false
              ? "border-rose-600 bg-rose-50 text-rose-800"
              : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
          }`}
        >
          <input
            type="radio"
            name={`${member.member_id}|${eventId}`}
            value="false"
            checked={value === false}
            onChange={() => onChange(member.member_id, eventId, false)}
            className="sr-only"
          />
          <span aria-hidden="true">{value === false ? "✓" : "○"}</span>
          Not Attending
        </label>
      </div>
    </div>
  );
}

// ── SuccessMessage ────────────────────────────────────────────────────────────

function SuccessMessage({ familyName }: { familyName: string }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-serif text-stone-800 mb-4">
        RSVP Received!
      </h2>
      <p className="text-stone-600 text-lg mb-6 max-w-md mx-auto">
        Thank you, {familyName}! We have recorded your responses. We look
        forward to celebrating with you.
      </p>
      <p className="text-stone-500 text-sm">
        Need to make a change? Simply return to this link and resubmit.
      </p>
    </div>
  );
}
