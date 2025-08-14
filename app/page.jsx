$1'../components/ChecklistApp';

export default function Page() {
  return <ChecklistApp />;
}
`;

$1
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// ---- Client-only for Next.js (this file will be a Client Component) ----
export const __NEXT_CLIENT__ = true;

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