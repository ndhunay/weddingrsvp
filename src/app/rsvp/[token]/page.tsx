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
  if (!family) {
    notFound();
  }

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
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-rose-900 text-white py-10 px-6 text-center">
        <p className="text-rose-300 uppercase tracking-widest text-sm mb-2">
          RSVP
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-light">
          Welcome, {family.family_name}
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {invitedEvents.length === 0 ? (
          <p className="text-stone-600 text-center text-lg py-16">
            No events found for your invitation. Please contact the family for
            assistance.
          </p>
        ) : (
          <>
            <p className="text-stone-600 text-center mb-10 text-lg">
              Please let us know which family members will be attending each
              event below.
            </p>
            <RsvpForm data={pageData} />
          </>
        )}
      </div>

      <footer className="bg-rose-900 text-rose-200 text-center py-6 text-sm mt-16">
        <p>With love — Marissa &amp; Ross</p>
      </footer>
    </main>
  );
}
