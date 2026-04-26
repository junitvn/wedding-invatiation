'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Wish = {
  id: string;
  name: string;
  content: string;
  createdAt: { seconds: number } | null;
};

function formatTime(ts: { seconds: number } | null): string {
  if (!ts) return '';
  return new Date(ts.seconds * 1000).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function WishesSection({ venue, defaultName }: { venue: string; defaultName?: string }) {
  const [name, setName] = useState(defaultName ?? '');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setWishes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Wish)));
    });
    return unsub;
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        content: content.trim(),
        venue,
        createdAt: serverTimestamp(),
      });
      setName('');
      setContent('');
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="bg-white py-12 px-6">
      <div className="text-center mb-8">
        <p className="text-gray-600 text-[18px] font-light font-sf uppercase tracking-widest mb-1">
          Lời chúc
        </p>
        <p className="text-gray-400 text-[13px] font-sf">Gửi lời chúc đến cô dâu và chú rể</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên của bạn"
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] font-sf text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 mb-3"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Viết lời chúc của bạn..."
          required
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] font-sf text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 resize-none mb-3"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-3 rounded-lg text-white text-[14px] font-sf font-normal tracking-wide border border-[#7B1C1C] disabled:opacity-60"
          style={{ backgroundColor: '#7B1C1C' }}
        >
          {status === 'submitting' ? 'Đang gửi...' : 'Gửi lời chúc'}
        </button>
        {status === 'done' && (
          <p className="text-green-600 text-[13px] font-sf text-center mt-2">
            Lời chúc của bạn đã được gửi!
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-[13px] font-sf text-center mt-2">
            Đã có lỗi xảy ra. Vui lòng thử lại.
          </p>
        )}
      </form>

      {wishes.length > 0 && (
        <div className="flex flex-col gap-4">
          {wishes.map(w => (
            <div key={w.id} className="bg-[#F7F5F2] rounded-xl px-4 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-800 text-[14px] font-sf font-medium">{w.name}</p>
                <p className="text-gray-400 text-[12px] font-sf">{formatTime(w.createdAt)}</p>
              </div>
              <p className="text-gray-600 text-[14px] font-sf leading-relaxed">{w.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
