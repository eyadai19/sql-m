"use client";

import { Droppable } from "@hello-pangea/dnd";
import DraggableItem from "./DraggableItem";
import { DragDropItem } from "@/lib/types/exerciseTypes";

interface DroppableListProps {
  items: DragDropItem[];
}

export default function DroppableList({ items }: DroppableListProps) {
  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2"
        >
          {items.map((item, index) => (
            <DraggableItem
              key={item.id}
              id={item.id}
              content={item.content}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}