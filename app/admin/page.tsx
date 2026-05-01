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
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VenueConfig } from '../config';
import { encodeGuestParams } from '../lib/encoding';

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
type GuestEntry = {
  id: string;
  key: string;
  displayName: string;
  venue: string;
  invitePhrase: string;
  addressTo: string;
  selfRef: string;
  confirmStatus: 'attending' | 'not_attending' | 'pending';
  attendingCount: number;
  sentStatus: 'sent' | 'not_sent';
  viewStatus: 'viewed' | 'not_viewed';
};
type VenueEntry = { id: string } & VenueConfig & { key: string };


function formatTime(ts: { seconds: number } | null) {
  if (!ts) return '—';
  return new Date(ts.seconds * 1000).toLocaleString('vi-VN');
}

function slugify(name: string): string {
  const map: Record<string, string> = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a', ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
    â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a', è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e', ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o', ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o', ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u', ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y', đ: 'd',
    À: 'a', Á: 'a', Ả: 'a', Ã: 'a', Ạ: 'a', Ă: 'a', Ằ: 'a', Ắ: 'a', Ẳ: 'a', Ẵ: 'a', Ặ: 'a',
    Â: 'a', Ầ: 'a', Ấ: 'a', Ẩ: 'a', Ẫ: 'a', Ậ: 'a', È: 'e', É: 'e', Ẻ: 'e', Ẽ: 'e', Ẹ: 'e',
    Ê: 'e', Ề: 'e', Ế: 'e', Ể: 'e', Ễ: 'e', Ệ: 'e', Ì: 'i', Í: 'i', Ỉ: 'i', Ĩ: 'i', Ị: 'i',
    Ò: 'o', Ó: 'o', Ỏ: 'o', Õ: 'o', Ọ: 'o', Ô: 'o', Ồ: 'o', Ố: 'o', Ổ: 'o', Ỗ: 'o', Ộ: 'o',
    Ơ: 'o', Ờ: 'o', Ớ: 'o', Ở: 'o', Ỡ: 'o', Ợ: 'o', Ù: 'u', Ú: 'u', Ủ: 'u', Ũ: 'u', Ụ: 'u',
    Ư: 'u', Ừ: 'u', Ứ: 'u', Ử: 'u', Ữ: 'u', Ự: 'u', Ỳ: 'y', Ý: 'y', Ỷ: 'y', Ỹ: 'y', Ỵ: 'y', Đ: 'd',
  };
  return name.split('').map(c => map[c] ?? c).join('').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// ─── Login ───────────────────────────────────────────────────────────────────
function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { onAuth(); }
    else { setErr(true); setPw(''); }
  }
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">
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
const TABS = ['Khách mời', 'Lời chúc'] as const;
type Tab = typeof TABS[number];

// ─── Shared ───────────────────────────────────────────────────────────────────
type VenueFilter = 'all' | 'nhatrai' | 'nhagai';
const VENUE_FILTER_LABELS: Record<VenueFilter, string> = { all: 'Tất cả', nhatrai: 'Nhà Trai', nhagai: 'Nhà Gái' };
const VENUE_BADGE: Record<string, string> = { nhatrai: 'bg-blue-50 text-blue-600', nhagai: 'bg-pink-50 text-pink-600' };
const VENUE_LABELS: Record<string, string> = { nhatrai: 'Nhà Trai', nhagai: 'Nhà Gái' };

