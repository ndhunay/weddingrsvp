export interface Event {
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  map_link: string;
  description: string;
  dress_code: string;
  display_order: number;
}

export interface Family {
  family_id: string;
  family_name: string;
  contact_email: string;
  token: string;
}

export interface Member {
  member_id: string;
  family_id: string;
  first_name: string;
  last_name: string;
}

export interface Invitation {
  invitation_id: string;
  family_id: string;
  event_id: string;
}

export interface RSVP {
  rsvp_id: string;
  member_id: string;
  event_id: string;
  attending: boolean;
  timestamp: string;
}

export interface RsvpSubmission {
  member_id: string;
  event_id: string;
  attending: boolean;
}

export interface FamilyPageData {
  family: Family;
  members: Member[];
  invitedEvents: Event[];
  existingRsvps: RSVP[];
}
