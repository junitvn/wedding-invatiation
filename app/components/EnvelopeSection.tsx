'use client';

import { useState } from 'react';
import { imageUrl } from '../lib/image';

const HEART_CONFIGS = [
  { dx: -85, delay: 0.5, size: 40, rotate: -3 },
  { dx: 45, delay: 0.65, size: 58, rotate: 10 },
  { dx: -20, delay: 0.6, size: 54, rotate: 0 },
  { dx: 90, delay: 1, size: 46, rotate: 4 },
  { dx: -40, delay: 0.85, size: 64, rotate: -5 },
  { dx: 90, delay: 0, size: 56, rotate: 10 },
  { dx: -40, delay: 0, size: 64, rotate: 0 },
];

const W = 300;
const H = 206;
const SLIDE = 100;
const FOLD = 52;
const TOTAL_H = H + SLIDE;

// Wax seal center within the envelope container
const SEAL_TOP = SLIDE + H * (FOLD / 100);

export default function EnvelopeSection({ onOpen }: { onOpen?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [heartKey, setHeartKey] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      onOpen?.();
      setHeartKey(k => k + 1);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 6000);
    }
    setIsOpen(o => !o);
  };

  return (
    <section className="flex flex-col items-center justify-center relative">
      <p
        className="font-uvn text-gray-700 text-[24px] font-light select-none absolute top-[9%] left-1/2 -translate-x-1/2 translate-y-1/2"
      >
        Chạm để mở thiệp
      </p>

      <div
        className={`relative cursor-pointer select-none animate-bounce`}
        style={{ width: W, height: TOTAL_H, perspective: '1000px' }}
        onClick={handleClick}
      >
        {/* Photo */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: SLIDE,
            left: 10, right: 10,
            height: H - 12,
            borderRadius: 4,
            zIndex: 2,
            opacity: 1,
            transform: isOpen ? `translateY(-${SLIDE}px)` : 'translateY(0)',
            transition: isOpen
              ? `opacity 0.4s ease 0.8s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 1.2s`
              : `transform 0.4s ease 0s, opacity 0.3s ease 0.4s`,
            willChange: 'opacity, transform',
          }}
        >
          <img
            src={imageUrl('/images/ngang_2.webp')}
            alt="Wedding"
            style={{ zIndex: 4 }}
            className="w-[97%] h-full object-cover object-top"
          />
        </div>

        {/* Floating hearts — z:4, above photo (z:2), below triangles/seal (z:5+) */}
        {showHearts && (
          <div key={heartKey} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
            {HEART_CONFIGS.map((h, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: W / 2 + h.dx,
                  top: SEAL_TOP,
                  '--dx': `${h.dx}px`,
                  animation: `heartFloat 4.8s ease-out ${1.8 + h.delay}s forwards`,
                  lineHeight: 1,
                } as React.CSSProperties}
              >
                <img src={imageUrl('/images/heart.png')} alt="Heart" className="object-contain" style={{
                  width: h.size,
                  height: h.size,
                  transform: `rotate(${h.rotate}deg)`,
                }} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="absolute" style={{
          top: SLIDE, left: 0, width: W, height: H,
          clipPath: `polygon(0 100%, 50% ${FOLD}%, 100% 100%)`,
          background: '#e0d9ce', zIndex: 5,
        }} />
        {/* Left */}
        <div className="absolute" style={{
          top: SLIDE, left: 0, width: W, height: H,
          clipPath: `polygon(0 0, 50% ${FOLD}%, 0 100%)`,
          background: '#d6cfc4', zIndex: 5,
        }} />
        {/* Right */}
        <div className="absolute" style={{
          top: SLIDE, left: 0, width: W, height: H,
          clipPath: `polygon(100% 0, 100% 100%, 50% ${FOLD}%)`,
          background: '#d6cfc4', zIndex: 5,
        }} />

        {/* Back */}
        <div className="absolute" style={{
          top: SLIDE - 1, left: 0, width: W, height: H,
          background: '#e0d9ce', zIndex: 1,
        }} />

        {/* Top flap */}
        <div className="absolute" style={{
          top: SLIDE, left: 0, width: W, height: H,
          zIndex: isOpen ? 1 : 5,
          transformOrigin: 'top center',
          clipPath: `polygon(-2% 0, 102% 0, 50% ${FOLD + 3}%)`,
          background: isOpen ? '#ddd7d0' : '#cbc3b8',
          transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
          transition: isOpen
            ? `transform 0.8s cubic-bezier(0.4,0,0.2,1) 0s,
               background-color 0s 0.4s,
               z-index 0s 0.8s`
            : `transform 0.8s cubic-bezier(0.4,0,0.2,1) 0.8s,
               background-color 0s 1.2s,
               z-index 0s 1.2s`,
          willChange: 'transform',
        }} />

        {/* Wax seal */}
        <div className="absolute pointer-events-none" style={{
          left: W / 2,
          top: SEAL_TOP,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }}>
          <img src={imageUrl('/images/seal.webp')} alt="Wax seal" className="w-12 h-12" />
        </div>
      </div>
    </section>
  );
}
