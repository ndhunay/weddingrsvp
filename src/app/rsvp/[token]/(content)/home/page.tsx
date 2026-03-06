import { notFound } from "next/navigation";
import Link from "next/link";
import { getFamilyByToken, getInvitationsByFamilyId, getEvents } from "@/lib/sheets";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: Props) {
  const { token } = await params;

  const family = await getFamilyByToken(token);
  if (!family) notFound();

  const [invitations, allEvents] = await Promise.all([
    getInvitationsByFamilyId(family.family_id),
    getEvents(),
  ]);

  const invitedEventIds = new Set(invitations.map((i) => i.event_id));
  const invitedEvents = allEvents.filter((e) => invitedEventIds.has(e.event_id));

  const navCards = [
    {
      label: "Stories",
      description: "Our journey together",
      href: `/rsvp/${token}/stories`,
      icon: "❤",
    },
    {
      label: "Events",
      description: `${invitedEvents.length} event${invitedEvents.length !== 1 ? "s" : ""} for your family`,
      href: `/rsvp/${token}/events`,
      icon: "✦",
    },
    {
      label: "Hotels",
      description: "Where to stay",
      href: `/rsvp/${token}/hotels`,
      icon: "⌂",
    },
    {
      label: "RSVP",
      description: "Confirm your attendance",
      href: `/rsvp/${token}/rsvp`,
      icon: "✉",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="text-center mb-12">
        <p className="text-rose-700 uppercase tracking-widest text-sm mb-2">
          You are cordially invited
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-3">
          Welcome, {family.family_name}
        </h1>
        <p className="text-stone-500 text-lg">
          We&apos;re so glad you&apos;re here. Explore the sections below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {navCards.map(({ label, description, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-rose-300 hover:shadow-md transition-all"
          >
            <span className="text-2xl mb-3 block">{icon}</span>
            <h2 className="text-xl font-serif text-stone-800 group-hover:text-rose-900 transition-colors mb-1">
              {label}
            </h2>
            <p className="text-stone-500 text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
