'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// === Data Model (base template) ===
const DEFAULT_DATA = [
  {
    id: 'sec-edu',
    title: '1. เอกสารคุณวุฒิการศึกษา (Education Qualifications)',
    description:
      'สำเนาปริญญาบัตร/ประกาศนียบัตร + ใบรับรองการสำเร็จการศึกษา + Transcript ของคุณวุฒิที่ขอเทียบ และของคุณวุฒิก่อนหน้า',
    items: [
      { id: '1_1', label: 'สำเนาปริญญาบัตร/ประกาศนียบัตร + ใบรับรองการสำเร็จการศึกษา', req: 'required' },
      { id: '1_2', label: 'สำเนาใบบันทึกผลการศึกษา (Transcript)', req: 'required' },
      { id: '1_3', label: 'สำเนาปริญญาบัตร/ประกาศนียบัตร ของคุณวุฒิก่อนหน้า', req: 'optional' },
      { id: '1_4', label: 'สำเนา Transcript ของคุณวุฒิก่อนหน้า', req: 'optional' },
      { id: '1_note', label: 'ฉบับแปลอังกฤษพร้อมตรารับรอง (ทุกฉบับ)', req: 'required' },
    ],
  },
  {
    id: 'sec-phd',
    title: 'เพิ่มเติมสำหรับระดับปริญญาเอก (PhD extras)',
    description: 'สำเนาวิทยานิพนธ์ (ชื่อเรื่อง + บทคัดย่อ) และหลักฐานการตีพิมพ์/เงื่อนไข',
    items: [
      { id: 'phd_1', label: 'สำเนาวิทยานิพนธ์: หน้าแสดงชื่อเรื่อง + บทคัดย่อ', req: 'optional' },
      { id: 'phd_2', label: 'สำเนาผลงานตีพิมพ์ หรือเอกสารเงื่อนไขการสำเร็จการศึกษา', req: 'optional' },
    ],
  },
  {
    id: 'sec-passport',
    title: '2. หนังสือเดินทาง (Passport)',
    description: 'หน้าหลัก, หน้า Visa ประเทศที่ไปศึกษา, Visa ไทย (กรณีไม่ได้ถือสัญชาติไทย), ตราประทับเข้า–ออก',
    items: [
      { id: '2_1', label: 'สำเนาหน้าแรกของหนังสือเดินทาง', req: 'required' },
      { id: '2_2', label: 'สำเนาหน้า Visa ของประเทศที่ไปศึกษา', req: 'required' },
      { id: '2_3', label: 'สำเนาหน้า Visa ไทย (กรณีไม่ได้ถือสัญชาติไทย)', req: 'optional' },
      { id: '2_4', label: 'สำหนาหน้าที่มีตราประทับเข้า–ออก ตลอดช่วงเรียน', req: 'required' },
      { id: '2_covid', label: 'กรณีเรียนทางไกล (COVID-19): แนบประกาศ/เอกสารจากสถาบัน', req: 'optional' },
    ],
  },
  {
    id: 'sec-thaiid',
    title: '3. บัตรประจำตัวประชาชน (เฉพาะสัญชาติไทย)',
    description: 'สำเนาบัตรประชาชน',
    items: [
      { id: '3_1', label: 'สำเนาบัตรประชาชน', req: 'optional' },
    ],
  },
  {
    id: 'sec-house',
    title: '4. ทะเบียนบ้าน (เฉพาะสัญชาติไทย)',
    description: 'สำเนาทะเบียนบ้าน',
    items: [
      { id: '4_1', label: 'สำเนาทะเบียนบ้าน', req: 'optional' },
    ],
  },
  {
    id: 'sec-name',
    title: '5. หนังสือสำคัญการเปลี่ยนชื่อ (ถ้ามี)',
    description: 'สำเนาหนังสือเปลี่ยนชื่อ/สกุล',
    items: [
      { id: '5_1', label: 'สำเนาหนังสือสำคัญการเปลี่ยนชื่อ/สกุล', req: 'optional' },
    ],
  },
  {
    id: 'sec-auth',
    title: '6. หนังสือมอบอำนาจ (กรณีมอบหมายให้ผู้อื่น)',
    description: 'หนังสือมอบอำนาจติดอากรแสตมป์ 10 บาท + สำเนาบัตรของผู้รับมอบ',
    items: [
      { id: '6_1', label: 'หนังสือมอบอำนาจ (ติดอากรแสตมป์ 10 บาท)', req: 'optional' },
      { id: '6_2', label: 'สำเนาบัตรประชาชนของผู้รับมอบ', req: 'optional' },
    ],
  },
  {
    id: 'sec-guidance',
    title: 'ข้อควรปฏิบัติ (Guidance)',
    description:
      'คำร้อง 1 ชุด ต่อ 1 คุณวุฒิ; สำเนาทุกฉบับลงนามรับรองด้วยหมึกสด; หากถูกขอเอกสารเพิ่ม ให้ยื่นภายใน 15 วันทำการ',
    items: [
      { id: 'g_1', label: 'ตรวจว่าใช้ชุดคำร้อง 1 ชุดต่อ 1 คุณวุฒิ', req: 'optional' },
      { id: 'g_2', label: 'สำเนาทุกฉบับลงนามรับรองด้วยหมึกสด', req: 'optional' },
      { id: 'g_3', label: 'จัดเตรียมส่งเอกสารเพิ่มภายใน 15 วันทำการ หากถูกขอ', req: 'optional' },
    ],
  },
];

