// src/utils/dummyData.ts

// Define the interface for a single employee row with department ID
export interface EmployeeRow {
  id: number; // Employee ID
  name: string; // Employee name
  position: string; // Job position
  department_id: number; // Department ID
  salary: number; // Salary
  date_hired: string; // Date hired in ISO 8601 string format
}

// Define the interface for the entire employee table
export interface EmployeesTable {
  columns: Array<keyof EmployeeRow>; // Column headers based on EmployeeRow keys
  rows: EmployeeRow[]; // Array of employee rows
}

// Define the dummy employees table with department IDs
export const DUMMY_EMPLOYEES_TABLE: EmployeesTable = {
  columns: ["id", "name", "position", "department_id", "salary", "date_hired"],
  rows: [
      { id: 1, name: "John Doe", position: "Software Engineer", department_id: 1, salary: 60000, date_hired: "2018-05-21" },
      { id: 2, name: "Jane Smith", position: "Data Scientist", department_id: 2, salary: 75000, date_hired: "2019-03-15" },
      { id: 3, name: "Bob Johnson", position: "Product Manager", department_id: 3, salary: 55000, date_hired: "2020-07-12" },
      { id: 4, name: "Alice Brown", position: "HR Specialist", department_id: 4, salary: 50000, date_hired: "2017-02-10" },
      { id: 5, name: "Charlie Green", position: "Marketing Coordinator", department_id: 5, salary: 48000, date_hired: "2021-01-05" },
      { id: 6, name: "Diana White", position: "Sales Manager", department_id: 6, salary: 67000, date_hired: "2016-11-23" },
      { id: 7, name: "Edward Black", position: "Financial Analyst", department_id: 7, salary: 72000, date_hired: "2015-04-30" },
      { id: 8, name: "Fiona Blue", position: "UX Designer", department_id: 8, salary: 64000, date_hired: "2019-08-19" },
      { id: 9, name: "George Grey", position: "DevOps Engineer", department_id: 1, salary: 80000, date_hired: "2018-09-10" },
      { id: 10, name: "Hannah Gold", position: "Research Scientist", department_id: 2, salary: 68000, date_hired: "2020-12-17" },
      { id: 11, name: "Ian Silver", position: "Technical Writer", department_id: 1, salary: 50000, date_hired: "2017-06-01" },
      { id: 12, name: "Jessica Rose", position: "Content Strategist", department_id: 5, salary: 45000, date_hired: "2021-04-13" },
      { id: 13, name: "Kevin Tan", position: "Business Analyst", department_id: 3, salary: 62000, date_hired: "2018-11-06" },
      { id: 14, name: "Laura Violet", position: "Customer Success Manager", department_id: 6, salary: 56000, date_hired: "2019-02-25" },
      { id: 15, name: "Michael Orange", position: "Accountant", department_id: 7, salary: 73000, date_hired: "2016-10-19" },
      { id: 16, name: "Natalie Amber", position: "Graphic Designer", department_id: 8, salary: 52000, date_hired: "2017-03-08" },
      { id: 17, name: "Oscar White", position: "Operations Manager", department_id: 9, salary: 67000, date_hired: "2015-12-12" },
      { id: 18, name: "Patricia Crimson", position: "Logistics Specialist", department_id: 9, salary: 59000, date_hired: "2020-09-29" },
      { id: 19, name: "Quentin Maroon", position: "Software Tester", department_id: 1, salary: 51000, date_hired: "2018-06-20" },
      { id: 20, name: "Rachel Lime", position: "HR Assistant", department_id: 4, salary: 47000, date_hired: "2021-07-14" },
  ],
};



// src/utils/dummyData.ts

// Define the interface for a single department row
export interface DepartmentRow {
  id: number; // Department ID
  name: string; // Department name
  manager: string; // Department manager
  budget: number; // Department budget
  location: string; // Department location
}

// Define the interface for the entire department table
export interface DepartmentsTable {
  columns: Array<keyof DepartmentRow>; // Column headers based on DepartmentRow keys
  rows: DepartmentRow[]; // Array of department rows
}

// Define the dummy departments table
export const DUMMY_DEPARTMENTS_TABLE: DepartmentsTable = {
  columns: ["id", "name", "manager", "budget", "location"],
  rows: [
      { id: 1, name: "Engineering", manager: "John Doe", budget: 1000000, location: "Building A" },
      { id: 2, name: "Data Analytics", manager: "Jane Smith", budget: 800000, location: "Building B" },
      { id: 3, name: "Product", manager: "Bob Johnson", budget: 500000, location: "Building C" },
      { id: 4, name: "Human Resources", manager: "Alice Brown", budget: 200000, location: "Building D" },
      { id: 5, name: "Marketing", manager: "Charlie Green", budget: 400000, location: "Building E" },
      { id: 6, name: "Sales", manager: "Diana White", budget: 600000, location: "Building F" },
      { id: 7, name: "Finance", manager: "Edward Black", budget: 700000, location: "Building G" },
      { id: 8, name: "Design", manager: "Fiona Blue", budget: 300000, location: "Building H" },
      { id: 9, name: "Operations", manager: "Oscar White", budget: 500000, location: "Building I" },
  ],
};
