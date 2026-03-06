import { google } from "googleapis";
import type { Event, Family, Member, Invitation, RSVP } from "@/types";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

function getAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    : {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

async function getSheetValues(range: string): Promise<string[][]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return (res.data.values as string[][] | null | undefined) ?? [];
}

// ── Events ──────────────────────────────────────────────────────────────────

let eventsCache: Event[] | null = null;
let eventsCacheTime = 0;
const EVENTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getEvents(): Promise<Event[]> {
  const now = Date.now();
  if (eventsCache && now - eventsCacheTime < EVENTS_CACHE_TTL) {
    return eventsCache;
  }

  const rows = await getSheetValues("Events!A2:J");
  const events: Event[] = rows
    .filter((row) => row[0])
    .map((row) => ({
      event_id: row[0] ?? "",
      event_name: row[1] ?? "",
      event_date: row[2] ?? "",
      event_time: row[3] ?? "",
      venue_name: row[4] ?? "",
      venue_address: row[5] ?? "",
      map_link: row[6] ?? "",
      description: row[7] ?? "",
      dress_code: row[8] ?? "",
      display_order: parseInt(row[9] ?? "0", 10),
    }))
    .sort((a, b) => a.display_order - b.display_order);

  eventsCache = events;
  eventsCacheTime = now;
  return events;
}

// ── Families ─────────────────────────────────────────────────────────────────

let familiesCache: Family[] | null = null;
let familiesCacheTime = 0;
const FAMILIES_CACHE_TTL = 5 * 60 * 1000;

async function getFamilies(): Promise<Family[]> {
  const now = Date.now();
  if (familiesCache && now - familiesCacheTime < FAMILIES_CACHE_TTL) {
    return familiesCache;
  }

  const rows = await getSheetValues("Families!A2:D");
  const families: Family[] = rows
    .filter((row) => row[0])
    .map((row) => ({
      family_id: row[0] ?? "",
      family_name: row[1] ?? "",
      contact_email: row[2] ?? "",
      token: row[3] ?? "",
    }));

  familiesCache = families;
  familiesCacheTime = now;
  return families;
}

export async function getFamilyByToken(token: string): Promise<Family | null> {
  const families = await getFamilies();
  return families.find((f) => f.token === token) ?? null;
}

// ── Members ──────────────────────────────────────────────────────────────────

export async function getMembersByFamilyId(familyId: string): Promise<Member[]> {
  const rows = await getSheetValues("Members!A2:D");
  return rows
    .filter((row) => row[0] && row[1] === familyId)
    .map((row) => ({
      member_id: row[0] ?? "",
      family_id: row[1] ?? "",
      first_name: row[2] ?? "",
      last_name: row[3] ?? "",
    }));
}

// ── Invitations ───────────────────────────────────────────────────────────────

export async function getInvitationsByFamilyId(familyId: string): Promise<Invitation[]> {
  const rows = await getSheetValues("Invitations!A2:C");
  return rows
    .filter((row) => row[0] && row[1] === familyId)
    .map((row) => ({
      invitation_id: row[0] ?? "",
      family_id: row[1] ?? "",
      event_id: row[2] ?? "",
    }));
}

// ── RSVPs ────────────────────────────────────────────────────────────────────

export async function getRsvpsByFamilyMembers(memberIds: string[]): Promise<RSVP[]> {
  const rows = await getSheetValues("RSVPs!A2:E");
  const idSet = new Set(memberIds);
  return rows
    .filter((row) => row[0] && idSet.has(row[1]))
    .map((row) => ({
      rsvp_id: row[0] ?? "",
      member_id: row[1] ?? "",
      event_id: row[2] ?? "",
      attending: row[3]?.toLowerCase() === "true",
      timestamp: row[4] ?? "",
    }));
}

export async function upsertRsvps(
  submissions: Array<{ member_id: string; event_id: string; attending: boolean }>
): Promise<void> {
  const sheets = getSheetsClient();

  // Read all existing RSVPs
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "RSVPs!A2:E",
  });
  const existingRows: string[][] = (res.data.values as string[][] | null | undefined) ?? [];

  const now = new Date().toISOString();

  // Build a map: "memberId|eventId" → row index (1-based, accounting for header)
  const rowIndexMap = new Map<string, number>();
  existingRows.forEach((row, i) => {
    if (row[1] && row[2]) {
      rowIndexMap.set(`${row[1]}|${row[2]}`, i + 2); // +2: 1-based + header row
    }
  });

  const updates: Array<{ range: string; values: string[][] }> = [];
  const newRows: string[][] = [];

  for (const sub of submissions) {
    const key = `${sub.member_id}|${sub.event_id}`;
    const existingRowIndex = rowIndexMap.get(key);

    if (existingRowIndex !== undefined) {
      // Update existing row
      updates.push({
        range: `RSVPs!B${existingRowIndex}:E${existingRowIndex}`,
        values: [[sub.member_id, sub.event_id, String(sub.attending), now]],
      });
    } else {
      // New row — generate a simple ID
      const rsvp_id = `R-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      newRows.push([rsvp_id, sub.member_id, sub.event_id, String(sub.attending), now]);
    }
  }

  // Batch update existing rows
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: updates,
      },
    });
  }

  // Append new rows
  if (newRows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "RSVPs!A:E",
      valueInputOption: "RAW",
      requestBody: { values: newRows },
    });
  }
}
