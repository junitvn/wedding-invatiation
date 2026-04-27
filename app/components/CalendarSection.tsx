'use client';

import { imageUrl } from '../lib/image';

const HIGHLIGHTED_DAY = 17;
const MONTH_DAYS = 31;
const FIRST_DAY_OF_WEEK = 4;


export default function CalendarSection() {
  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_DAY_OF_WEEK; i++) cells.push(null);
  for (let d = 1; d <= MONTH_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <section className="bg-white pt-0 pb-12 px-6">
      {/* Arched welcome image */}
      <div className="relative mx-auto mb-8" style={{ maxWidth: '360px' }}>
        <div
          className="w-full bg-gray-300 overflow-hidden relative"
          style={{ aspectRatio: '3/5', borderRadius: '50% 50% 0 0 / 25% 25% 0 0' }}
        >
          <img
            src={imageUrl('/images/welcome.jpg')}
            alt="Welcome"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Curved text bo theo mép cong phía trên ảnh */}
          <svg
            viewBox="0 0 300 550"
            className="absolute top-2 inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              <path id="archEdge" d="M 0,100 A 150,100 0 0,1 300,100" fill="none" />
            </defs>
            <text
              fontSize="18"
              letterSpacing="4"
              fill="white"
              fontWeight="500"
              dy="18"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))', fontFamily: 'var(--gf-montserrat), sans-serif' }}
            >
              <textPath href="#archEdge" startOffset="50%" textAnchor="middle">
                WELCOME TO OUR WEDDING
              </textPath>
            </text>nhà
          </svg>

          {/* Calendar overlay at bottom of image */}
          <div
            className="absolute px-4 pt-2 pb-3"
            style={{ bottom: '10px', left: '10px', right: '10px', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(1px)', borderRadius: '12px' }}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((day, di) => (
                  <div key={di} className="relative text-center mt-3">
                    {day !== null ? (
                      day === HIGHLIGHTED_DAY ? (
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
                      ) : (
                        <span
                          className="text-black text-[14px]"
                          style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
                        >
                          {day}
                        </span>
                      )
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
