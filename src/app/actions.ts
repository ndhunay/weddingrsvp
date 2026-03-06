"use server";

import { upsertRsvps } from "@/lib/sheets";

export interface SubmitRsvpResult {
  success: boolean;
  error?: string;
}

export async function submitRsvpAction(
  formData: FormData
): Promise<SubmitRsvpResult> {
  try {
    // formData fields are named: "{memberId}|{eventId}" with value "true" or "false"
    const submissions: Array<{
      member_id: string;
      event_id: string;
      attending: boolean;
    }> = [];

    for (const [key, value] of formData.entries()) {
      if (!key.includes("|")) continue;
      const [member_id, event_id] = key.split("|");
      if (!member_id || !event_id) continue;
      submissions.push({
        member_id,
        event_id,
        attending: value === "true",
      });
    }

    if (submissions.length === 0) {
      return { success: false, error: "No RSVP selections found." };
    }

    await upsertRsvps(submissions);
    return { success: true };
  } catch (err) {
    console.error("RSVP submission error:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
