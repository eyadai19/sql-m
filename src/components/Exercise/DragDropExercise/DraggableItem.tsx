"use client";

import { Draggable } from "@hello-pangea/dnd";

interface DraggableItemProps {
  id: string;
  content: string;
  index: number;
}

export default function DraggableItem({ id, content, index }: DraggableItemProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move touch-none"
          style={{
            ...provided.draggableProps.style,
            transform: provided.draggableProps.style?.transform,
          }}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
}