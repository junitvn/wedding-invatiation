import HeroSection from './components/HeroSection';
import InvitationSection from './components/InvitationSection';
import FamilySection from './components/FamilySection';
import CeremonySection from './components/CeremonySection';
import CalendarSection from './components/CalendarSection';
import AddressSection from './components/AddressSection';
import WishesSection from './components/WishesSection';
import RSVPSection from './components/RSVPSection';
import { GUESTS, VENUES, DEFAULT_VENUE } from './config';

async function fetchGuestName(key: string): Promise<string> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return GUESTS[key] ?? '';
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/guests/${key}?key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return GUESTS[key] ?? '';
    const data = await res.json();
    return data.fields?.displayName?.stringValue ?? GUESTS[key] ?? '';
  } catch {
    return GUESTS[key] ?? '';
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { guest, venue } = await searchParams;

  const guestKey = typeof guest === 'string' ? guest : undefined;
  const guestName = guestKey ? await fetchGuestName(guestKey) : '';

  const venueKey = typeof venue === 'string' ? venue : undefined;
  const resolvedVenueKey = (venueKey && VENUES[venueKey]) ? venueKey : 'nhatrai';

  return (
    <main className="mx-auto bg-white" style={{ maxWidth: '430px', minHeight: '100vh' }}>
      <HeroSection />
      <InvitationSection guestName={guestName} venue={VENUES[resolvedVenueKey]} />
      <FamilySection />
      <CeremonySection />
      <CalendarSection />
      {/* <AddressSection venue={venueConfig} /> */}
      <WishesSection venue={resolvedVenueKey} />
      <RSVPSection venue={resolvedVenueKey} />

      <footer className="bg-white text-center py-8 border-t border-gray-100">
        <p
          className="text-gray-400 text-xs tracking-widest"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Ngọc Lâm &amp; Ngọc Bích · 2026
        </p>
      </footer>
    </main>
  );
}
