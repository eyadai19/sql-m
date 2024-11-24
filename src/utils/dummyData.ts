export interface EmployeeRow {
	id: number;
	name: string;
	position: string;
	department_id: number;
	salary: number;
	date_hired: string;
	status: string;
	last_working_day?: string;
}

export interface EmployeesTable {
	columns: Array<keyof EmployeeRow>;
	rows: EmployeeRow[];
}

export const DUMMY_EMPLOYEES_TABLE: EmployeesTable = {
	columns: [
		"id",
		"name",
		"position",
		"department_id",
		"salary",
		"date_hired",
		"status",
		"last_working_day",
	],
	rows: [
		{
			id: 1,
			name: "John Doe",
			position: "Software Engineer",
			department_id: 1,
			salary: 60000,
			date_hired: "2018-05-21",
			status: "active",
		},
		{
			id: 2,
			name: "Jane Smith",
			position: "Data Scientist",
			department_id: 2,
			salary: 75000,
			date_hired: "2019-03-15",
			status: "resigned",
			last_working_day: "2023-06-30",
		},
		{
			id: 3,
			name: "Bob Johnson",
			position: "Product Manager",
			department_id: 3,
			salary: 55000,
			date_hired: "2020-07-12",
			status: "active",
		},
		{
			id: 4,
			name: "Alice Brown",
			position: "HR Specialist",
			department_id: 4,
			salary: 50000,
			date_hired: "2017-02-10",
			status: "resigned",
			last_working_day: "2021-12-15",
		},
		{
			id: 5,
			name: "Charlie Green",
			position: "Marketing Coordinator",
			department_id: 5,
			salary: 48000,
			date_hired: "2021-01-05",
			status: "active",
		},
		{
			id: 6,
			name: "Diana White",
			position: "Sales Manager",
			department_id: 6,
			salary: 67000,
			date_hired: "2016-11-23",
			status: "resigned",
			last_working_day: "2023-04-01",
		},
		{
			id: 7,
			name: "Edward Black",
			position: "Financial Analyst",
			department_id: 7,
			salary: 72000,
			date_hired: "2015-04-30",
			status: "active",
		},
		{
			id: 8,
			name: "Fiona Blue",
			position: "UX Designer",
			department_id: 8,
			salary: 64000,
			date_hired: "2019-08-19",
			status: "active",
		},
		{
			id: 9,
			name: "George Grey",
			position: "DevOps Engineer",
			department_id: 1,
			salary: 80000,
			date_hired: "2018-09-10",
			status: "resigned",
			last_working_day: "2022-10-01",
		},
		{
			id: 10,
			name: "Hannah Gold",
			position: "Research Scientist",
			department_id: 2,
			salary: 68000,
			date_hired: "2020-12-17",
			status: "active",
		},
	],
};
//2
export interface DepartmentRow {
	id: number;
	name: string;
	manager: string;
	budget: number;
	location: string;
}
export interface DepartmentsTable {
	columns: Array<keyof DepartmentRow>;
	rows: DepartmentRow[];
}
export const DUMMY_DEPARTMENTS_TABLE: DepartmentsTable = {
	columns: ["id", "name", "manager", "budget", "location"],
	rows: [
		{
			id: 1,
			name: "Engineering",
			manager: "John Doe",
			budget: 1000000,
			location: "Building A",
		},
		{
			id: 2,
			name: "Data Analytics",
			manager: "Jane Smith",
			budget: 800000,
			location: "Building B",
		},
		{
			id: 3,
			name: "Product",
			manager: "Bob Johnson",
			budget: 500000,
			location: "Building C",
		},
		{
			id: 4,
			name: "Human Resources",
			manager: "Alice Brown",
			budget: 200000,
			location: "Building D",
		},
		{
			id: 5,
			name: "Marketing",
			manager: "Charlie Green",
			budget: 400000,
			location: "Building E",
		},
		{
			id: 6,
			name: "Sales",
			manager: "Diana White",
			budget: 600000,
			location: "Building F",
		},
		{
			id: 7,
			name: "Finance",
			manager: "Edward Black",
			budget: 700000,
			location: "Building G",
		},
		{
			id: 8,
			name: "Design",
			manager: "Fiona Blue",
			budget: 300000,
			location: "Building H",
		},
		{
			id: 9,
			name: "Operations",
			manager: "Oscar White",
			budget: 500000,
			location: "Building I",
		},
	],
};
