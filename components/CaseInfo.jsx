'use client';

import React from 'react';

const cls = (...t) => t.filter(Boolean).join(' ');

function TextField({ label, value, onChange, placeholder }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="grid gap-1 text-sm">
      <span className="text-neutral-700">{label}</span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}

function SegmentedButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        'rounded-full px-3 py-1 text-sm border',
        active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50'
      )}
    >
      {children}
    </button>
  );
}

export default function CaseInfo({ applicant, setApplicant, profile, setProfile, onSave, onDelete }) {
  return (
    <section className="mt-4 mb-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField
              label="ชื่อ-นามสกุล (Full name)"
              value={applicant.fullName}
              onChange={(v) => setApplicant({ fullName: v })}
              placeholder="เช่น Pop Mee"
            />
            <TextField
              label="คุณวุฒิ (Degree)"
              value={applicant.degree}
              onChange={(v) => setApplicant({ degree: v })}
              placeholder="เช่น M.Eng., B.Sc., Ph.D."
            />
            <TextField
              label="สถาบัน (Institution)"
              value={applicant.institution}
              onChange={(v) => setApplicant({ institution: v })}
              placeholder="ชื่อมหาวิทยาลัย/สถาบัน"
            />
            <TextField
              label="ประเทศ (Country)"
              value={applicant.country}
              onChange={(v) => setApplicant({ country: v })}
              placeholder="ประเทศที่ศึกษา"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:items-end">
            <div className="grid gap-2">
              <span className="text-sm font-medium">โปรไฟล์ผู้ยื่น (Applicant Profile)</span>
              <div className="flex flex-wrap gap-2">
                <SegmentedButton
                  active={profile.nationality === 'Thai' && !profile.phd}
                  onClick={() => setProfile({ nationality: 'Thai', phd: false })}
                >
                  Thai
                </SegmentedButton>
                <SegmentedButton
                  active={profile.nationality === 'Non-Thai' && !profile.phd}
                  onClick={() => setProfile({ nationality: 'Non-Thai', phd: false })}
                >
                  Non-Thai
                </SegmentedButton>
                <SegmentedButton active={!!profile.phd} onClick={() => setProfile({ phd: true })}>
                  PhD
                </SegmentedButton>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <fieldset className="flex items-center gap-3">
                  <legend className="sr-only">สัญชาติ</legend>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="nationality"
                      checked={profile.nationality === 'Thai'}
                      onChange={() => setProfile({ nationality: 'Thai' })}
                    />
                    Thai
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="nationality"
                      checked={profile.nationality === 'Non-Thai'}
                      onChange={() => setProfile({ nationality: 'Non-Thai' })}
                    />
                    Non-Thai
                  </label>
                </fieldset>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!profile.phd}
                    onChange={(e) => setProfile({ phd: e.target.checked })}
                  />
                  มีเอกสารสำหรับ PhD (แสดงหมวด PhD)
                </label>
              </div>
            </div>
            <div className="no-print flex gap-2 md:justify-end">
              <button
                className="btn"
                onClick={onSave}
                title="บันทึกข้อมูลผู้ยื่นและโปรไฟล์ (autosave ทำงานอยู่แล้ว)"
              >
                บันทึกข้อมูล
              </button>
              <button className="btn-danger" onClick={onDelete} title="ลบรายชื่อนี้">
                ลบรายชื่อนี้
              </button>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            * ระบบบันทึกอัตโนมัติลงอุปกรณ์ของคุณ (localStorage) และมีปุ่มบันทึกเพื่อยืนยันอีกครั้ง
          </p>
        </div>
      </div>
    </section>
  );
}

