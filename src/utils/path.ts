interface PageBath {
	name: string;
	path: string;
}

const basic: PageBath[] = [
	{ name: "dataType", path: "@app/basic/dataType" },
	{ name: "reference", path: "../app/basic/reference" },
	{ name: "ERD", path: "../app/basic/ERD" },
];

const DDL: PageBath[] = [
	{ name: "table", path: "../app/DDL/table" },
	{ name: "schema", path: "../app/DDL/schema" },
	{ name: "alter", path: "../app/DDL/alter" },
	{ name: "drop", path: "../app/DDL/drop" },
];

const DML: PageBath[] = [
	{ name: "delete", path: "../app/DML/delete" },
	{ name: "insert", path: "../app/DML/insert" },
	{ name: "update", path: "../app/DML/update" },
	{ name: "select", path: "../app/DML/select" },
];

const select: PageBath[] = [
	{ name: "aggregateFunction", path: "../app/select/aggregateFunction" },
	{ name: "between", path: "../app/select/between" },
	{ name: "distinct", path: "../app/select/distinct" },
	{ name: "GroupBy", path: "../app/select/GroupBy" },
	{ name: "Like", path: "../app/select/Like" },
	{ name: "operator", path: "../app/select/operator" },
	{ name: "subQuery", path: "../app/select/subQuery" },
	{ name: "where", path: "../app/select/where" },
];

const joins: PageBath[] = [
	{ name: "innerJoin", path: "../app/joins/innerJoin" },
	{ name: "join", path: "../app/joins/join" },
	{ name: "leftJoin", path: "../app/joins/leftJoin" },
	{ name: "outerJoin", path: "../app/joins/outerJoin" },
	{ name: "rightJoin", path: "../app/joins/rightJoin" },
	{ name: "selfJoin", path: "../app/joins/selfJoin" },
];

interface GroupPath {
	name: string;
	data: PageBath[];
}
export const allPath: GroupPath[] = [
	{ name: "basic", data: basic },
	{ name: "DDL", data: DDL },
	{ name: "DML", data: DML },
	{ name: "select", data: select },
	{ name: "joins", data: joins },
];

/*
allPath.map((group) => {
	console.log(`Group: ${group.name}`);
	group.data.map((page) => {
		console.log(`  Name: ${page.name}, Path: ${page.path}`);
	});
});
*/
