'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VenueConfig } from '../config';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin123';

type Wish = { id: string; name: string; content: string; venue?: string; createdAt: { seconds: number } | null };
type Confirmation = {
  id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  venue?: string;
  createdAt: { seconds: number } | null;
};
type GuestEntry = { id: string; key: string; displayName: string; venue: string };
type VenueEntry = { id: string } & VenueConfig & { key: string };

function formatTime(ts: { seconds: number } | null) {
  if (!ts) return '—';
  return new Date(ts.seconds * 1000).toLocaleString('vi-VN');
}

// ─── Login ───────────────────────────────────────────────────────────────────
function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('admin123');
  const [err, setErr] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr(true); setPw(''); }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-8 w-full max-w-xs">
        <h1 className="text-gray-900 text-xl font-semibold mb-6 text-center">Admin</h1>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          placeholder="Mật khẩu"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:border-gray-400"
        />
        {err && <p className="text-red-500 text-xs mb-2">Sai mật khẩu</p>}
        <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────
const TABS = ['Lời chúc', 'Xác nhận', 'Khách mời', 'Địa điểm'] as const;
type Tab = typeof TABS[number];

// ─── Shared ───────────────────────────────────────────────────────────────────
type VenueFilter = 'all' | 'nhatrai' | 'nhagai';
const VENUE_FILTER_LABELS: Record<VenueFilter, string> = { all: 'Tất cả', nhatrai: 'Nhà Trai', nhagai: 'Nhà Gái' };
const VENUE_BADGE: Record<string, string> = { nhatrai: 'bg-blue-50 text-blue-600', nhagai: 'bg-pink-50 text-pink-600' };

function VenueFilterBar({ value, onChange }: { value: VenueFilter; onChange: (v: VenueFilter) => void }) {
  return (
    <div className="flex gap-2 mb-4">
      {(Object.keys(VENUE_FILTER_LABELS) as VenueFilter[]).map(k => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            value === k ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {VENUE_FILTER_LABELS[k]}
        </button>
      ))}
    </div>
  );
}

