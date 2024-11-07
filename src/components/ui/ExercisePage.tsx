'use client'

import React from 'react'
import Exercise from '../Exercise'

export default function ExercisePage() {
  return (
    <div>
        <Exercise
  title="SQL Exercise: Select Query"
  prompt="Write a SQL query to retrieve all employees from the employees table with a salary greater than $50,000. Make sure to include the columns: id, name, and salary."
  tips="Tip: Use SELECT * FROM employees WHERE salary > 50000 to complete this exercise."
  initialColumns={['id', 'name', 'salary']}
  initialRows={[
    [1, 'John Doe', 60000],
    [2, 'Jane Smith', 75000],
    [3, 'Bob Johnson', 55000]
  ]}
  onRunQuery={(query) => {
    // Mocked example of query validation logic
    if (query.toLowerCase().includes('select') && query.toLowerCase().includes('where')) {
      return {
        columns: ['id', 'name', 'salary'],
        rows: [
          [1, 'John Doe', 60000],
          [2, 'Jane Smith', 75000],
          [3, 'Bob Johnson', 55000]
        ]
      }
    } else {
      return 'Error: Invalid SQL query. Please use a SELECT statement with a WHERE clause.'
    }
  }}
/>
    </div>
  )
}
