import { DEFAULT_VENUE, VenueConfig } from '../config';

export default function InvitationSection({ guestName, venue = DEFAULT_VENUE }: { guestName?: string; venue?: VenueConfig }) {
  return (
    <section className="bg-white py-8 px-6 text-center">
      {/* <p
        className="uppercase tracking-[0.25em] text-gray-700 text-sm font-sf font-light mb-6"
      >
        THƯ MỜI TIỆC CƯỚI
      </p> */}

      <p className="text-gray-600 text-[16px] font-light font-sf uppercase mb-2">Trân trọng kính mời</p>

      {/* Blank name line */}
      <div className="border-b border-gray-400 mx-auto min-w-fit w-[80%] mb-4">
        {guestName && <p className="text-gray-600 text-[24px] font-light font-uvn">{guestName}</p>}
      </div>

      <p className="text-gray-600 text-[16px] font-light font-sf mb-4 uppercase">Tới dự buổi tiệc chung vui</p>

      <p
        className="uppercase tracking-[0.2em] text-gray-600 text-xs font-sf font-light mb-1"
      >
        Vào lúc:
        <span
          className="uppercase tracking-[0.2em] text-gray-600 text-xs font-sf font-light mb-1 mr-1"
        >
          17:30,
        </span>
        Thứ 7
      </p>
      <p
        className="text-gray-800 text-[32px] font-semibold tracking-[0.2em] mt-2 font-sf"
      >
        16.05.2026
      </p>
      <p
        className="text-gray-500 text-[14px] font-normal mt-2 font-sf"
      >
        (Tức ngày 30 tháng 3 năm Bính Ngọ)
      </p>


      {/* Decorative lines */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-16 bg-gray-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#7B1C1C]" />
        <div className="h-px w-16 bg-gray-300" />
      </div>


      <p className="mt-6 text-gray-800 text-[16px] font-normal font-sf">
        Tại: {venue.title}
      </p>
      <p className="mt-2 text-gray-800 text-[16px] font-normal font-sf">
        Địa chỉ: <span className="text-gray-800 whitespace-pre-line text-[16px] font-normal font-sf">{venue.textAddress}</span>
      </p>

      <a
        href={venue.mapSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 px-5 py-2 border border-[#7B1C1C] text-[#7B1C1C] text-[14px] font-sf font-normal tracking-wide hover:bg-[#7B1C1C] hover:text-white transition-colors"
      >
        Xem đường đi
      </a>

    </section>
  );
}
