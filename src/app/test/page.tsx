'use client';

import Exercise from '@/components/Exercise';

export default function Page() {
  return (
    <main className="container mx-auto p-4">
    {/* Basic SELECT Exercise */}
    <Exercise
      title="Employee Information"
      prompt="Write a query to retrieve all employees who earn more than $60,000 and work in the Engineering department (department_id = 1)."
      tables={['employees', 'departments']}
      difficulty="easy"
      answer="SELECT e.name, e.position, e.salary 
FROM employees e 
WHERE e.salary > 60000 
AND e.department_id = 1;"
    />

    {/* UPDATE Exercise */}
    <Exercise
      title="Salary Update"
      prompt="Write a query to give a 10% salary increase to all employees in the Marketing department (department_id = 5)."
      tables={['employees']}
      difficulty="medium"
      answer="UPDATE employees 
SET salary = salary * 1.1 
WHERE department_id = 5;"
    />

    {/* INSERT Exercise */}
    <Exercise
      title="New Employee"
      prompt="Write a query to add a new employee: John Smith, Software Engineer, department_id 1, salary 65000, hired today."
      tables={['employees']}
      difficulty="medium"
      answer="INSERT INTO employees (name, position, department_id, salary, date_hired) 
VALUES ('John Smith', 'Software Engineer', 1, 65000, CURRENT_DATE);"
    />

    {/* JOIN with DELETE Exercise */}
    <Exercise
      title="Remove Low-Budget Departments"
      prompt="Write a query to delete all employees who work in departments with a budget less than $300,000."
      tables={['employees', 'departments']}
      difficulty="hard"
      tips="You'll need to use a subquery or JOIN to solve this."
      answer="DELETE FROM employees 
WHERE department_id IN (
SELECT id 
FROM departments 
WHERE budget < 300000
);"
    />

    {/* Complex JOIN Exercise */}
    <Exercise
      title="Department Statistics"
      prompt="Write a query to show each department's name, manager, average salary, and number of employees."
      tables={['employees', 'departments']}
      difficulty="hard"
      answer="SELECT 
d.name as department_name,
d.manager,
AVG(e.salary) as avg_salary,
COUNT(e.id) as employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name, d.manager
ORDER BY d.name;"
    />
  </main>
  );
  };

 
