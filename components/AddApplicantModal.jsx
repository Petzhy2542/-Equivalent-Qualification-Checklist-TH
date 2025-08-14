'use client';

import React, { useState } from 'react';

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}

export default function AddApplicantModal({ onClose, onCreate }) {
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [nationality, setNationality] = useState('Thai');
  const [phd, setPhd] = useState(false);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onClick={e => e.stopPropagation()}>
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
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={phd} onChange={e => setPhd(e.target.checked)} /> PhD</label>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button className="btn-secondary" onClick={onClose}>ยกเลิก</button>
          <button className="btn" onClick={() => onCreate({ fullName, degree, institution, country, nationality, phd })}>สร้างแบบฟอร์ม</button>
        </div>
      </div>
    </div>
  );
}

