'use client'
import DragDropExercise from '@/components/Exercise/DragDropExercise/DragDropExercise'
import MultipleChoiceExercise from '@/components/Exercise/MultipleChoiceExercise/MultipleChoiceExercise'
import TrueFalseExercise from '@/components/Exercise/TrueFalseExercise'
import React from 'react'

export default function page() {
  return (
    <div>
      
      <DragDropExercise
  title="Order the Steps of Database Normalization"
  prompt="Arrange the following steps in the correct order of database normalization."
  items={[
    { id: "3nf", content: "Third Normal Form: Remove transitive dependencies" },
    { id: "1nf", content: "First Normal Form: Atomic values" },
    { id: "2nf", content: "Second Normal Form: Remove partial dependencies" }
  ]}
  correctOrder={["1nf", "2nf", "3nf"]}
  difficulty="Medium"
  hints={["Think about dependencies", "Consider the order of complexity"]}
  onComplete={(data) => console.log(data)}
/>


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
