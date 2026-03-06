# Marissa & Ross — Wedding RSVP

A lightweight Next.js web application for managing RSVPs across multiple events for a multi-day Indian wedding.

## Features

- **Multi-event RSVP** — Guests RSVP per-event, per-family-member
- **Token-based family access** — No login required; each family gets a unique private URL
- **Google Sheets backend** — All data lives in a single spreadsheet you control
- **Upsert RSVPs** — Resubmitting updates existing responses rather than duplicating
- **Mobile-friendly** — Large touch targets, clean readable layout
- **Vercel deployment** — Zero-config hosting

---

## Tech Stack

- Framework: Next.js 15 (App Router, TypeScript)
- Styling: Tailwind CSS
- Data store: Google Sheets (Sheets API v4)
- Hosting: Vercel

---

## Google Sheets Setup

### 1. Create the spreadsheet

Create a Google Sheet with these tabs (exact tab names required):

| Tab | Columns |
|---|---|
| **Events** | `event_id`, `event_name`, `event_date`, `event_time`, `venue_name`, `venue_address`, `map_link`, `description`, `dress_code`, `display_order` |
| **Families** | `family_id`, `family_name`, `contact_email`, `token` |
| **Members** | `member_id`, `family_id`, `first_name`, `last_name` |
| **Invitations** | `invitation_id`, `family_id`, `event_id` |
| **RSVPs** | `rsvp_id`, `member_id`, `event_id`, `attending`, `timestamp` |

Row 1 of each tab must be the column headers above.

### 2. Create a Google Cloud service account

1. Go to Google Cloud Console and enable the **Google Sheets API**
2. Create a Service Account and download its **JSON key**
3. Share your spreadsheet with the service account email (Editor access)

### 3. Get the Spreadsheet ID

```
https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
```

---

## Environment Variables

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | From the spreadsheet URL |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON key as a single-line string |

Alternative: use `GOOGLE_CLIENT_EMAIL` + `GOOGLE_PRIVATE_KEY` instead.

---

## Family Tokens

Each family row in the **Families** sheet needs a `token`. Their RSVP URL is:

```
https://your-site.vercel.app/rsvp/<token>
```

Generate random tokens with:

```bash
node -e "console.log(require('crypto').randomBytes(10).toString('hex'))"
```

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# fill in credentials
npm run dev
```

Test a family at: `http://localhost:3000/rsvp/<token>`

---

## Vercel Deployment

1. Push to GitHub
2. Import project on vercel.com
3. Add env vars: `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`
4. Deploy

---

## Project Structure

```
src/
  app/
    page.tsx              # Home / landing page
    layout.tsx            # Root layout
    actions.ts            # Server action for RSVP submission
    rsvp/[token]/
      page.tsx            # Family RSVP page (server component)
      not-found.tsx       # Invalid token error
  components/
    RsvpForm.tsx          # Client component — form state + submission
    EventCard.tsx         # Event details header
  lib/
    sheets.ts             # Google Sheets API read/write
  types/
    index.ts              # Shared TypeScript interfaces
```
