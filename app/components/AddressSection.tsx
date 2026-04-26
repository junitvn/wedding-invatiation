'use client';

import type { VenueConfig } from '../config';
import { imageUrl } from '../lib/image';

export default function AddressSection({ venue }: { venue: VenueConfig }) {

  return (
    <section className="bg-white py-8 px-4">
      <div className="flex gap-3">
        {/* Couple photo */}
        <div className="w-[45%] flex-shrink-0 rounded overflow-hidden bg-gray-200" style={{ aspectRatio: '3/4' }}>
          <img
            src={imageUrl('/images/ceremony.jpg')}
            alt="Couple"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* Address info */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {/* ADDRESS title */}
          <p
            className="text-[#7B1C1C] text-[28px] tracking-[0.2em] leading-none font-ljr"
          >
            ADDRESS
          </p>

          <p className="text-[#7B1C1C] font-bold text-[13px] tracking-widest text-center font-sf">
            {venue.title}
          </p>
          <p className="text-gray-500 text-[12px] text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {venue.address}
          </p>

          {/* Google Maps embed */}
          <div className="w-full rounded overflow-hidden border border-gray-200 flex-1" style={{ minHeight: '140px' }}>
            <iframe
              src={venue.mapSrc}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
