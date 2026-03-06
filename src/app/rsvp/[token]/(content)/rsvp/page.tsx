import { notFound } from "next/navigation";
import {
  getFamilyByToken,
  getMembersByFamilyId,
  getInvitationsByFamilyId,
  getEvents,
  getRsvpsByFamilyMembers,
} from "@/lib/sheets";
import { RsvpForm } from "@/components/RsvpForm";
import type { FamilyPageData } from "@/types";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function RsvpPage({ params }: Props) {
  const { token } = await params;

  const family = await getFamilyByToken(token);
  if (!family) notFound();

  const [members, invitations, allEvents] = await Promise.all([
    getMembersByFamilyId(family.family_id),
    getInvitationsByFamilyId(family.family_id),
    getEvents(),
  ]);

  const invitedEventIds = new Set(invitations.map((inv) => inv.event_id));
  const invitedEvents = allEvents.filter((e) => invitedEventIds.has(e.event_id));
  const memberIds = members.map((m) => m.member_id);
  const existingRsvps = await getRsvpsByFamilyMembers(memberIds);

  const pageData: FamilyPageData = {
    family,
    members,
    invitedEvents,
    existingRsvps,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-rose-700 uppercase tracking-widest text-sm mb-2">
          {family.family_name}
        </p>
        <h1 className="text-4xl font-serif text-stone-800 mb-2">RSVP</h1>
        <p className="text-stone-500">
          Let us know who will be joining us for each event.
        </p>
      </div>

      {invitedEvents.length === 0 ? (
        <p className="text-center text-stone-500 text-lg py-16">
          No events found for your invitation. Please contact the family for
          assistance.
        </p>
      ) : (
        <RsvpForm data={pageData} />
      )}
    </div>
  );
}
