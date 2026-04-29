'use client';

import { motion, type Transition } from 'framer-motion';
import { VENUES } from '../config';
import { imageUrl } from '../lib/image';

const WEDDING_DAY = 17;
const MONTH_DAYS = 31;
const FIRST_DAY_OF_WEEK = 4; // May 1 2026 = Friday (Mon=0)

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

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
        <motion.img
          src={imageUrl('/images/heart_gold.png')}
          alt=""
          className="w-8 h-8 object-contain"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={T}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* SAVE THE DATE */}
      <motion.h2
        className="text-center text-[48px] tracking-[0.12em] text-gold leading-none mb-8 font-katty"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        Save the date
      </motion.h2>

      {/* Polaroid / film card */}
      <div
        className="w-full rounded-sm overflow-hidden relative"
      >
        <motion.img
          src={imageUrl('/images/cal_container.png')}
          alt="Wedding"
          className="w-full object-cover"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={T}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute top-0 left-0 right-4 w-full z-1 object-cover">
          {/* Photo with calendar overlay */}
          <div className="relative flex justify-center pt-4 items-center overflow-hidden">
            <motion.img
              src={imageUrl('/images/welcome.jpg')}
              alt="Wedding"
              className="w-[90%] object-cover mx-2"
              style={{ aspectRatio: '0.7' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={T}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            <div className=' absolute top-0 right-0 w-full h-full bg-black/20 z-0' />

            {/* Calendar overlay on photo */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 px-3 pt-3 pb-3 z-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={T}
            >
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
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 py-3 text-center">
          <motion.p
            className="text-white text-[20px] tracking-wide font-sf"
            style={{ fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={T}
          >
            Chủ Nhật, 17/05/2026
          </motion.p>
          <motion.p
            className="text-white text-[15px] tracking-wide font-sf mt-1"
            style={{ fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ ...T, delay: 0.1 }}
          >
            Âm lịch 01/04 | 14:30
          </motion.p>
        </div>
      </div>
    </section>
  );
}
