'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { imageUrl } from '../lib/image';

const GIFT_CONFIG: Record<string, {
  label: string;
  name: string;
  bank: string;
  accountNumber: string;
  qr: string;
}> = {
  nhatrai: {
    label: 'Chú rể · Nguyễn Ngọc Lâm',
    name: 'NGUYỄN NGỌC LÂM',
    bank: 'VPBank',
    accountNumber: '88882202',
    qr: imageUrl('/images/qr_nhatrai_2.webp'),
  },
  nhagai: {
    label: 'Cô dâu · Lý Ngọc Bích',
    name: 'LÝ NGỌC BÍCH',
    bank: 'TPBank',
    accountNumber: '08295108686',
    qr: imageUrl('/images/qr_nhagai_2.webp'),
  },
};

export default function GiftBoxSection({ venue = 'nhatrai' }: { venue?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = GIFT_CONFIG[venue] ?? GIFT_CONFIG.nhatrai;

  function handleCopy() {
    navigator.clipboard.writeText(cfg.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <section className="py-12 px-6 flex flex-col items-center">
        <p
          className="text-[11px] font-sf uppercase tracking-[0.25em] mb-1"
          style={{ color: '#9C7A4A' }}
        >
          Hộp quà yêu thương
        </p>
        <p className="text-gray-400 text-[13px] font-sf mb-8">Nhấn vào hộp quà để mở</p>

        <motion.button
          onClick={() => setOpen(true)}
          animate={{ rotate: [0, -6, 6, -6, 6, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.5, ease: 'easeInOut' }}
          className="focus:outline-none drop-shadow-md"
          aria-label="Mở hộp quà"
        >
          <img
            src={imageUrl('/images/gift-box.png')}
            alt="Hộp quà"
            className="w-20 h-20 object-contain"
          />
        </motion.button>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full relative overflow-hidden"
              style={{ maxWidth: '360px' }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 text-[14px]"
                  aria-label="Đóng"
                >
                  ✕
                </button>
                <h2 className="text-[20px] font-normal font-sf" style={{ color: '#B8986A' }}>
                  Hộp quà yêu thương
                </h2>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center px-6 gap-3 pb-6">
                <img
                  src={cfg.qr}
                  alt={`QR ${cfg.label}`}
                  className="w-full h-fit aspect-[1] object-contain rounded-xl border border-gray-100"
                />
                <a
                  href={cfg.qr}
                  download={`qr-${venue}.webp`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-sf text-white"
                  style={{ backgroundColor: '#B8986A' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Tải xuống QR
                </a>
              </div>

              {/* Account info */}
              <div className="mx-5 mb-6 bg-[#F7F5F2] rounded-xl px-4 py-4">
                <p className="text-[15px] text-gray-800 font-sf font-semibold mb-3">{cfg.label}</p>

                <p className="text-[11px] text-gray-400 font-sf uppercase tracking-wide mb-0.5">
                  {cfg.bank}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[18px] text-gray-800 font-sf font-semibold tracking-widest">
                    {cfg.accountNumber}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-sf text-white transition-all"
                    style={{ backgroundColor: copied ? '#6B9E6B' : '#B8986A' }}
                  >
                    {copied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
