interface PagePath {
	name: string;
	path: string;
}

const basic: PagePath[] = [
	{ name: "Data Types", path: "../basic/dataType" },
	{ name: "References", path: "../basic/reference" },
	{ name: "Entity Relationship Diagram", path: "../basic/ERD" },
];

const DDL: PagePath[] = [
	{ name: "Create Table", path: "../DDL/table" },
	{ name: "Schema Definition", path: "../DDL/schema" },
	{ name: "Alter Table", path: "../DDL/alter" },
	{ name: "Drop Table", path: "../DDL/drop" },
];

const DML: PagePath[] = [
	{ name: "Delete Records", path: "../DML/delete" },
	{ name: "Insert Records", path: "../DML/insert" },
	{ name: "Update Records", path: "../DML/update" },
	{ name: "Select Query", path: "../DML/select" },
];

const select: PagePath[] = [
	{ name: "Aggregate Functions", path: "../select/aggregateFunction" },
	{ name: "Between Operator", path: "../select/between" },
	{ name: "Distinct Clause", path: "../select/distinct" },
	{ name: "Group By Clause", path: "../select/GroupBy" },
	{ name: "Like Operator", path: "../select/Like" },
	{ name: "Logical Operators", path: "../select/operator" },
	{ name: "Subqueries", path: "../select/subQuery" },
	{ name: "Where Clause", path: "../select/where" },
];

const joins: PagePath[] = [
	{ name: "Inner Join", path: "../joins/innerJoin" },
	{ name: "General Join", path: "../joins/join" },
	{ name: "Left Join", path: "../joins/leftJoin" },
	{ name: "Outer Join", path: "../joins/outerJoin" },
	{ name: "Right Join", path: "../joins/rightJoin" },
	{ name: "Self Join", path: "../joins/selfJoin" },
];

interface GroupPath {
	name: string;
	data: PagePath[];
}

export const allPath: GroupPath[] = [
	{ name: "Basic Concepts", data: basic },
	{ name: "Data Definition Language (DDL)", data: DDL },
	{ name: "Data Manipulation Language (DML)", data: DML },
	{ name: "Select Queries", data: select },
	{ name: "Join Operations", data: joins },
];

export const pageName = {
	dataType: "dataType",
	reference: "reference",
	ERD: "ERD",
	table: "table",
	schema: "schema",
	alter: "alter",
	drop: "drop",
	delete: "delete",
	insert: "insert",
	update: "update",
	select: "select",
	aggregateFunction: "aggregateFunction",
	between: "between",
	distinct: "distinct",
	GroupBy: "GroupBy",
	Like: "Like",
	operator: "operator",
	subQuery: "subQuery",
	where: "where",
	innerJoin: "innerJoin",
	join: "join",
	leftJoin: "leftJoin",
	outerJoin: "outerJoin",
	rightJoin: "rightJoin",
	selfJoin: "selfJoin",
	basic: "basic",
	DDL: "DDL",
	DML: "DML",
	// select: "select",
	joins: "joins",
};
