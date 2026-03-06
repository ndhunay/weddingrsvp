import { notFound } from "next/navigation";
import {
  getFamilyByToken,
  getInvitationsByFamilyId,
  getEvents,
} from "@/lib/sheets";
import { EventCard } from "@/components/EventCard";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function EventsPage({ params }: Props) {
  const { token } = await params;

  const family = await getFamilyByToken(token);
  if (!family) notFound();

  const [invitations, allEvents] = await Promise.all([
    getInvitationsByFamilyId(family.family_id),
    getEvents(),
  ]);

  const invitedEventIds = new Set(invitations.map((i) => i.event_id));
  const invitedEvents = allEvents.filter((e) => invitedEventIds.has(e.event_id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-rose-700 uppercase tracking-widest text-sm mb-2">
          Your Invitation
        </p>
        <h1 className="text-4xl font-serif text-stone-800">Events</h1>
      </div>

      {invitedEvents.length === 0 ? (
        <p className="text-center text-stone-500 text-lg py-16">
          No events found for your invitation. Please contact the family for
          assistance.
        </p>
      ) : (
        <div className="space-y-6">
          {invitedEvents.map((event) => (
            <div
              key={event.event_id}
              className="rounded-2xl overflow-hidden shadow-sm border border-stone-200"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
