import { useEffect } from 'react';

export default function useFocusTrap(ref, onClose) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusables = node.querySelectorAll(focusableSelectors.join(','));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const previouslyFocused = document.activeElement;
    if (first) first.focus();

    function handleKeyDown(e) {
      if (e.key === 'Tab') {
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (onClose) onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused) previouslyFocused.focus();
    };
  }, [ref, onClose]);
}
