'use client';

import React from 'react';
import ChecklistSection from './ChecklistSection';

export default function SectionList({ sections, onToggleOpen, onToggleItem, onUpdateItem, onRemoveItem, onAddItem }) {
  return (
    <div className="grid gap-4 md:gap-5">
      {sections.map((section) => (
        <ChecklistSection
          key={section.id}
          section={section}
          onToggleOpen={() => onToggleOpen(section.id)}
          onToggleItem={onToggleItem}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          onAddItem={onAddItem}
        />
      ))}
    </div>
  );
}

