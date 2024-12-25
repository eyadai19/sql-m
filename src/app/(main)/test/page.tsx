'use client'
import DragDropExercise from '@/components/Exercise/DragDropExercise/DragDropExercise'
import MultipleChoiceExercise from '@/components/Exercise/MultipleChoiceExercise/MultipleChoiceExercise'
import TrueFalseExercise from '@/components/Exercise/TrueFalseExercise/TrueFalseExercise'
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

   const erdTrueFalseParams = {
    title: "Understanding Entity-Relationship Diagrams",
    prompt: "Evaluate these statements about Entity-Relationship Diagrams (ERDs). Mark each statement as True or False.",
    difficulty: "Medium" as const,
    questions: [
      {
        id: "erd-1",
        statement: "In an ERD, a many-to-many relationship can be directly implemented in a relational database without a junction table.",
        isCorrect: false,
        explanation: "False. Many-to-many relationships require a junction (bridge) table to be properly implemented in a relational database. This table contains foreign keys from both entities."
      },
      {
        id: "erd-2",
        statement: "Weak entities in an ERD must have a identifying relationship with a strong entity to be meaningful.",
        isCorrect: true,
        explanation: "True. Weak entities depend on strong entities for their identification and cannot exist independently. They must have an identifying relationship with at least one strong entity."
      },
      {
        id: "erd-3",
        statement: "Composite attributes in an ERD can be broken down into multiple simple attributes.",
        isCorrect: true,
        explanation: "True. Composite attributes are made up of multiple simple attributes. For example, 'address' can be broken down into street, city, state, and zip code."
      },
      {
        id: "erd-4",
        statement: "Derived attributes must be physically stored in the database table.",
        isCorrect: false,
        explanation: "False. Derived attributes are calculated from other attributes and don't need to be stored physically. For example, age can be derived from date of birth."
      },
      {
        id: "erd-5",
        statement: "A single entity in an ERD can participate in multiple relationships simultaneously.",
        isCorrect: true,
        explanation: "True. An entity can have relationships with multiple other entities. For example, a Student entity might relate to Course, Department, and Dormitory entities."
      }
    ],
    hints: [
      "Think about how relationships are implemented in actual database tables",
      "Consider the dependencies between different types of entities",
      "Remember the different types of attributes and their characteristics"
    ],
    tips: [
      "Visualize how the concepts would be implemented in a real database",
      "Focus on the practical implications of each statement",
      "Consider both logical design and physical implementation"
    ],
    onComplete: (data: { time: number; trials: number }) => {
      console.log('Exercise completed:', data);
    }
  };

  return (
    <div>
      
      <DragDropExercise {...exerciseParams} />



<TrueFalseExercise
  {...erdTrueFalseParams}
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
