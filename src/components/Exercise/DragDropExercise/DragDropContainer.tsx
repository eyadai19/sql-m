'use client';

import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useState } from 'react';
import { DraggableItem } from './DraggableItem';
import type { DragDropContainerProps, DragDropItem } from './types';

export function DragDropContainer({ items, onReorder }: DragDropContainerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      onReorder(newOrder.map(item => item.id));
    }

    setActiveId(null);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 my-2">
          {items.map((item) => (
            <DraggableItem key={item.id} {...item} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <DraggableItem {...items.find(item => item.id === activeId)!} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}