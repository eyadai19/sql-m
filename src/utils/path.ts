interface PagePath {
	name: string;
	path: string;
}

const basic: PagePath[] = [
	{ name: "dataType", path: "../basic/dataType" },
	{ name: "reference", path: "../basic/reference" },
	{ name: "ERD", path: "../basic/ERD" },
];

const DDL: PagePath[] = [
	{ name: "table", path: "../DDL/table" },
	{ name: "schema", path: "../DDL/schema" },
	{ name: "alter", path: "../DDL/alter" },
	{ name: "drop", path: "../DDL/drop" },
];

const DML: PagePath[] = [
	{ name: "delete", path: "../DML/delete" },
	{ name: "insert", path: "../DML/insert" },
	{ name: "update", path: "../DML/update" },
	{ name: "select", path: "../DML/select" },
];

const select: PagePath[] = [
	{ name: "aggregateFunction", path: "../select/aggregateFunction" },
	{ name: "between", path: "../select/between" },
	{ name: "distinct", path: "../select/distinct" },
	{ name: "GroupBy", path: "../select/GroupBy" },
	{ name: "Like", path: "../select/Like" },
	{ name: "operator", path: "../select/operator" },
	{ name: "subQuery", path: "../select/subQuery" },
	{ name: "where", path: "../select/where" },
];

const joins: PagePath[] = [
	{ name: "innerJoin", path: "../joins/innerJoin" },
	{ name: "join", path: "../joins/join" },
	{ name: "leftJoin", path: "../joins/leftJoin" },
	{ name: "outerJoin", path: "../joins/outerJoin" },
	{ name: "rightJoin", path: "../joins/rightJoin" },
	{ name: "selfJoin", path: "../joins/selfJoin" },
];

interface GroupPath {
	name: string;
	data: PagePath[];
}
export const allPath: GroupPath[] = [
	{ name: "basic", data: basic },
	{ name: "DDL", data: DDL },
	{ name: "DML", data: DML },
	{ name: "select", data: select },
	{ name: "joins", data: joins },
];