function VenueBadge({ venue }: { venue?: string }) {
  if (!venue) return null;
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${VENUE_BADGE[venue] ?? 'bg-gray-100 text-gray-500'}`}>
      {VENUE_LABELS[venue] ?? venue}
    </span>
  );
}

// ─── Wishes tab ──────────────────────────────────────────────────────────────
function WishesTab() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [filter, setFilter] = useState<VenueFilter>('all');
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setWishes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Wish))));
  }, []);
  const visible = filter === 'all' ? wishes : wishes.filter(w => w.venue === filter);
  return (
    <div>
      <VenueFilterBar value={filter} onChange={setFilter} />
      <p className="text-gray-500 text-sm mb-4">{visible.length} lời chúc</p>
      <div className="flex flex-col gap-3">
        {visible.map(w => (
          <div key={w.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{w.name}</span>
                <VenueBadge venue={w.venue} />
              </div>
              <div className="flex items-center gap-3 ml-2 shrink-0">
                <span className="text-gray-400 text-xs">{formatTime(w.createdAt)}</span>
                <button
                  onClick={() => deleteDoc(doc(db, 'wishes', w.id))}
                  className="text-red-400 text-xs hover:text-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{w.content}</p>
          </div>
        ))}
        {visible.length === 0 && <p className="text-gray-400 text-sm">Chưa có lời chúc nào.</p>}
      </div>
    </div>
  );
}

// ─── Confirmations tab ───────────────────────────────────────────────────────
function ConfirmationsTab() {
  const [items, setItems] = useState<Confirmation[]>([]);
  const [filter, setFilter] = useState<VenueFilter>('all');
  useEffect(() => {
    const q = query(collection(db, 'confirmations'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Confirmation))));
  }, []);
  const visible = filter === 'all' ? items : items.filter(c => c.venue === filter);
  const total = visible.filter(i => i.attending).reduce((s, i) => s + (i.guestCount || 1), 0);
  return (
    <div>
      <VenueFilterBar value={filter} onChange={setFilter} />
      <p className="text-gray-500 text-sm mb-4">
        {visible.length} phản hồi · {total} người tham dự
      </p>
      <div className="flex flex-col gap-3">
        {visible.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                <VenueBadge venue={c.venue} />
              </div>
              <p className="text-gray-500 text-xs">
                {c.attending ? `✓ Tham dự · ${c.guestCount} người` : '✗ Không tham dự'}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-2 shrink-0">
              <span className="text-gray-400 text-xs">{formatTime(c.createdAt)}</span>
              <button
                onClick={() => deleteDoc(doc(db, 'confirmations', c.id))}
                className="text-red-400 text-xs hover:text-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-gray-400 text-sm">Chưa có xác nhận nào.</p>}
      </div>
    </div>
  );
}

// ─── Guests tab ──────────────────────────────────────────────────────────────
const VENUE_LABELS: Record<string, string> = { nhatrai: 'Nhà Trai', nhagai: 'Nhà Gái' };

function VenuePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 w-full"
      >
        <span className="flex-1 text-left">{VENUE_LABELS[value] ?? value}</span>
        <span className="text-gray-400 text-xs">▾</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-72 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-gray-500 text-xs uppercase tracking-widest px-5 pt-5 pb-3">
              Chọn địa điểm
            </p>
            {Object.entries(VENUE_LABELS).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => { onChange(k); setOpen(false); }}
                className={`w-full text-left px-5 py-4 text-[15px] border-t border-gray-100 transition-colors ${
                  value === k
                    ? 'text-gray-900 font-semibold bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
                {value === k && <span className="float-right text-gray-900">✓</span>}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-center py-4 text-sm text-gray-400 border-t border-gray-100 hover:bg-gray-50"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GuestCard({ g, onEdit }: { g: GuestEntry; onEdit: (g: GuestEntry) => void }) {
  const [copied, setCopied] = useState(false);

  function buildLink(venue: string) {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/?guest=${g.key}&venue=${venue}`;
  }

  async function changeVenue(venue: string) {
    await setDoc(doc(db, 'guests', g.id), { displayName: g.displayName, venue }, { merge: true });
  }

  function copyLink() {
    navigator.clipboard.writeText(buildLink(g.venue));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <p className="text-gray-800 text-sm font-medium">{g.displayName}</p>
        <div className="flex gap-3 ml-2 shrink-0">
          <button onClick={() => onEdit(g)} className="text-blue-400 text-xs hover:text-blue-600">
            Sửa
          </button>
          <button onClick={() => deleteDoc(doc(db, 'guests', g.id))} className="text-red-400 text-xs hover:text-red-600">
            Xóa
          </button>
        </div>
      </div>
      <VenuePicker value={g.venue} onChange={changeVenue} />
      <div className="flex items-center gap-2 mt-2">
        <p className="text-gray-400 text-xs truncate flex-1">?guest={g.key}&amp;venue={g.venue}</p>
        <button
          onClick={copyLink}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            copied
              ? 'border-green-300 text-green-600 bg-green-50'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {copied ? '✓ Đã copy' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}

function GuestsTab() {
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [key, setKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [newVenue, setNewVenue] = useState('nhatrai');
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'guests'), snap =>
      setGuests(snap.docs.map(d => ({ id: d.id, key: d.id, displayName: d.data().displayName ?? '', venue: d.data().venue ?? 'nhatrai' })))
    );
  }, []);

  function startEdit(g: GuestEntry) {
    setEditingId(g.id);
    setKey(g.key);
    setDisplayName(g.displayName);
    setNewVenue(g.venue);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelEdit() {
    setEditingId(null);
    setKey(''); setDisplayName(''); setNewVenue('nhatrai');
  }

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!key.trim() || !displayName.trim()) return;
    setSaving(true);
    await setDoc(doc(db, 'guests', key.trim().toLowerCase()), { displayName: displayName.trim(), venue: newVenue });
    setEditingId(null);
    setKey(''); setDisplayName(''); setNewVenue('nhatrai');
    setSaving(false);
  }

  return (
    <div>
      <form ref={formRef} onSubmit={submit} className="bg-white rounded-xl p-4 shadow-sm mb-4 flex flex-col gap-2">
        <p className="text-gray-700 text-sm font-medium">{editingId ? 'Sửa khách mời' : 'Thêm khách mời'}</p>
        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Key (vd: banteo)"
          disabled={!!editingId}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
        />
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Tên hiển thị (vd: Bạn Tèo)"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        <VenuePicker value={newVenue} onChange={setNewVenue} />
        <div className="flex gap-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50">
            {editingId ? 'Lưu' : 'Thêm'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Huỷ
            </button>
          )}
        </div>
      </form>
      <div className="flex flex-col gap-2">
        {guests.map(g => <GuestCard key={g.id} g={g} onEdit={startEdit} />)}
        {guests.length === 0 && <p className="text-gray-400 text-sm">Chưa có khách mời nào.</p>}
      </div>
    </div>
  );
}

// ─── Venues tab ──────────────────────────────────────────────────────────────
const EMPTY_VENUE: Omit<VenueConfig, 'mapSrc'> & { mapSrc: string } = {
  title: '', address: '', textAddress: '', mapSrc: '',
};

function VenuesTab() {
  const [venues, setVenues] = useState<VenueEntry[]>([]);
  const [form, setForm] = useState<{ key: string } & VenueConfig>({ key: '', ...EMPTY_VENUE });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'venues'), snap =>
      setVenues(snap.docs.map(d => ({ id: d.id, key: d.id, ...d.data() } as VenueEntry)))
    );
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const { key, ...data } = form;
    await setDoc(doc(db, 'venues', key.trim().toLowerCase()), data);
    setForm({ key: '', ...EMPTY_VENUE });
    setEditing(null);
    setSaving(false);
  }

  function startEdit(v: VenueEntry) {
    setForm({ key: v.key, title: v.title, address: v.address, textAddress: v.textAddress, mapSrc: v.mapSrc });
    setEditing(v.key);
  }

  return (
    <div>
      <form onSubmit={save} className="bg-white rounded-xl p-4 shadow-sm mb-4 flex flex-col gap-2">
        <p className="text-gray-700 text-sm font-medium">
          {editing ? `Sửa: ${editing}` : 'Thêm địa điểm'}
        </p>
        {!editing && (
          <input value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
            placeholder="Key (vd: nhatrai)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        )}
        {(['title', 'address', 'textAddress', 'mapSrc'] as const).map(field => (
          <input key={field} value={form[field]}
            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
            placeholder={field}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        ))}
        <div className="flex gap-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50">
            {editing ? 'Lưu' : 'Thêm'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ key: '', ...EMPTY_VENUE }); }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
              Huỷ
            </button>
          )}
        </div>
      </form>
      <div className="flex flex-col gap-2">
        {venues.map(v => (
          <div key={v.id} className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-800 text-sm font-medium">{v.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{v.textAddress}</p>
                <p className="text-gray-400 text-xs">key: {v.key}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(v)} className="text-blue-400 text-xs hover:text-blue-600">Sửa</button>
                <button onClick={() => deleteDoc(doc(db, 'venues', v.id))} className="text-red-400 text-xs hover:text-red-600">Xóa</button>
              </div>
            </div>
          </div>
        ))}
        {venues.length === 0 && <p className="text-gray-400 text-sm">Chưa có địa điểm nào.</p>}
      </div>
    </div>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('Lời chúc');

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-gray-900 text-base font-semibold">Admin · Thiệp cưới</h1>
        <button onClick={() => setAuthed(false)} className="text-gray-400 text-sm hover:text-gray-600">
          Đăng xuất
        </button>
      </header>

      <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${tab === t
              ? 'text-gray-900 border-b-2 border-gray-900 font-medium'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 py-6">
        {tab === 'Lời chúc' && <WishesTab />}
        {tab === 'Xác nhận' && <ConfirmationsTab />}
        {tab === 'Khách mời' && <GuestsTab />}
        {tab === 'Địa điểm' && <VenuesTab />}
      </div>
    </div>
  );
}
