import type { Event } from '@/types';

export function mapDbEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string | undefined,
    description: row.description as string,
    category: row.category as Event['category'],
    status: row.status as Event['status'],
    coverImage: row.cover_image as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    registrationDeadline: row.registration_deadline as string,
    venue: row.venue as string | undefined,
    isVirtual: row.is_virtual as boolean,
    maxParticipants: row.max_participants as number | undefined,
    registeredCount: (row.registered_count as number) ?? 0,
    prizePool: row.prize_pool as string | undefined,
    tags: [],
    organizer: row.organizer as string,
  };
}

export function mapDbEvents(rows: Record<string, unknown>[]): Event[] {
  return rows.map(mapDbEvent);
}
