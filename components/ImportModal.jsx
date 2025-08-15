'use client';

import React, { useRef, useId } from 'react';
import useFocusTrap from './useFocusTrap';

export default function ImportModal({ onClose, onPickFile }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  useFocusTrap(dialogRef, onClose);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div ref={dialogRef} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
        <h4 id={titleId} className="text-lg font-semibold">นำเข้าสถานะจากไฟล์ JSON</h4>
        <p id={descId} className="mt-1 text-sm text-neutral-600">รองรับรูปแบบหลายรายชื่อ (v3) หรือไฟล์เดิมรายชื่อเดียว (v2)</p>
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

