'use client';

import React, { useState } from 'react';
import ChecklistItem from './ChecklistItem';
import { ChevronIcon } from './Icons';

export default function ChecklistSection({ section, onToggleOpen, onToggleItem, onUpdateItem, onRemoveItem, onAddItem }) {
  const total = section.items.length;
  const done = section.items.filter(i => i.status === 'done').length;
  const [draftLabel, setDraftLabel] = useState('');
  const [draftReq, setDraftReq] = useState('optional');
  return (
    <section className="card rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-neutral-50 rounded-t-2xl"
        onClick={onToggleOpen}
        aria-expanded={section.open}
        aria-controls={`${section.id}-panel`}
      >
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
          {section.items.length === 0 ? (
            <p className="text-sm text-neutral-500">ไม่มีรายการตามตัวกรอง</p>
          ) : (
            <ul className="mt-2 grid gap-2">
              {section.items.map(item => (
                <ChecklistItem
                  key={item.id}
                  sectionId={section.id}
                  item={item}
                  onToggle={() => onToggleItem(section.id, item.id)}
                  onChange={patch => onUpdateItem(section.id, item.id, patch)}
                  onRemove={() => onRemoveItem(section.id, item.id)}
                />
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-neutral-300 p-3">
            <span className="text-sm font-medium text-neutral-800">เพิ่มรายการใหม่ในหมวดนี้</span>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={draftLabel}
                onChange={e => setDraftLabel(e.target.value)}
                placeholder="กรอกชื่อรายการเอกสาร…"
                className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={draftReq}
                onChange={e => setDraftReq(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="required">จำเป็น</option>
                <option value="optional">ขึ้นกับเงื่อนไข</option>
              </select>
              <button
                className="btn"
                onClick={() => { onAddItem(section.id, draftLabel, draftReq); setDraftLabel(''); setDraftReq('optional'); }}
              >
                เพิ่มรายการ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

