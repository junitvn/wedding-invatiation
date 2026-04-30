import type { Metadata } from 'next';
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
import PageFooter from './components/PageFooter';
import GiftBoxSection from './components/GiftBoxSection';

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

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { guest } = await searchParams;
  const guestKey = typeof guest === 'string' ? guest : undefined;
  const guestName = guestKey ? await fetchGuestName(guestKey) : '';

  return {
    title: 'Thiệp Cưới · Ngọc Lâm & Ngọc Bích',
    description: guestName
      ? `Trân trọng kính mời bạn ${guestName} tới dự tiệc cưới của Ngọc Lâm và Ngọc Bích`
      : 'Trân trọng kính mời bạn tới dự tiệc cưới của Ngọc Lâm và Ngọc Bích',
  };
}

export default async function Home({ searchParams }: PageProps) {
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
      <RSVPSection defaultName={guestName || ''} venue={resolvedVenueKey} />
      <GiftBoxSection venue={resolvedVenueKey} />
      <PageFooter />
    </main>
  );
}