// === Helpers ===
const cls = (...t) => t.filter(Boolean).join(' ');
const casesKey = 'doc-cases-v1';
const activeKey = 'doc-activeCase-v1';
const legacyKeys = { sections: 'doc-checklist-v2', profile: 'doc-profile-v1', applicant: 'doc-applicant-v1' };

const makeSections = () => DEFAULT_DATA.map(sec => ({
  ...sec,
  open: true,
  items: sec.items.map(it => ({ ...it, status: 'todo', file: '', note: '', custom: false }))
}));

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const deepClone = (obj) => { try { return structuredClone(obj); } catch { return JSON.parse(JSON.stringify(obj)); } };

function makeCase(label = 'ผู้ยื่น 1', applicant = {}, profile = {}) {
  return {
    id: uid(),
    label,
    applicant: {
      fullName: applicant.fullName || '',
      degree: applicant.degree || '',
      institution: applicant.institution || '',
      country: applicant.country || '',
    },
    profile: {
      nationality: profile.nationality === 'Non-Thai' ? 'Non-Thai' : 'Thai',
      phd: !!profile.phd,
    },
    sections: makeSections(),
  };
}

// === Init (migrate v2 → v3 format if found) ===
const INITIAL_CASES = (() => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(casesKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    try {
      const oldSec = JSON.parse(localStorage.getItem(legacyKeys.sections) || 'null');
      const oldProf = JSON.parse(localStorage.getItem(legacyKeys.profile) || 'null');
      const oldApp = JSON.parse(localStorage.getItem(legacyKeys.applicant) || 'null');
      if (oldSec && Array.isArray(oldSec)) {
        return [{
          id: uid(),
          label: (oldApp && oldApp.fullName) || 'ผู้ยื่น 1',
          applicant: {
            fullName: (oldApp && oldApp.fullName) || '',
            degree: (oldApp && oldApp.degree) || '',
            institution: (oldApp && oldApp.institution) || '',
            country: (oldApp && oldApp.country) || '',
          },
          profile: {
            nationality: oldProf && oldProf.nationality === 'Non-Thai' ? 'Non-Thai' : 'Thai',
            phd: !!(oldProf && oldProf.phd),
          },
          sections: oldSec.map(sec => ({
            ...sec,
            open: typeof sec.open === 'boolean' ? sec.open : true,
            items: (sec.items || []).map(i => ({
              id: i.id,
              label: i.label,
              req: i.req === 'required' ? 'required' : 'optional',
              status: i.status === 'done' ? 'done' : 'todo',
              file: i.file || '',
              note: i.note || '',
              custom: !!i.custom,
            }))
          }))
        }];
      }
    } catch {}
  }
  return [makeCase('ผู้ยื่น 1')];
})();

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch { return initialValue; }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

