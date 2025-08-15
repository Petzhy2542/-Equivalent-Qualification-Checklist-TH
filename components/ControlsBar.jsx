'use client';

import React from 'react';

export default function ControlsBar({ query, setQuery, filter, setFilter, onExpandAll, onCollapseAll, onExport, onImport, onPrint, onReset }) {
  return (
    <div className="no-print mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <label htmlFor="searchbox" className="sr-only">ค้นหารายการ</label>
        <input
          id="searchbox"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเอกสาร เช่น transcript, visa ..."
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="ค้นหารายการ"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="ตัวกรองรายการ"
        >
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

