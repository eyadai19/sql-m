'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragDropItem } from './types';
import { GripVertical } from 'lucide-react';

export function DraggableItem({ id, content }: DragDropItem) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg  bg-white/20 border-sailorBlue/100 p-4 shadow-sm transition-colors text-sm `}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground"
        aria-label="Drag handle"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">{content}</div>
    </div>
  );
}