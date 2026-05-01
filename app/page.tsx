import { Suspense } from 'react';
import type { Metadata } from 'next';
import InvitationSection from './components/InvitationSection';
import SaveTheDateSection from './components/SaveTheDateSection';
import CoupleSection from './components/CoupleSection';
import PhotosSection from './components/PhotosSection';
import CeremonySection from './components/CeremonySection';
import RSVPSection from './components/RSVPSection';
import { GUESTS, VENUES } from './config';
import HeroSectionVer2 from './components/HeroSectionVer2';
import PageFooter from './components/PageFooter';
import GiftBoxSection from './components/GiftBoxSection';
import ViewTracker from './components/ViewTracker';
import FloatingWishesWidget from './components/FloatingWishesWidget';
import { decodeGuestParams } from './lib/encoding';

type GuestData = {
  displayName: string;
  invitePhrase: string;
  addressTo: string;
  selfRef: string;
  venueKey: string;
  guestKey?: string;
};

type RawParams = { [key: string]: string | string[] | undefined };

async function fetchGuestData(params: RawParams): Promise<GuestData> {
  let guestKey: string | undefined;
  let venueKey: string | undefined;

  const token = typeof params.t === 'string' ? params.t : undefined;
  if (token) {
    const decoded = decodeGuestParams(token);
    guestKey = decoded?.guest;
    venueKey = decoded?.venue;
  } else {
    guestKey = typeof params.guest === 'string' ? params.guest : undefined;
    venueKey = typeof params.venue === 'string' ? params.venue : undefined;
  }

  const resolvedVenueKey = venueKey && VENUES[venueKey] ? venueKey : 'nhatrai';

  const defaults: GuestData = {
    displayName: guestKey ? (GUESTS[guestKey] ?? '') : '',
    invitePhrase: 'Trân trọng kính mời',
    addressTo: '',
    selfRef: 'chúng tôi',
    venueKey: resolvedVenueKey,
    guestKey,
  };

  if (!guestKey) return defaults;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return defaults;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/guests/${guestKey}?key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return defaults;
    const data = await res.json();
    const f = data.fields ?? {};
    return {
      displayName: f.displayName?.stringValue ?? defaults.displayName,
      invitePhrase: f.invitePhrase?.stringValue ?? defaults.invitePhrase,
      addressTo: f.addressTo?.stringValue ?? defaults.addressTo,
      selfRef: f.selfRef?.stringValue ?? defaults.selfRef,
      venueKey: resolvedVenueKey,
      guestKey,
    };
  } catch {
    return defaults;
  }
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { displayName: guestName } = await fetchGuestData(params);

  const description = guestName
    ? `Trân trọng kính mời ${guestName} tới dự tiệc cưới của Ngọc Lâm và Ngọc Bích`
    : 'Trân trọng kính mời bạn tới dự tiệc cưới của Ngọc Lâm và Ngọc Bích';

  return {
    title: 'Thiệp Cưới · Ngọc Lâm & Ngọc Bích',
    description,
    openGraph: {
      title: 'Thiệp Cưới · Ngọc Lâm & Ngọc Bích',
      description,
      images: [{ url: '/images/thumbnail.webp', width: 800, height: 1200 }],
      type: 'website',
    },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const guestData = await fetchGuestData(params);

  const guestName = guestData.displayName;
  const invitePhrase = guestData.invitePhrase;
  const addressTo = guestData.addressTo;
  const selfRef = guestData.selfRef;
  const resolvedVenueKey = guestData.venueKey;

  return (
    <main className="bg-white" style={{ maxWidth: '430px', minHeight: '100%', width: '100%', paddingBottom: '96px' }}>
      <Suspense>
        <ViewTracker />
      </Suspense>
      <Suspense>
        <FloatingWishesWidget defaultName={guestName} venue={resolvedVenueKey} />
      </Suspense>
      <HeroSectionVer2 />
      <InvitationSection
        guestName={guestName}
        venue={VENUES[resolvedVenueKey]}
        invitePhrase={invitePhrase}
        addressTo={addressTo}
        selfRef={selfRef}
      />
      <CoupleSection addressTo={addressTo} selfRef={selfRef} />
      <CeremonySection />
      <PhotosSection />
      <SaveTheDateSection />
      <RSVPSection defaultName={guestName || ''} venue={resolvedVenueKey} guestKey={guestData.guestKey} addressTo={addressTo} selfRef={selfRef} />
      <GiftBoxSection venue={resolvedVenueKey} />
      <PageFooter />
    </main>
  );
}
