'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { imageUrl } from '../lib/image';

type Wish = { id: string; name: string; content: string };
type FloatingItem = { key: string; wish: Wish };

export default function FloatingWishesWidget({
  defaultName = '',
  venue = '',
}: {
  defaultName?: string;
  venue?: string;
}) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [visible, setVisible] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const wishesRef = useRef<Wish[]>([]);
  const queueIdxRef = useRef(0);

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Wish));
      setWishes(data);
      wishesRef.current = data;
    });
  }, []);

  useEffect(() => {
    if (!visible) return;

    const showNext = () => {
      const ws = wishesRef.current;
      if (ws.length === 0) return;
      const wish = ws[queueIdxRef.current % ws.length];
      queueIdxRef.current++;
      const key = String(Date.now());
      setFloatingItems(prev => [...prev, { key, wish }]);
    };

    const initial = setTimeout(showNext, 800);
    const interval = setInterval(showNext, 4000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [visible, wishes.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim() || status === 'submitting') return;
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        content: content.trim(),
        venue,
        createdAt: serverTimestamp(),
      });
      setContent('');
      setStatus('done');
      setTimeout(() => {
        setStatus('idle');
        setSheetOpen(false);
      }, 1500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      {/* Fixed floating area */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none">
        {/* Scrolling wishes */}
        {visible && (
          <div className="relative overflow-hidden mx-4 mb-1" style={{ height: 180 }}>
            <AnimatePresence>
              {floatingItems.map(item => (
                <motion.div
                  key={item.key}
                  className="absolute bottom-0 left-0"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -230, opacity: [0, 1, 1, 0] }}
                  exit={{}}
                  transition={{
                    duration: 5,
                    ease: 'linear',
                    opacity: { times: [0, 0.08, 0.70, 1], duration: 5, ease: 'linear' },
                  }}
                  onAnimationComplete={() =>
                    setFloatingItems(prev => prev.filter(w => w.key !== item.key))
                  }
                >
                  <div
                    className="inline-flex rounded-full px-4 py-2 max-w-[360px]"
                    style={{ backgroundColor: 'rgba(249, 213, 213, 0.92)' }}
                  >
                    <p className="text-[13px] text-gray-800 leading-5 line-clamp-1">
                      <span className="font-semibold">{item.wish.name}</span>:{' '}
                      {item.wish.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom buttons */}
        <div className="flex items-center gap-3 px-4 pb-2 pointer-events-auto">
          <AnimatePresence>
            {visible && (
              <motion.button
                key="send-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSheetOpen(true)}
                className="flex flex-1 items-center gap-2 rounded-full px-5 py-3 shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <span className="text-white text-[14px]">Gửi lời chúc...</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400 ml-auto flex-shrink-0"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => setVisible(v => !v)}
            className="flex items-center justify-center ml-auto flex-shrink-0"
          >
            {visible ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-gray-500"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <img className='w-20 h-auto' src={imageUrl('/images/message-heart.png')} alt="Message heart" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white z-50"
              style={{ height: 'auto', borderRadius: '24px 24px 0 0' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="relative flex flex-col h-full px-6 pt-6 pb-8">
                {/* Decorative icon */}
                <div className="flex justify-center mb-3 absolute -top-4 left-1/2 -translate-x-1/2">
                  <div
                    className="w-32 h-fit rounded-2xl flex items-center justify-center"
                  >
                    <img className='w-full h-full' src={imageUrl('/images/message-heart.png')} alt="Message heart" />
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSheetOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 text-xl font-light"
                >
                  ✕
                </button>

                {/* Title */}
                <h2 className="text-center text-[24px] font-bold text-gray-800 mb-5 mt-6">
                  Gửi lời chúc
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Được gửi từ..."
                    className="w-full rounded-[8px] px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none"
                    style={{ border: '1.5px solid #f9c0c8' }}
                  />
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Lời chúc tới cô dâu chú rể"
                    rows={5}
                    className="w-full rounded-[8px] px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none resize-none flex-1"
                    style={{ border: '1.5px solid #f9c0c8' }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting' || status === 'done'}
                    className="w-full py-2 rounded-full text-white text-[16px] -mb-4 font-medium disabled:opacity-60"
                    style={{ backgroundColor: '#d4637a' }}
                  >
                    {status === 'submitting'
                      ? 'Đang gửi...'
                      : status === 'done'
                        ? 'Đã gửi!'
                        : 'Gửi Lời Chúc'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-500 text-[13px] text-center">
                      Đã có lỗi. Vui lòng thử lại.
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