function isSectionApplicable(sectionId, profile) {
  if (sectionId === 'sec-phd') return !!profile.phd;
  if (sectionId === 'sec-thaiid' || sectionId === 'sec-house') return profile.nationality === 'Thai';
  return true;
}
function isItemApplicable(sectionId, itemId, profile) {
  if (sectionId === 'sec-passport' && itemId === '2_3') return profile.nationality === 'Non-Thai';
  return true;
}

// =====================
// Main App Component
// =====================
export default function ChecklistApp() {
  const [cases, setCases] = useLocalStorageState(casesKey, INITIAL_CASES);
  const [activeId, setActiveId] = useLocalStorageState(activeKey, INITIAL_CASES[0]?.id || '');

  const current = useMemo(() => cases.find(c => c.id === activeId) || cases[0], [cases, activeId]);

  const flatApplicableItems = useMemo(() => {
    if (!current) return [];
    return current.sections.flatMap(s =>
      isSectionApplicable(s.id, current.profile)
        ? s.items.filter(i => isItemApplicable(s.id, i.id, current.profile))
        : []
    );
  }, [current]);
  const total = flatApplicableItems.length;
  const done = flatApplicableItems.filter(i => i.status === 'done').length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  // Search/filter
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const filteredSections = useMemo(() => {
    if (!current) return [];
    const q = query.trim().toLowerCase();
    return current.sections
      .filter(s => isSectionApplicable(s.id, current.profile))
      .map(s => ({
        ...s,
        items: s.items.filter(i => {
          if (!isItemApplicable(s.id, i.id, current.profile)) return false;
          const byFilter = filter === 'all' ||
            (filter === 'required' && i.req === 'required') ||
            (filter === 'optional' && i.req === 'optional') ||
            (filter === 'done' && i.status === 'done') ||
            (filter === 'todo' && i.status === 'todo');
          const bySearch = !q || i.label.toLowerCase().includes(q);
          return byFilter && bySearch;
        })
      }));
  }, [current, query, filter]);

  function updateCurrent(mutator) {
    setCases(prev => prev.map(c => (c.id === current.id ? mutator(c) : c)));
  }

  // Item ops
  const toggleItem = (sectionId, itemId) => updateCurrent(c => ({
    ...c,
    sections: c.sections.map(s => s.id !== sectionId ? s : ({
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, status: i.status === 'done' ? 'todo' : 'done' } : i)
    }))
  }));
  const updateItem = (sectionId, itemId, patch) => updateCurrent(c => ({
    ...c,
    sections: c.sections.map(s => s.id !== sectionId ? s : ({
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, ...patch } : i)
    }))
  }));
  const removeItem = (sectionId, itemId) => {
    if (!confirm('ลบรายการนี้หรือไม่?')) return;
    updateCurrent(c => ({
      ...c,
      sections: c.sections.map(s => s.id !== sectionId ? s : ({ ...s, items: s.items.filter(i => i.id !== itemId) }))
    }));
  };
  const addItem = (sectionId, label, req) => {
    if (!label?.trim()) return;
    const newId = `custom_${Date.now()}`;
    updateCurrent(c => ({
      ...c,
      sections: c.sections.map(s => s.id !== sectionId ? s : ({
        ...s,
        items: [...s.items, { id: newId, label: label.trim(), req: req === 'required' ? 'required' : 'optional', status: 'todo', file: '', note: '', custom: true }]
      }))
    }));
  };

  // Case ops
  const renameCase = (caseId, newLabel) => setCases(prev => prev.map(c => (c.id === caseId ? { ...c, label: newLabel || c.label } : c)));
  const duplicateCase = (caseId) => {
    const base = cases.find(c => c.id === caseId);
    if (!base) return;
    const copy = deepClone(base); copy.id = uid();
    copy.label = (base.label || base.applicant?.fullName || 'ผู้ยื่น') + ' (สำเนา)';
    setCases(prev => [...prev, copy]);
    setActiveId(copy.id);
  };
  const removeCase = (caseId, labelHint = '') => {
    setCases(prev => {
      if (prev.length <= 1) { alert('ต้องมีอย่างน้อย 1 รายชื่อ — หากต้องการเริ่มใหม่ ใช้ปุ่ม “รีเซ็ต (รายชื่อนี้)”'); return prev; }
      if (!confirm(`ลบรายชื่อ “${labelHint || 'ผู้ยื่น'}” หรือไม่?`)) return prev;
      const idx = prev.findIndex(c => c.id === caseId);
      const nextCases = prev.filter(c => c.id !== caseId);
      if (activeId === caseId) {
        const targetIdx = Math.max(0, idx - 1);
        const nextActive = nextCases[targetIdx]?.id || nextCases[0]?.id;
        if (nextActive) setActiveId(nextActive);
      }
      return nextCases;
    });
  };

  const setAllOpen = (open) => updateCurrent(c => ({ ...c, sections: c.sections.map(s => ({ ...s, open })) }));
  const resetCurrentCase = () => { if (confirm('รีเซ็ตสถานะทั้งหมดของรายชื่อนี้และโหลดรายการมาตรฐาน?')) updateCurrent(c => ({ ...c, sections: makeSections() })); };

  const handleExport = () => {
    const exportPayload = { version: 3, cases, activeId };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `document-checklist-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const handleImportFromFile = (file) => {
    if (!file) return; const reader = new FileReader();
    reader.onload = () => { try {
      const data = JSON.parse(reader.result);
      if (data && Array.isArray(data.cases)) { if (!data.cases.length) throw new Error('empty'); setCases(data.cases); setActiveId(data.activeId || data.cases[0].id); alert('นำเข้าเรียบร้อย (หลายรายชื่อ)'); return; }
      if (data && Array.isArray(data.sections)) { const one = makeCase(data.applicant?.fullName || 'ผู้ยื่น 1', data.applicant || {}, data.profile || {}); one.sections = data.sections.map(sec => ({ ...sec, open: typeof sec.open === 'boolean' ? sec.open : true, items: (sec.items||[]).map(i => ({ id: i.id, label: i.label, req: i.req === 'required' ? 'required' : 'optional', status: i.status === 'done' ? 'done' : 'todo', file: i.file || '', note: i.note || '', custom: !!i.custom })) })); setCases([one]); setActiveId(one.id); alert('นำเข้าเรียบร้อย (ไฟล์เดิม v2)'); return; }
      throw new Error('unsupported');
    } catch { alert('ไม่สามารถนำเข้าไฟล์นี้ได้'); } };
    reader.readAsText(file);
  };
  const printPage = () => window.print();

  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('searchbox')?.focus(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); showSavedToast(); }
    };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, []);
  const showSavedToast = () => {
    const btn = document.getElementById('save-toast'); btn?.classList.remove('opacity-0'); setTimeout(() => btn?.classList.add('opacity-0'), 1000);
  };

  if (!current) return null;
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-24">
        <CaseSwitcher
          cases={cases}
          activeId={current.id}
          onSwitch={setActiveId}
          onAdd={() => setAddOpen(true)}
          onRename={renameCase}
          onDuplicate={duplicateCase}
          onDelete={(id, label) => removeCase(id, label)}
        />
        <ApplicantCard
          applicant={current.applicant}
          setApplicant={(patch) => updateCurrent(c => ({ ...c, applicant: { ...c.applicant, ...patch } }))}
          profile={current.profile}
          setProfile={(patch) => updateCurrent(c => ({ ...c, profile: { ...c.profile, ...patch } }))}
          onSave={showSavedToast}
          onDelete={() => removeCase(current.id, labelOf(current))}
        />
        <StatBar done={done} total={total} progress={progress} />
        <ControlsBar
          query={query} setQuery={setQuery}
          filter={filter} setFilter={setFilter}
          onExpandAll={() => setAllOpen(true)} onCollapseAll={() => setAllOpen(false)}
          onExport={handleExport} onImport={() => setImportOpen(true)} onPrint={printPage} onReset={resetCurrentCase}
        />
        <SectionList
          sections={filteredSections}
          onToggleOpen={(id) => updateCurrent(c => ({ ...c, sections: c.sections.map(s => s.id === id ? { ...s, open: !s.open } : s) }))}
          onToggleItem={toggleItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
          onAddItem={addItem}
        />
      </main>

      {importOpen && (<ImportModal onClose={() => setImportOpen(false)} onPickFile={() => fileInputRef.current?.click()} />)}
      {addOpen && (<AddApplicantModal onClose={() => setAddOpen(false)} onCreate={(payload) => {
        const label = payload.fullName?.trim() || `ผู้ยื่น ${cases.length + 1}`;
        const newCase = makeCase(label, payload, { nationality: payload.nationality, phd: payload.phd });
        setCases([...cases, newCase]); setActiveId(newCase.id); setAddOpen(false); showSavedToast();
      }} />)}

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => handleImportFromFile(e.target.files?.[0])} />

      <div id="save-toast" aria-live="polite" className="fixed bottom-4 right-4 rounded-xl bg-neutral-900/90 px-3 py-2 text-sm text-white shadow-xl transition-opacity duration-300 opacity-0">บันทึกแล้ว ✓</div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">รายการเอกสารเทียบคุณวุฒิ – Checklist</h1>
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <kbd className="rounded border px-1.5 py-0.5 bg-neutral-50 text-neutral-700">Ctrl/⌘K</kbd>
          <span className="text-neutral-500">ค้นหา</span>
          <span className="hidden md:inline text-neutral-300">|</span>
          <kbd className="hidden md:inline rounded border px-1.5 py-0.5 bg-neutral-50 text-neutral-700">Ctrl/⌘S</kbd>
          <span className="hidden md:inline text-neutral-500">บันทึก</span>
        </div>
      </div>
    </header>
  );
}

function CaseSwitcher({ cases, activeId, onSwitch, onAdd, onRename, onDuplicate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const onlyOne = cases.length <= 1;
  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-3 md:p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-700 mr-2">รายชื่อผู้ยื่น:</span>
          <div className="flex flex-1 overflow-x-auto gap-2 py-1">
            {cases.map((c, idx) => {
              const active = c.id === activeId;
              const label = labelOf(c) || `ผู้ยื่น ${idx + 1}`;
              const isEditing = editingId === c.id;
              return (
                <div key={c.id} className={cls('group inline-flex items-center gap-1 rounded-full border px-2 py-1', active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-neutral-800 border-neutral-300')}
                  onDoubleClick={() => { setEditingId(c.id); setDraft(label); }}
                >
                  {isEditing ? (
                    <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => { setEditingId(null); if (draft.trim()) onRename(c.id, draft.trim()); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingId(null); }}
                      className={cls('rounded-full px-2 py-0.5 text-sm', active ? 'text-neutral-900' : 'text-neutral-800')} />
                  ) : (
                    <button className={cls('whitespace-nowrap px-1 text-sm', active ? 'text-white' : 'text-neutral-800 hover:text-neutral-900')} onClick={() => onSwitch(c.id)} title={label}>{label}</button>
                  )}
                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <IconButton title="เปลี่ยนชื่อ" onClick={() => { setEditingId(c.id); setDraft(label); }} variant={active ? 'ghost-white' : 'ghost'}>{PencilIcon()}</IconButton>
                      <IconButton title="ทำสำเนา" onClick={() => onDuplicate(c.id)} variant={active ? 'ghost-white' : 'ghost'}>{CopyIcon()}</IconButton>
                      <IconButton title={onlyOne ? 'เหลือได้อย่างน้อย 1 รายชื่อ' : `ลบ “${label}”`} onClick={() => !onlyOne && onDelete(c.id, label)} variant={active ? 'ghost-white' : 'ghost'} disabled={onlyOne}>{TrashIcon()}</IconButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="btn" onClick={onAdd}>เพิ่มรายชื่อ</button>
        </div>
        <p className="mt-1 text-xs text-neutral-500">ทิป: ดับเบิลคลิกที่แท็บเพื่อแก้ชื่อ • ถ้าเหลือรายชื่อเดียว ให้ใช้ “รีเซ็ต (รายชื่อนี้)”</p>
      </div>
    </section>
  );
}

function IconButton({ children, onClick, title, variant = 'ghost', disabled = false }) {
  const base = 'inline-flex items-center justify-center rounded-full p-1 text-xs transition-colors';
  const theme = variant === 'ghost-white' ? 'hover:bg-white/20 text-white' : 'hover:bg-neutral-100 text-neutral-600';
  return (
    <button className={cls(base, theme, disabled && 'opacity-40 cursor-not-allowed')} onClick={onClick} title={title} aria-disabled={disabled}>
      {children}
    </button>
  );
}
function PencilIcon() { return (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M13.5 2.5l4 4L7 17H3v-4l10.5-10.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>); }
function CopyIcon() { return (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><rect x="7" y="3" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>); }
function TrashIcon() { return (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M3 6h14M8 6v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0l1 11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }

function labelOf(c) { return c.label || c.applicant?.fullName || ''; }

function ApplicantCard({ applicant, setApplicant, profile, setProfile, onSave, onDelete }) {
  return (
    <section className="mt-4 mb-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField label="ชื่อ-นามสกุล (Full name)" value={applicant.fullName} onChange={(v) => setApplicant({ fullName: v })} placeholder="เช่น Pop Mee" />
            <TextField label="คุณวุฒิ (Degree)" value={applicant.degree} onChange={(v) => setApplicant({ degree: v })} placeholder="เช่น M.Eng., B.Sc., Ph.D." />
            <TextField label="สถาบัน (Institution)" value={applicant.institution} onChange={(v) => setApplicant({ institution: v })} placeholder="ชื่อมหาวิทยาลัย/สถาบัน" />
            <TextField label="ประเทศ (Country)" value={applicant.country} onChange={(v) => setApplicant({ country: v })} placeholder="ประเทศที่ศึกษา" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:items-end">
            <div className="grid gap-2">
              <span className="text-sm font-medium">โปรไฟล์ผู้ยื่น (Applicant Profile)</span>
              <div className="flex flex-wrap gap-2">
                <SegmentedButton active={profile.nationality === 'Thai' && !profile.phd} onClick={() => setProfile({ nationality: 'Thai', phd: false })}>Thai</SegmentedButton>
                <SegmentedButton active={profile.nationality === 'Non-Thai' && !profile.phd} onClick={() => setProfile({ nationality: 'Non-Thai', phd: false })}>Non-Thai</SegmentedButton>
                <SegmentedButton active={!!profile.phd} onClick={() => setProfile({ phd: true })}>PhD</SegmentedButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <fieldset className="flex items-center gap-3">
                  <legend className="sr-only">สัญชาติ</legend>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="nationality" checked={profile.nationality === 'Thai'} onChange={() => setProfile({ nationality: 'Thai' })} /> Thai</label>
                  <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="nationality" checked={profile.nationality === 'Non-Thai'} onChange={() => setProfile({ nationality: 'Non-Thai' })} /> Non-Thai</label>
                </fieldset>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.phd} onChange={(e) => setProfile({ phd: e.target.checked })} /> มีเอกสารสำหรับ PhD (แสดงหมวด PhD)</label>
              </div>
            </div>
            <div className="no-print flex gap-2 md:justify-end">
              <button className="btn" onClick={onSave} title="บันทึกข้อมูลผู้ยื่นและโปรไฟล์ (autosave ทำงานอยู่แล้ว)">บันทึกข้อมูล</button>
              <button className="btn-danger" onClick={onDelete} title="ลบรายชื่อนี้">ลบรายชื่อนี้</button>
            </div>
          </div>
          <p className="text-xs text-neutral-500">* ระบบบันทึกอัตโนมัติลงอุปกรณ์ของคุณ (localStorage) และมีปุ่มบันทึกเพื่อยืนยันอีกครั้ง</p>
        </div>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="text-neutral-700">{label}</span>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </label>
  );
}

function SegmentedButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={cls('rounded-full px-3 py-1 text-sm border', active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50')}>{children}</button>
  );
}

function StatBar({ done, total, progress }) {
  return (
    <section className="mb-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm text-neutral-600">ความคืบหน้า (Progress)</p>
            <h2 className="text-2xl font-bold">{progress}%</h2>
            <p className="text-xs text-neutral-500">ทำแล้ว {done} จาก {total} รายการ</p>
          </div>
          <div className="w-full md:w-2/3" aria-hidden>
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlsBar({ query, setQuery, filter, setFilter, onExpandAll, onCollapseAll, onExport, onImport, onPrint, onReset }) {
  return (
    <div className="no-print mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <label htmlFor="searchbox" className="sr-only">ค้นหารายการ</label>
        <input id="searchbox" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาเอกสาร เช่น transcript, visa ..."
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="ค้นหารายการ" />
      </div>
      <div className="flex flex-wrap gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="ตัวกรองรายการ">
          <option value="all">ทั้งหมด</option>
          <option value="required">เฉพาะที่จำเป็น</option>
          <option value="optional">เฉพาะที่ขึ้นกับเงื่อนไข</option>
          <option value="todo">ยังไม่ทำ</option>
          <option value="done">ทำแล้ว</option>
        </select>
        <button onClick={onExpandAll} className="btn-secondary">ขยายทั้งหมด</button>
        <button onClick={onCollapseAll} className="btn-secondary">ยุบทั้งหมด</button>
        <button onClick={onExport} className="btn">Export JSON</button>
        <button onClick={onImport} className="btn">Import JSON</button>
        <button onClick={onPrint} className="btn-secondary">พิมพ์</button>
        <button onClick={onReset} className="btn-danger">รีเซ็ต (รายชื่อนี้)</button>
      </div>
    </div>
  );
}

function SectionList({ sections, onToggleOpen, onToggleItem, onUpdateItem, onRemoveItem, onAddItem }) {
  return (
    <div className="grid gap-4 md:gap-5">
      {sections.map(section => (
        <SectionCard key={section.id} section={section} onToggleOpen={() => onToggleOpen(section.id)} onToggleItem={onToggleItem} onUpdateItem={onUpdateItem} onRemoveItem={onRemoveItem} onAddItem={onAddItem} />
      ))}
    </div>
  );
}

function SectionCard({ section, onToggleOpen, onToggleItem, onUpdateItem, onRemoveItem, onAddItem }) {
  const total = section.items.length;
  const done = section.items.filter(i => i.status === 'done').length;
  const [draftLabel, setDraftLabel] = useState('');
  const [draftReq, setDraftReq] = useState('optional');
  return (
    <section className="card rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-neutral-50 rounded-t-2xl" onClick={onToggleOpen} aria-expanded={section.open} aria-controls={`${section.id}-panel`}>
        <div className="mt-1"><ChevronIcon open={section.open} /></div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">{done}/{total}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{section.description}</p>
        </div>
      </button>
      {section.open && (
        <div id={`${section.id}-panel`} className="px-5 pb-5">
          {section.items.length === 0 ? <p className="text-sm text-neutral-500">ไม่มีรายการตามตัวกรอง</p> : (
            <ul className="mt-2 grid gap-2">
              {section.items.map(item => (
                <ChecklistItem key={item.id} sectionId={section.id} item={item} onToggle={() => onToggleItem(section.id, item.id)} onChange={(patch) => onUpdateItem(section.id, item.id, patch)} onRemove={() => onRemoveItem(section.id, item.id)} />
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-neutral-300 p-3">
            <span className="text-sm font-medium text-neutral-800">เพิ่มรายการใหม่ในหมวดนี้</span>
            <div className="flex flex-col gap-2 md:flex-row">
              <input type="text" value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} placeholder="กรอกชื่อรายการเอกสาร…" className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <select value={draftReq} onChange={(e) => setDraftReq(e.target.value)} className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="required">จำเป็น</option>
                <option value="optional">ขึ้นกับเงื่อนไข</option>
              </select>
              <button className="btn" onClick={() => { onAddItem(section.id, draftLabel, draftReq); setDraftLabel(''); setDraftReq('optional'); }}>เพิ่มรายการ</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ChecklistItem({ sectionId, item, onToggle, onChange, onRemove }) {
  const itemId = `${sectionId}-${item.id}`;
  return (
    <li className={cls('rounded-xl border p-3 md:p-4', item.status === 'done' ? 'border-emerald-300 bg-emerald-50' : 'border-neutral-200 bg-white')}>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
        <div className="flex items-start gap-3 md:w-1/2">
          <input id={itemId} type="checkbox" checked={item.status === 'done'} onChange={onToggle} className="mt-1 h-5 w-5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500" aria-describedby={`${itemId}-desc`} />
          <label htmlFor={itemId} className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cls('font-medium', item.status === 'done' && 'line-through')}>{item.label}</span>
              <span className={cls('rounded-full px-2 py-0.5 text-[11px]', item.req === 'required' ? 'bg-rose-100 text-rose-800' : 'bg-neutral-100 text-neutral-700')}>{item.req === 'required' ? 'จำเป็น' : 'ขึ้นกับเงื่อนไข'}</span>
              {item.custom && (<span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[11px]">custom</span>)}
            </div>
            <p id={`${itemId}-desc`} className="sr-only">{item.req === 'required' ? 'จำเป็น' : 'ขึ้นกับเงื่อนไข'}</p>
          </label>
        </div>
        <div className="md:w-1/2 grid gap-2">
          <div className="flex gap-2">
            <input type="text" value={item.file} onChange={(e) => onChange({ file: e.target.value })} placeholder="ชื่อไฟล์/ลิงก์เอกสาร (เช่น transcript_en.pdf หรือ Google Drive URL)" className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="ชื่อไฟล์หรือที่อยู่ลิงก์" />
            <button onClick={() => navigator.clipboard?.writeText(item.file || '').then(() => {})} className="btn-secondary" title="คัดลอกชื่อไฟล์/ลิงก์">คัดลอก</button>
            <button onClick={onRemove} className="btn-danger" title="ลบรายการนี้">ลบ</button>
          </div>
          <textarea value={item.note} onChange={(e) => onChange({ note: e.target.value })} placeholder="บันทึกโน้ต เช่น แปลอังกฤษเรียบร้อย ตรารับรองครบ" className="min-h-[42px] w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="บันทึกโน้ต" />
        </div>
      </div>
    </li>
  );
}

function ImportModal({ onClose, onPickFile }) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-lg font-semibold">นำเข้าสถานะจากไฟล์ JSON</h4>
        <p className="mt-1 text-sm text-neutral-600">รองรับรูปแบบหลายรายชื่อ (v3) หรือไฟล์เดิมรายชื่อเดียว (v2)</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onPickFile} className="btn">เลือกไฟล์</button>
          <button onClick={onClose} className="btn-secondary">ยกเลิก</button>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-neutral-700">ตัวอย่างไฟล์ v3</summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-neutral-50 p-3 text-xs text-neutral-700">{`{
  "version": 3,
  "activeId": "abc123",
  "cases": [
    { "id": "abc123", "label": "Pop Mee", "applicant": {"fullName": "Pop Mee", "degree": "M.Eng.", "institution": "...", "country": "Thailand"}, "profile": {"nationality": "Thai", "phd": false}, "sections": [ /* ... */ ] }
  ]
}`}</pre>
        </details>
      </div>
    </div>
  );
}

function AddApplicantModal({ onClose, onCreate }) {
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [nationality, setNationality] = useState('Thai');
  const [phd, setPhd] = useState(false);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-lg font-semibold">เพิ่มรายชื่อใหม่</h4>
        <p className="mt-1 text-sm text-neutral-600">สร้างแบบฟอร์มใหม่สำหรับรายชื่อนี้</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField label="ชื่อ-นามสกุล" value={fullName} onChange={setFullName} placeholder="เช่น Pop Mee" />
          <TextField label="คุณวุฒิ" value={degree} onChange={setDegree} placeholder="เช่น M.Eng." />
          <TextField label="สถาบัน" value={institution} onChange={setInstitution} placeholder="ชื่อมหาวิทยาลัย/สถาบัน" />
          <TextField label="ประเทศ" value={country} onChange={setCountry} placeholder="ประเทศที่ศึกษา" />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <fieldset className="flex items-center gap-3">
            <legend className="sr-only">สัญชาติ</legend>
            <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="nat" checked={nationality === 'Thai'} onChange={() => setNationality('Thai')} /> Thai</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="nat" checked={nationality === 'Non-Thai'} onChange={() => setNationality('Non-Thai')} /> Non-Thai</label>
          </fieldset>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={phd} onChange={(e) => setPhd(e.target.checked)} /> PhD</label>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button className="btn-secondary" onClick={onClose}>ยกเลิก</button>
          <button className="btn" onClick={() => onCreate({ fullName, degree, institution, country, nationality, phd })}>สร้างแบบฟอร์ม</button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls('transition-transform', open ? 'rotate-90' : 'rotate-0')} aria-hidden>
      <path d="M7 5l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
