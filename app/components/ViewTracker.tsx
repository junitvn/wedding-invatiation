'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { decodeGuestParams } from '../lib/encoding';

export default function ViewTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('t');
    const legacyGuest = searchParams.get('guest');

    let guestKey: string | null = null;
    if (token) {
      guestKey = decodeGuestParams(token)?.guest ?? null;
    } else if (legacyGuest) {
      guestKey = legacyGuest;
    }

    if (!guestKey) return;
    updateDoc(doc(db, 'guests', guestKey), { viewStatus: 'viewed' }).catch(() => {});
  }, [searchParams]);

  return null;
}
