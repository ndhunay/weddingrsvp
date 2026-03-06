import type { Event } from "@/types";

interface Props {
  event: Event;
}

export function EventCard({ event }: Props) {
  return (
    <div className="bg-rose-900 text-white px-6 py-5">
      <h2 className="text-2xl font-serif font-light mb-1">{event.event_name}</h2>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-rose-200 text-sm mb-3">
        {event.event_date && (
          <span>
            <span className="font-medium text-white">Date:</span>{" "}
            {event.event_date}
          </span>
        )}
        {event.event_time && (
          <span>
            <span className="font-medium text-white">Time:</span>{" "}
            {event.event_time}
          </span>
        )}
      </div>
      {event.venue_name && (
        <p className="text-rose-100 font-medium">{event.venue_name}</p>
      )}
      {event.venue_address && (
        <p className="text-rose-200 text-sm">{event.venue_address}</p>
      )}
      {event.map_link && (
        <a
          href={event.map_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-rose-300 underline text-sm hover:text-white transition-colors"
        >
          View on Map ↗
        </a>
      )}
      {event.description && (
        <p className="mt-3 text-rose-100 text-sm leading-relaxed">
          {event.description}
        </p>
      )}
      {event.dress_code && (
        <p className="mt-2 text-rose-200 text-sm">
          <span className="font-medium text-white">Dress Code:</span>{" "}
          {event.dress_code}
        </p>
      )}
    </div>
  );
}
