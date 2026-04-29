'use client';

import { useEffect, useState } from 'react';
import { motion, type Transition } from 'framer-motion';
import { VENUES } from '../config';
import { imageUrl } from '../lib/image';

const WEDDING_TIMESTAMP = new Date('2026-05-17T14:30:00+07:00').getTime();

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const diff = WEDDING_TIMESTAMP - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export default function CeremonySection() {
  const { days, hours, minutes, seconds } = useCountdown();

  const FILM_IMAGES = [
    imageUrl('/images/film_3.webp'),
    imageUrl('/images/film_1.webp'),
    imageUrl('/images/film_6.webp'),
  ]

  const TEXT_IN_IMAGES = [
    "I love three things in this world.",
    "Sun, Moon, and you.",
    "Sun for morning, Moon for night, and you forever."
  ]

  return (
    <section className="bg-white flex flex-col items-center -mx-2">
      <div className="text-center mb-6">
        <p
          className="text-title text-[16px] font-light font-sf whitespace-pre-line"
        >
          {
            `
            Trái tim anh,
            Tựa cánh chim nhỏ giữa đồng hoang,
            Đã tìm thấy bầu trời của riêng mình
            Trong đôi mắt em.
            `
          }
        </p>
      </div>

      <div className="flex w-full mt-10">
        <div className="flex w-full justify-between font-sf items-center text-black px-8">
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, x: '-40%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >
            WELCOME
          </motion.span>
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={T}
          >TO OUR</motion.span>
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, x: '40%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >WEDDING
          </motion.span>
        </div>
      </div>
      <div className="flex justify-center items-center bg-black mt-4 relative w-full">
        <img
          src={imageUrl("/images/film_container.webp")}
          className="w-screen"
          alt="" />
        <div className='absolute top-[19px] px-[45px] z-2 gap-2'>
          {FILM_IMAGES.map((img, idx) => {
            return (
              <div key={`container-${idx}`} className='relative bg-black/90'>
                <img
                  key={`image-${idx}`}
                  src={img}
                  className="w-full mt-1 h-[100%] object-cover"
                  alt="" />
                <motion.p
                  className='absolute bg-black text-white bottom-0 left-0 right-0 text-center h-8 pt-1 text-[12px] font-light font-sf tracking-wide leading-relaxed'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ ...T, delay: idx * 0.1 }}
                >
                  {TEXT_IN_IMAGES[idx]}
                </motion.p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-black -mt-1 w-full py-6 flex justify-around items-center text-white">
        {[
          { value: days, label: 'ngày' },
          { value: hours, label: 'giờ' },
          { value: minutes, label: 'phút' },
          { value: seconds, label: 'giây' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-[24px] font-light font-sf tabular-nums">{value}</span>
            <span className="text-[12px] font-sf tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
