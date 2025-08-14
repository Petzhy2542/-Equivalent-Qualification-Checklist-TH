'use client';

import React from 'react';

export default function ImportModal({ onClose, onPickFile }) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
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

