'use client';

import React from 'react';

export default function StatBar({ done, total, progress }) {
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

