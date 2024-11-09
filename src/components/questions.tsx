const sqlQuestions = [
    {
      question: "What's the query to bring all students with GPA more than 3?",
      answer: "SELECT * FROM students WHERE gpa > 3;"
    },
    {
      question: "How do you select all columns from a 'courses' table?",
      answer: "SELECT * FROM courses;"
    },
    {
      question: "What's the query to find all employees with a salary greater than 50000?",
      answer: "SELECT * FROM employees WHERE salary > 50000;"
    },
    {
      question: "How do you retrieve unique job titles from an 'employees' table?",
      answer: "SELECT DISTINCT job_title FROM employees;"
    },
    {
      question: "What's the query to get the total number of students in a 'students' table?",
      answer: "SELECT COUNT(*) FROM students;"
    },
    {
      question: "How do you find the average GPA of students in the 'students' table?",
      answer: "SELECT AVG(gpa) FROM students;"
    },
    {
      question: "What's the query to sort 'products' by price in descending order?",
      answer: "SELECT * FROM products ORDER BY price DESC;"
    },
    {
      question: "How do you find the maximum salary in the 'employees' table?",
      answer: "SELECT MAX(salary) FROM employees;"
    },
    {
      question: "What's the query to find students whose names start with 'A'?",
      answer: "SELECT * FROM students WHERE name LIKE 'A%';"
    },
    
 
    {
      question: "What's the query to get the sum of all sales in the 'sales' table?",
      answer: "SELECT SUM(amount) FROM sales;"
    }
  ];
  
  export default sqlQuestions;
  