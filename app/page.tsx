import InvitationSection from './components/InvitationSection';
import SaveTheDateSection from './components/SaveTheDateSection';
import CoupleSection from './components/CoupleSection';
import PhotosSection from './components/PhotosSection';
import CeremonySection from './components/CeremonySection';
import CalendarSection from './components/CalendarSection';
import WishesSection from './components/WishesSection';
import RSVPSection from './components/RSVPSection';
import { GUESTS, VENUES } from './config';
import HeroSectionVer2 from './components/HeroSectionVer2';
import { imageUrl } from './lib/image';

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
    <main className="bg-white" style={{ maxWidth: '430px', minHeight: '100vh', overflow: 'hidden' }}>
      <HeroSectionVer2 />
      <InvitationSection guestName={guestName} venue={VENUES[resolvedVenueKey]} />
      <CoupleSection />
      <CeremonySection />
      <PhotosSection />
      <SaveTheDateSection />
      {/* <WishesSection venue={resolvedVenueKey} /> */}
      <RSVPSection venue={resolvedVenueKey} />

      <footer className="bg-white text-center flex flex-col items-center justify-center pt-16 pb-6 gap-16 ">
        <img src={imageUrl('/images/thanks.webp')} className='w-[80px] animate-up' alt="" />
        <p
          className="text-gold text-[32px] tracking-widest font-uvn animate-up"
        >
          Thank you
        </p>
      </footer>
    </main>
  );
}
