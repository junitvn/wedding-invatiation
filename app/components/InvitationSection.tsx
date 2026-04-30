'use client';

import { motion, type Transition } from 'framer-motion';
import { DEFAULT_VENUE, VenueConfig } from '../config';

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

export default function InvitationSection({
  guestName,
  venue = DEFAULT_VENUE,
  invitePhrase = 'Trân trọng kính mời',
  addressTo = '',
  selfRef = 'chúng tôi',
}: {
  guestName?: string;
  venue?: VenueConfig;
  invitePhrase?: string;
  addressTo?: string;
  selfRef?: string;
}) {
  const greeting = invitePhrase;

  return (
    <section className="bg-white py-8 px-6 text-center">
      <motion.p
        className="text-title text-[12px] font-light font-sf uppercase mb-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >{greeting}</motion.p>

      {/* Blank name line */}
      <motion.div
        className="border-b border-gray-400 mx-auto min-w-fit w-[80%] mb-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        {guestName && <p className="text-gold text-[28px] font-light font-uvn">{guestName}</p>}
      </motion.div>

      <motion.p
        className="text-title text-[12px] font-light font-sf mb-4 uppercase whitespace-pre-line"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >{`đến dự bữa tiệc chung vui\ncùng gia đình ${selfRef} vào lúc`}</motion.p>

      <motion.p
        className="uppercase tracking-[0.2em] text-highlight text-[16px] font-sf font-light mb-1"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        <span className="uppercase tracking-[0.2em] font-sf font-light mb-1 mr-1">17:30,</span>
        Thứ 7
      </motion.p>
      <motion.p
        className="text-gold text-[32px] font-semibold tracking-[0.2em] mt-2 font-sf"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        16.05.2026
      </motion.p>
      <motion.p
        className="text-title text-[14px] font-normal mt-2 font-sf"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        (Tức ngày 30 tháng 3 năm Bính Ngọ)
      </motion.p>

      {/* Decorative lines */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-3"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        <div className="h-px w-16 bg-gray-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#7B1C1C]" />
        <div className="h-px w-16 bg-gray-300" />
      </motion.div>

      <motion.p
        className="mt-6 text-title text-[16px] font-normal font-sf"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        Tại: {venue.title}
      </motion.p>
      <motion.p
        className="mt-2 text-gold text-[16px] font-normal font-sf"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        Địa chỉ: <span className="text-gold whitespace-pre-line text-[16px] font-normal font-sf">{venue.textAddress}</span>
      </motion.p>

      <motion.a
        href={venue.mapSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex justify-center mt-4 px-5 pb-2 pt-1 rounded-[20px] border border-gold text-white bg-gold text-[14px] font-sf font-normal tracking-wide hover:bg-gold hover:text-white transition-colors"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        Xem đường đi
      </motion.a>
    </section>
  );
}
