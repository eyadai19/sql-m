// src/utils/dummyData.ts

// Define the interface for a single employee row
export interface EmployeeRow {
    id: number; // Employee ID
    name: string; // Employee name
    position: string; // Job position
    department: string; // Department
    salary: number; // Salary
    date_hired: string; // Date hired in ISO 8601 string format
  }
  
  // Define the interface for the entire table
  export interface EmployeesTable {
    columns: Array<keyof EmployeeRow>; // Column headers based on EmployeeRow keys
    rows: EmployeeRow[]; // Array of employee rows
  }
  
  // Define the dummy employees table
  export const DUMMY_EMPLOYEES_TABLE: EmployeesTable = {
    columns: ["id", "name", "position", "department", "salary", "date_hired"],
    rows: [
      { id: 1, name: "John Doe", position: "Software Engineer", department: "Engineering", salary: 60000, date_hired: "2018-05-21" },
      { id: 2, name: "Jane Smith", position: "Data Scientist", department: "Data Analytics", salary: 75000, date_hired: "2019-03-15" },
      { id: 3, name: "Bob Johnson", position: "Product Manager", department: "Product", salary: 55000, date_hired: "2020-07-12" },
      { id: 4, name: "Alice Brown", position: "HR Specialist", department: "Human Resources", salary: 50000, date_hired: "2017-02-10" },
      { id: 5, name: "Charlie Green", position: "Marketing Coordinator", department: "Marketing", salary: 48000, date_hired: "2021-01-05" },
      { id: 6, name: "Diana White", position: "Sales Manager", department: "Sales", salary: 67000, date_hired: "2016-11-23" },
      { id: 7, name: "Edward Black", position: "Financial Analyst", department: "Finance", salary: 72000, date_hired: "2015-04-30" },
      { id: 8, name: "Fiona Blue", position: "UX Designer", department: "Design", salary: 64000, date_hired: "2019-08-19" },
      { id: 9, name: "George Grey", position: "DevOps Engineer", department: "Engineering", salary: 80000, date_hired: "2018-09-10" },
      { id: 10, name: "Hannah Gold", position: "Research Scientist", department: "Data Analytics", salary: 68000, date_hired: "2020-12-17" },
      { id: 11, name: "Ian Silver", position: "Technical Writer", department: "Engineering", salary: 50000, date_hired: "2017-06-01" },
      { id: 12, name: "Jessica Rose", position: "Content Strategist", department: "Marketing", salary: 45000, date_hired: "2021-04-13" },
      { id: 13, name: "Kevin Tan", position: "Business Analyst", department: "Product", salary: 62000, date_hired: "2018-11-06" },
      { id: 14, name: "Laura Violet", position: "Customer Success Manager", department: "Sales", salary: 56000, date_hired: "2019-02-25" },
      { id: 15, name: "Michael Orange", position: "Accountant", department: "Finance", salary: 73000, date_hired: "2016-10-19" },
      { id: 16, name: "Natalie Amber", position: "Graphic Designer", department: "Design", salary: 52000, date_hired: "2017-03-08" },
      { id: 17, name: "Oscar White", position: "Operations Manager", department: "Operations", salary: 67000, date_hired: "2015-12-12" },
      { id: 18, name: "Patricia Crimson", position: "Logistics Specialist", department: "Operations", salary: 59000, date_hired: "2020-09-29" },
      { id: 19, name: "Quentin Maroon", position: "Software Tester", department: "Engineering", salary: 51000, date_hired: "2018-06-20" },
      { id: 20, name: "Rachel Lime", position: "HR Assistant", department: "Human Resources", salary: 47000, date_hired: "2021-07-14" },
    ],
  };
  
  export default DUMMY_EMPLOYEES_TABLE;
  