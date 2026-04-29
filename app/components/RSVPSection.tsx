'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function RSVPSection({ venue, defaultName }: { venue: string; defaultName?: string }) {
  const [name, setName] = useState(defaultName ?? '');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'confirmations'), {
        name: name.trim(),
        attending,
        guestCount: attending ? guestCount : 0,
        venue,
        createdAt: serverTimestamp(),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <section className="bg-[#F7F5F2] py-12 px-6">
        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 text-center">
          <p className="text-gray-700 text-[18px] font-sf font-medium mb-2">Cảm ơn bạn!</p>
          <p className="text-gray-500 text-[14px] font-sf">
            {attending
              ? 'Chúng tôi rất vui được đón bạn trong ngày trọng đại này.'
              : 'Rất tiếc khi không có bạn, nhưng chúng tôi trân trọng sự phản hồi của bạn.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm px-6 py-8">
        <h2 className="text-gray-900 text-[20px] font-semibold font-sf mb-6 text-center">
          Xác nhận tham dự
        </h2>

        <label className="block text-gray-700 text-[14px] font-sf font-normal mb-1">
          Họ và tên
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nhập tên của bạn"
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] font-sf text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 mb-5"
        />

        <p className="text-gray-700 text-[14px] font-sf font-normal mb-3">Bạn sẽ tham dự chứ?</p>
        <div className="flex flex-col gap-3 mb-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={attending === true}
              onChange={() => setAttending(true)}
              className="w-5 h-5 accent-blue-500"
            />
            <span className="text-gray-700 text-[14px] font-sf">Có, tôi sẽ tham dự</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={attending === false}
              onChange={() => setAttending(false)}
              className="w-5 h-5 mt-0.5 accent-blue-500"
            />
            <span className="text-gray-700 text-[14px] font-sf">
              Tôi bạn, rất tiếc không thể tham dự
            </span>
          </label>
        </div>

        {attending && (
          <>
            <label className="block text-gray-700 text-[14px] font-sf font-normal mb-1">
              Số lượng người tham dự
            </label>
            <div className="relative mb-6">
              <select
                value={guestCount}
                onChange={e => setGuestCount(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] font-sf text-gray-700 appearance-none focus:outline-none focus:border-gray-400 bg-white"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>
                    {n} người
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </span>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3 rounded-lg text-white text-[15px] font-sf font-normal tracking-wide disabled:opacity-60"
          style={{ backgroundColor: '#B8986A' }}
        >
          {status === 'submitting' ? 'Đang gửi...' : 'Gửi xác nhận'}
        </button>
        {status === 'error' && (
          <p className="text-red-500 text-[13px] font-sf text-center mt-3">
            Đã có lỗi xảy ra. Vui lòng thử lại.
          </p>
        )}
      </form>
    </section>
  );
}
