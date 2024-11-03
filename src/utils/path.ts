interface PageBath {
	name: string;
	path: string;
}

const basic: PageBath[] = [
	{ name: "dataType", path: "../basic/dataType" },
	{ name: "reference", path: "../basic/reference" },
	{ name: "ERD", path: "../basic/ERD" },
];

const DDL: PageBath[] = [
	{ name: "table", path: "../DDL/table" },
	{ name: "schema", path: "../DDL/schema" },
	{ name: "alter", path: "../DDL/alter" },
	{ name: "drop", path: "../DDL/drop" },
];

const DML: PageBath[] = [
	{ name: "delete", path: "../DML/delete" },
	{ name: "insert", path: "../DML/insert" },
	{ name: "update", path: "../DML/update" },
	{ name: "select", path: "../DML/select" },
];

const select: PageBath[] = [
	{ name: "aggregateFunction", path: "../select/aggregateFunction" },
	{ name: "between", path: "../select/between" },
	{ name: "distinct", path: "../select/distinct" },
	{ name: "GroupBy", path: "../select/GroupBy" },
	{ name: "Like", path: "../select/Like" },
	{ name: "operator", path: "../select/operator" },
	{ name: "subQuery", path: "../select/subQuery" },
	{ name: "where", path: "../select/where" },
];

const joins: PageBath[] = [
	{ name: "innerJoin", path: "../joins/innerJoin" },
	{ name: "join", path: "../joins/join" },
	{ name: "leftJoin", path: "../joins/leftJoin" },
	{ name: "outerJoin", path: "../joins/outerJoin" },
	{ name: "rightJoin", path: "../joins/rightJoin" },
	{ name: "selfJoin", path: "../joins/selfJoin" },
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

// export default async function insert_satge_level() {
// 	allPath.forEach((stage) => {
// 		const id = nanoid();
// 		var index = 0;
// 		await db.insert(TB_stage).values({
// 			id: id,
// 			stage: stage.name,
// 			index: 0,
// 		});
// 		index++;
// 		stage.data.forEach((level) => {
// 			await db.insert(TB_level).values({
// 				id: nanoid(),
// 				level: level.name,
// 				stageId: id,
// 			});
// 		});
// 	});
// }

const x = 1;
//
