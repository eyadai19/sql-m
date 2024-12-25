'use client'
import DragDropExercise from '@/components/Exercise/DragDropExercise/DragDropExercise'
import MultipleChoiceExercise from '@/components/Exercise/MultipleChoiceExercise/MultipleChoiceExercise'
import TrueFalseExercise from '@/components/Exercise/TrueFalseExercise'
import React from 'react'

export default function page() {
  const exerciseParams = {
    title: "Creating an ERD Diagram",
    prompt: "Arrange the following steps in the correct order to create an Entity-Relationship Diagram (ERD).",
    items: [
      { 
        id: '1', 
        content: 'Identify entities (e.g., Customer, Order, Product) that represent main objects in the system' 
      },
      { 
        id: '2', 
        content: 'Define relationships between entities (e.g., Customer places Order, Order contains Product)' 
      },
      { 
        id: '3', 
        content: 'Determine attributes for each entity (e.g., Customer: name, email, address)' 
      },
      { 
        id: '4', 
        content: 'Specify cardinality for relationships (e.g., one-to-many, many-to-many)' 
      },
      { 
        id: '5', 
        content: 'Add primary and foreign keys to establish entity connections' 
      }
    ],
    mode: 'simple' as const,
    correctOrder: ['1', '3', '2', '4', '5'],
    difficulty: 'Medium' as const,
    hints: [
      "Think about what information you need before establishing connections",
      "Consider which steps depend on having other information first",
      "Remember that keys are used to implement relationships"
    ],
    tips: [
      "Start with the basic building blocks before adding details",
      "Attributes help define what data each entity will store",
      "Relationships and cardinality work together to show how entities interact"
    ],
    onComplete: (data: { time: number; trials: number }) => {
      console.log('Exercise completed:', data);
    }
  };

  return (
    <div>
      
      <DragDropExercise {...exerciseParams} />



<TrueFalseExercise
  title="Database Relationships"
  prompt="Evaluate these statements about database relationships."
  questions={[
    {
      id: "q1",
      statement: "A foreign key can reference multiple primary keys simultaneously.",
      isCorrect: false,
      explanation: "A foreign key can only reference one primary key at a time."
    }
  ]}
  difficulty="Easy"
  onComplete={(data) => console.log(data)}
/>

<MultipleChoiceExercise
  title="ERD Relationships"
  prompt="Choose the correct relationship type for each scenario."
  questions={[
    {
      id: "q1",
      question: "What type of relationship is shown in this ERD?",
      imageUrl: "/images/erd-example.png",
      choices: [
        { id: "c1", text: "One-to-One" },
        { id: "c2", text: "One-to-Many" },
        { id: "c3", text: "Many-to-Many" }
      ],
      correctChoiceId: "c2",
      explanation: "This is a one-to-many relationship as shown by the crow's foot notation."
    }
  ]}
  difficulty="Medium"
  onComplete={(data) => console.log(data)}
/>


    </div>
  )
}
