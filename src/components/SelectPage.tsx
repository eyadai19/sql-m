'use client'

import React from 'react'
import Exercise from './Exercise'
import Explanation from './Explanation';
import { userExcerciseAnswerError } from '@/lib/types/userSchema';
import PAGE_DATA from '@/utils/pagesData';
export default function SelectPage() {
  const { explanationParams } = PAGE_DATA.select;

  return (
    <div>


		<Explanation {...explanationParams} />

    <Exercise
        title="Employee Information"
        prompt="Write a query to retrieve all employees who earn more than $60,000 and work in the Engineering department (department_id = 1)."
        tables={['employees', 'departments']}
        difficulty="easy"
        answer="SELECT e.name, e.position, e.salary 
FROM employees e 
WHERE e.salary > 60000 
AND e.department_id = 1;"
      seed="seed1"
      />



    </div>
  )
    };
  
  