function VenueFilterBar({ value, onChange }: { value: VenueFilter; onChange: (v: VenueFilter) => void }) {
  return (
    <div className="flex gap-2 mb-4 font-sf">
      {(Object.keys(VENUE_FILTER_LABELS) as VenueFilter[]).map(k => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${value === k ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
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
                <button onClick={() => deleteDoc(doc(db, 'wishes', w.id))} className="text-red-400 text-xs hover:text-red-600">Xóa</button>
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
      <p className="text-gray-500 text-sm mb-4">{visible.length} phản hồi · {total} người tham dự</p>
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
              <button onClick={() => deleteDoc(doc(db, 'confirmations', c.id))} className="text-red-400 text-xs hover:text-red-600">Xóa</button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-gray-400 text-sm">Chưa có xác nhận nào.</p>}
      </div>
    </div>
  );
}

// ─── Guests tab ──────────────────────────────────────────────────────────────
function VenuePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 w-full">
        <span className="flex-1 text-left">{VENUE_LABELS[value] ?? value}</span>
        <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-72 overflow-hidden" onClick={e => e.stopPropagation()}>
            <p className="text-gray-500 text-xs uppercase tracking-widest px-5 pt-5 pb-3">Chọn địa điểm</p>
            {Object.entries(VENUE_LABELS).map(([k, label]) => (
              <button key={k} type="button" onClick={() => { onChange(k); setOpen(false); }}
                className={`w-full text-left px-5 py-4 text-[15px] border-t border-gray-100 transition-colors ${value === k ? 'text-gray-900 font-semibold bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                {label}{value === k && <span className="float-right text-gray-900">✓</span>}
              </button>
            ))}
            <button type="button" onClick={() => setOpen(false)}
              className="w-full text-center py-4 text-sm text-gray-400 border-t border-gray-100 hover:bg-gray-50">Huỷ</button>
          </div>
        </div>
      )}
    </>
  );
}

function GuestModal({ editingId, form, setForm, saving, onSubmit, onClose }: {
  editingId: string | null;
  form: typeof EMPTY_GUEST_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_GUEST_FORM>>;
  saving: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-gray-800 font-medium text-sm">{editingId ? 'Sửa khách mời' : 'Thêm khách mời'}</p>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 px-5 py-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Họ tên</label>
            <input
              value={form.displayName}
              onChange={e => {
                const name = e.target.value;
                setForm(f => ({ ...f, displayName: name, key: editingId ? f.key : slugify(name) }));
              }}
              placeholder="vd: Nguyễn Văn Tèo"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Nhà trai / Nhà gái</label>
            <VenuePicker value={form.venue} onChange={v => setForm(f => ({ ...f, venue: v }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Từ để mời</label>
            <input
              value={form.invitePhrase}
              onChange={e => setForm(f => ({ ...f, invitePhrase: e.target.value }))}
              placeholder="vd: Trân trọng kính mời / Thân mời"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Cách xưng hô
              {form.addressTo && form.selfRef && (
                <span className="ml-2 text-gray-400 font-normal normal-case">→ {form.addressTo} — {form.selfRef}</span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                value={form.addressTo}
                onChange={e => setForm(f => ({ ...f, addressTo: e.target.value }))}
                placeholder="Mời ai (vd: bạn, anh, chị)"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <input
                value={form.selfRef}
                onChange={e => setForm(f => ({ ...f, selfRef: e.target.value }))}
                placeholder="Mình xưng là (vd: bọn mình)"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50">
              {saving ? 'Đang lưu...' : editingId ? 'Lưu' : 'Thêm'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CONFIRM_LABELS: Record<GuestEntry['confirmStatus'], string> = {
  attending: 'Tham dự',
  not_attending: 'Không tham dự',
  pending: 'Chưa xác nhận',
};
const CONFIRM_COLORS: Record<GuestEntry['confirmStatus'], string> = {
  attending: 'bg-green-50 text-green-700',
  not_attending: 'bg-red-50 text-red-600',
  pending: 'bg-gray-100 text-gray-500',
};

function buildEncodedLink(guestKey: string, venue: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const token = encodeGuestParams(guestKey, venue);
  return `${base}/?t=${token}`;
}

function GuestRow({ g, onEdit }: { g: GuestEntry; onEdit: (g: GuestEntry) => void }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(buildEncodedLink(g.key, g.venue));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function toggleSent() {
    const next = g.sentStatus === 'sent' ? 'not_sent' : 'sent';
    await updateDoc(doc(db, 'guests', g.id), { sentStatus: next });
  }

  const token = encodeGuestParams(g.key, g.venue);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 text-sm">
      <td className="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{g.displayName}</td>
      <td className="px-3 py-2.5">
        <VenueBadge venue={g.venue} />
      </td>
      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap text-xs">
        {g.addressTo && g.selfRef ? `${g.addressTo} — ${g.selfRef}` : '—'}
      </td>
      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap text-xs">
        {g.invitePhrase || '—'}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${CONFIRM_COLORS[g.confirmStatus]}`}>
          {CONFIRM_LABELS[g.confirmStatus]}
        </span>
      </td>
      <td className="px-3 py-2.5 text-center text-sm text-gray-700">
        {g.confirmStatus === 'attending' ? g.attendingCount || 1 : '—'}
      </td>
      <td className="px-3 py-2.5">
        <button onClick={toggleSent}
          className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${g.sentStatus === 'sent' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          {g.sentStatus === 'sent' ? '✓ Đã gửi' : 'Chưa gửi'}
        </button>
      </td>
      <td className="px-3 py-2.5">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${g.viewStatus === 'viewed' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
          {g.viewStatus === 'viewed' ? '✓ Đã xem' : 'Chưa xem'}
        </span>
      </td>
      <td className="px-3 py-2.5 max-w-[140px]">
        <p className="text-gray-400 text-[10px] truncate font-mono">?t={token}</p>
      </td>
      <td className="px-3 py-2.5">
        <button onClick={copyLink}
          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${copied ? 'border-green-300 text-green-600 bg-green-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex gap-2">
          <button onClick={() => onEdit(g)} className="text-blue-400 text-xs hover:text-blue-600">Sửa</button>
          <button onClick={() => deleteDoc(doc(db, 'guests', g.id))} className="text-red-400 text-xs hover:text-red-600">Xóa</button>
        </div>
      </td>
    </tr>
  );
}

const EMPTY_GUEST_FORM = {
  key: '', displayName: '', venue: 'nhatrai',
  invitePhrase: 'Trân trọng kính mời', addressTo: '', selfRef: '',
};

function GuestsTab() {
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_GUEST_FORM });
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [filter, setFilter] = useState<VenueFilter>('all');
  const [search, setSearch] = useState('');
  const csvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'guests'), snap =>
      setGuests(snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          key: d.id,
          displayName: data.displayName ?? '',
          venue: data.venue ?? 'nhatrai',
          invitePhrase: data.invitePhrase ?? 'Trân trọng kính mời',
          addressTo: data.addressTo ?? '',
          selfRef: data.selfRef ?? '',
          confirmStatus: data.confirmStatus ?? 'pending',
          attendingCount: data.attendingCount ?? 0,
          sentStatus: data.sentStatus ?? 'not_sent',
          viewStatus: data.viewStatus ?? 'not_viewed',
        } as GuestEntry;
      }))
    );
  }, []);

  const filtered = guests
    .filter(g => filter === 'all' || g.venue === filter)
    .filter(g => !search || g.displayName.toLowerCase().includes(search.toLowerCase()));

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_GUEST_FORM });
    setShowModal(true);
  }

  function startEdit(g: GuestEntry) {
    setEditingId(g.id);
    setForm({ key: g.key, displayName: g.displayName, venue: g.venue, invitePhrase: g.invitePhrase, addressTo: g.addressTo, selfRef: g.selfRef });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...EMPTY_GUEST_FORM });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.displayName.trim()) return;
    const key = (form.key || slugify(form.displayName)).trim().toLowerCase();
    if (!key) return;
    setSaving(true);
    await setDoc(doc(db, 'guests', key), {
      displayName: form.displayName.trim(),
      venue: form.venue,
      invitePhrase: form.invitePhrase,
      addressTo: form.addressTo,
      selfRef: form.selfRef,
      confirmStatus: 'pending',
      attendingCount: 0,
      sentStatus: 'not_sent',
      viewStatus: 'not_viewed',
    }, { merge: true });
    setSaving(false);
    closeModal();
  }

  const [showCsvModal, setShowCsvModal] = useState(false);

  function downloadTemplate() {
    const header = 'displayName,venue,addressTo,selfRef,invitePhrase';
    const rows = [
      'Nguyễn Văn A,nhatrai,bạn,bọn mình,Trân trọng kính mời',
      'Trần Thị B,nhagai,chị,tụi mình,Thân mời',
    ];
    const content = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    const header = 'displayName,venue,addressTo,selfRef,invitePhrase,confirmStatus,attendingCount,sentStatus,viewStatus,link';
    const rows = guests
      .filter(g => filter === 'all' || g.venue === filter)
      .map(g => [
        g.displayName,
        g.venue,
        g.addressTo,
        g.selfRef,
        g.invitePhrase,
        g.confirmStatus,
        g.attendingCount,
        g.sentStatus,
        g.viewStatus,
        buildEncodedLink(g.key, g.venue),
      ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
    const content = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;
      setImporting(true);
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const start = lines[0].toLowerCase().includes('displayname') ? 1 : 0;
      for (const line of lines.slice(start)) {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        const [displayName, venue, addressTo, selfRef, invitePhrase] = parts;
        if (!displayName) continue;
        const key = slugify(displayName);
        if (!key) continue;
        const venueKey = (venue === 'nhagai' || venue === 'Nhà Gái') ? 'nhagai' : 'nhatrai';
        await setDoc(doc(db, 'guests', key), {
          displayName,
          venue: venueKey,
          addressTo: addressTo ?? '',
          selfRef: selfRef ?? '',
          invitePhrase: invitePhrase ?? 'Trân trọng kính mời',
          confirmStatus: 'pending',
          attendingCount: 0,
          sentStatus: 'not_sent',
          viewStatus: 'not_viewed',
        }, { merge: true });
      }
      setImporting(false);
      if (csvRef.current) csvRef.current.value = '';
    };
    reader.readAsText(file, 'utf-8');
  }

  return (
    <div className='font-sf'>
      {/* Modal */}
      {showModal && (
        <GuestModal
          editingId={editingId}
          form={form}
          setForm={setForm}
          saving={saving}
          onSubmit={submit}
          onClose={closeModal}
        />
      )}

      {/* Toolbar: search + add + import */}
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm khách mời..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
        />
        <button
          type="button"
          onClick={openAdd}
          className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs whitespace-nowrap">
          + Thêm
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs whitespace-nowrap">
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => setShowCsvModal(true)}
          disabled={importing}
          className="px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs whitespace-nowrap disabled:opacity-50">
          {importing ? 'Importing...' : 'Import CSV'}
        </button>
        <input ref={csvRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => { handleCsvImport(e); setShowCsvModal(false); }} />
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setShowCsvModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-gray-800 font-medium text-sm">Import danh sách khách mời</p>
              <button type="button" onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Template */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1.5">Template CSV</p>
                <div className="bg-gray-50 rounded-lg p-3 font-mono text-[11px] text-gray-600 leading-relaxed overflow-x-auto whitespace-nowrap">
                  <p className="text-gray-400">displayName,venue,addressTo,selfRef,invitePhrase</p>
                  <p>Nguyễn Văn A,nhatrai,bạn,bọn mình,Trân trọng kính mời</p>
                  <p>Trần Thị B,nhagai,chị,tụi mình,Thân mời</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">venue: <span className="font-mono">nhatrai</span> hoặc <span className="font-mono">nhagai</span></p>
              </div>
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                ↓ Tải template CSV
              </button>

              {/* Google Sheets guide */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1.5">Hướng dẫn chỉnh sửa bằng Google Sheets</p>
                <ol className="text-xs text-gray-600 flex flex-col gap-1 list-decimal list-inside leading-relaxed">
                  <li>Tải template CSV về máy</li>
                  <li>Mở <span className="font-medium">Google Sheets</span> → Tạo bảng tính mới</li>
                  <li>Vào <span className="font-medium">File → Import</span> → Chọn file CSV vừa tải</li>
                  <li>Chọn <span className="font-medium">Comma</span> làm dấu phân cách, nhấn Import</li>
                  <li>Điền danh sách khách mời vào các cột</li>
                  <li>Xuất lại: <span className="font-medium">File → Download → CSV</span></li>
                </ol>
              </div>

              {/* Import button */}
              <button
                type="button"
                onClick={() => csvRef.current?.click()}
                className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm">
                Chọn file CSV đã chỉnh sửa để import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <VenueFilterBar value={filter} onChange={setFilter} />
      {(() => {
        const attending = filtered.filter(g => g.confirmStatus === 'attending');
        const total = attending.reduce((s, g) => s + (g.attendingCount || 1), 0);
        return (
          <p className="text-gray-500 text-sm mb-3">
            {filtered.length} khách mời
            {attending.length > 0 && (
              <span className="ml-2 text-green-700 font-medium">· {attending.length} tham dự · {total} người</span>
            )}
          </p>
        );
      })()}

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-3 py-2.5 text-left font-medium">Họ tên</th>
                <th className="px-3 py-2.5 text-left font-medium">Nhà</th>
                <th className="px-3 py-2.5 text-left font-medium">Xưng hô</th>
                <th className="px-3 py-2.5 text-left font-medium">Từ mời</th>
                <th className="px-3 py-2.5 text-left font-medium">Xác nhận</th>
                <th className="px-3 py-2.5 text-center font-medium">Số người</th>
                <th className="px-3 py-2.5 text-left font-medium">Gửi</th>
                <th className="px-3 py-2.5 text-left font-medium">Xem</th>
                <th className="px-3 py-2.5 text-left font-medium">Link</th>
                <th className="px-3 py-2.5 text-left font-medium">Copy</th>
                <th className="px-3 py-2.5 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => <GuestRow key={g.id} g={g} onEdit={startEdit} />)}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Chưa có khách mời nào.</p>
      )}
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
        <p className="text-gray-700 text-sm font-medium">{editing ? `Sửa: ${editing}` : 'Thêm địa điểm'}</p>
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
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm">Huỷ</button>
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
  const [tab, setTab] = useState<Tab>('Khách mời');

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-gold text-base font-semibold font-sf">Thiệp cưới</h1>
        <button onClick={() => setAuthed(false)} className="text-title text-sm hover:text-gray-600 font-sf">Đăng xuất</button>
      </header>

      <div className="flex border-b border-gray-200 bg-white overflow-x-auto font-sf">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${tab === t ? 'text-gold border-b-2 border-gold font-semibold font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 py-6">
        {tab === 'Khách mời' && <GuestsTab />}
        {tab === 'Lời chúc' && <WishesTab />}
      </div>
    </div>
  );
}
