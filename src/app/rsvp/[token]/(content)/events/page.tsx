import { notFound } from "next/navigation";
import {
  getFamilyByToken,
  getInvitationsByFamilyId,
  getEvents,
} from "@/lib/sheets";
import { EventsList } from "@/components/EventsList";

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

  if (invitedEvents.length === 0) {
    return (
      <div className="bg-stone-950 min-h-screen flex items-center justify-center px-6 text-center">
        <p className="text-white/50 text-lg">
          No events found for your invitation. Please contact the family for
          assistance.
        </p>
      </div>
    );
  }

  return <EventsList events={invitedEvents} />;
}
