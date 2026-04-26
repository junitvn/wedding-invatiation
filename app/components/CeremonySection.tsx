'use client';

import { VENUES } from '../config';
import { imageUrl } from '../lib/image';

export default function CeremonySection() {
  return (
    <section className="bg-white py-12 flex flex-col items-center px-6">
      <div className="text-center mb-6">
        <p
          className="text-[#7B1C1C] text-[32px] tracking-[0.35em] font-sf"
        >
          L.O.V.E
        </p>
      </div>

      {/* Couple image */}
      <div className="relative w-3/4 aspect-[3/4] bg-gray-200 rounded overflow-hidden mb-6">
        <img
          src={imageUrl('/images/ceremony.jpg')}
          alt="Couple"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* We got married script */}
      <div className="text-center mb-2">
        <img
          src={imageUrl('/images/text_wgm.png')}
          alt="We got married"
          className="w-auto h-[32px] object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Decorative line */}
      <div className="h-px bg-gray-200 mb-8" />

      {/* Vietnamese calendar date display */}
      <div className="text-center mb-4 w-full">
        <p
          className="tracking-[0.25em] text-title text-[24px] font-sf mb-4"
        >
          LỄ THÀNH HÔN
        </p>
        <div className="flex justify-center font-sf grid grid-cols-3 w-full uppercase">
          <div className="flex flex-col items-center justify-center w-full h-full mt-2">
            <p className="border border-[1px] border-l-0 border-r-0 border-gray-600 text-gold w-full text-[24px]">Tháng 5</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-[24px] font-light text-gold">CHỦ NHẬT</p>
            <p className="font-bold text-[60px] text-gold">17</p>
            <p className="text-[24px] font-normal text-gold">14:30</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full mt-2">
            <p className="border border-l-0 border-r-0 border-gray-600 text-gold text-[24px] w-full">Năm 2026</p>
          </div>
        </div>
      </div>

      {/* Lunar date */}
      <div className="text-center mt-4">
        <p className="text-title font-sf text-sm">
          Tức ngày: 01 tháng 04 năm Bính Ngọ
        </p>
      </div>

      <p className="mt-10 text-title text-[16px] font-normal font-sf uppercase">
        Hôn lễ được cử hành tại
      </p>
      <p className="my-4 text-gold text-[24px] font-normal font-sf uppercase">
        {VENUES.nhatrai.title}
      </p>
      <p className="text-title text-[16px] font-normal text-center whitespace-pre-line font-sf">
        {VENUES.nhatrai.textAddress}
      </p>

      {/* Decorative line */}
      <div className="h-px bg-gray-200 mt-8" />
    </section>
  );
}
