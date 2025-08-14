'use client';

import React from 'react';

const cls = (...t) => t.filter(Boolean).join(' ');

export default function ChecklistItem({ sectionId, item, onToggle, onChange, onRemove }) {
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

