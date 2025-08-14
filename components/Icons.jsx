const cls = (...t) => t.filter(Boolean).join(' ');

export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M13.5 2.5l4 4L7 17H3v-4l10.5-10.5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="7" y="3" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 6h14M8 6v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0l1 11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cls('transition-transform', open ? 'rotate-90' : 'rotate-0')}
      aria-hidden
    >
      <path d="M7 5l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

