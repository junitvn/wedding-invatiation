'use client';

import { VENUES } from '../config';
import { imageUrl } from '../lib/image';

const WEDDING_DAY = 17;
const MONTH_DAYS = 31;
const FIRST_DAY_OF_WEEK = 4; // May 1 2026 = Friday (Mon=0)

export default function SaveTheDateSection() {
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_DAY_OF_WEEK; i++) cells.push(null);
  for (let d = 1; d <= MONTH_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <section className="bg-white py-10 px-6 flex flex-col items-center">
      {/* Gold heart */}
      <div className="flex justify-center mb-16">
        <img
          src={imageUrl('/images/heart_gold.png')}
          alt=""
          className="w-8 h-8 object-contain animate-up"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* SAVE THE DATE */}
      <h2
        className="text-center text-[32px] tracking-[0.12em] text-gold leading-none mb-8 font-katty animate-up"
      >
        SAVE THE DATE
      </h2>

      {/* Polaroid / film card */}
      <div
        className="mx-auto rounded-sm overflow-hidden"
        style={{
          backgroundImage: `url(${imageUrl('/images/cal_container.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="p-4 pb-0">
          {/* Photo with calendar overlay */}
          <div className="relative overflow-hidden">
            <img
              src={imageUrl('/images/welcome.jpg')}
              alt="Wedding"
              className="w-full object-cover min-h-[455px] animate-up"
              style={{ aspectRatio: '3/4' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            {/* Calendar overlay on photo */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pt-3 pb-3 animate-up">
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {week.map((day, di) => (
                    <div key={di} className="text-center mt-[10px] relative flex items-center justify-center">
                      {day === WEDDING_DAY ? (
                        <div className="flex items-center justify-center">
                          <img src={imageUrl('/images/calen_heart_1.png')} alt="ring" className="w-8 h-8 absolute object-cover" />
                          <span className="relative inline-flex items-center justify-center">
                            <span
                              className="relative text-white font-bold text-[14px]"
                              style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
                            >
                              {day}
                            </span>
                          </span>
                        </div>
                      ) : day !== null ? (
                        <span
                          className="text-white text-[13px]"
                          style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
                        >
                          {day}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-5 text-center">
          <p
            className="text-white text-[20px] tracking-wide font-sf animate-up"
            style={{ fontStyle: 'italic' }}
          >
            Chủ Nhật, 17/05/2026
          </p>
          <p
            className="text-white text-[15px] tracking-wide font-sf mt-1 animate-up"
            style={{ fontStyle: 'italic' }}
          >
            Âm lịch 01/04 | 14:30
          </p>
        </div>
      </div>

      {/* <div className="h-px bg-gray-200 mb-8 mt-8" />

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

      <div className="h-px bg-gray-200 mt-8" /> */}
    </section>
  );
}
