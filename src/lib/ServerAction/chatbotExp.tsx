// let isMoreThanTable: Boolean = false;
// let selectCondition: Boolean = false;
// let useAgFun: Boolean = false;
// let useGroupBy: Boolean = false;

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUser } from "../auth";
import { db } from "../db";
import { TB_exp_session } from "../schema";

export async function ChatbotExpAction(
	question: string,
	answer: string,
): Promise<
	| { answer: string }
	| {
			answer: string;
			message: string;
			fun: Promise<
				| string[]
				| Record<string, string[]>
				| {
						field: string;
						message: string;
				  }
				| undefined
			>;
	  }
	| { question: string; answers: string[] }
	| { field: string; message: string }
> {
	"use server";
	var isMoreThanTable: boolean = false;
	var selectCondition: boolean = false;
	var useAgFun: boolean = false;
	var useGroupBy: boolean = false;
	const user = await getUser();
	if (!user) return { field: "root", message: "user error" };

	const existingSession = await db.query.TB_exp_session.findFirst({
		where: (s, { eq }) => eq(s.userId, user.id),
	});
	if (!existingSession) {
		const newSesstion = {
			id: nanoid(),
			userId: user.id,
			isMoreThanTable: isMoreThanTable,
			selectCondition: selectCondition,
			useAgFun: useAgFun,
			useGroupBy: useGroupBy,
		};
		await db.insert(TB_exp_session).values(newSesstion);
	} else {
		isMoreThanTable = existingSession.isMoreThanTable!;
		selectCondition = existingSession.selectCondition!;
		useAgFun = existingSession.useAgFun!;
		useGroupBy = existingSession.useGroupBy!;
	}

	async function chose_table() {
		function extractTableNames(context: string) {
			const regex = /CREATE TABLE (\w+)/g;
			let match;
			const tableNames = [];

			while ((match = regex.exec(context)) !== null) {
				tableNames.push(match[1]);
			}

			return tableNames;
		}
		try {
			const response = await fetch("http://localhost:3000/api/getContext");
			const data = await response.json();
			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}
			const context = data.context;
			const tableNames = extractTableNames(context);
			console.log("Table Names:", tableNames);
			return tableNames;
		} catch (error) {
			console.error("خطأ أثناء جلب الجداول:", error);
			alert("حدث خطأ أثناء جلب الجداول.");
			return { field: "root", message: "Failed to fetch table" };
		}
	}

	async function getTablesWithColumns() {
		function extractTablesWithColumns(
			context: string,
		): Record<string, string[]> {
			const tableRegex = /CREATE TABLE (\w+)\s*\(([\s\S]*?)\);/g;
			const tables: Record<string, string[]> = {};

			let match: RegExpExecArray | null;
			while ((match = tableRegex.exec(context)) !== null) {
				const tableName = match[1];
				const columnsText = match[2];

				const columns = columnsText
					.split(",")
					.map((column) => column.trim().split(/\s+/)[0]);

				tables[tableName] = columns;
			}

			return tables;
		}

		try {
			const response = await fetch("http://localhost:3000/api/getContext");
			const data = await response.json();

			if (!response.ok) {
				alert(data.error || "خطأ أثناء جلب الجداول.");
				return;
			}

			const context = data.context;
			const tablesWithColumns = extractTablesWithColumns(context);
			// console.log("Tables with Columns:", tablesWithColumns);
			return tablesWithColumns;
		} catch (error) {
			console.error("خطأ أثناء جلب الجداول:", error);
			alert("حدث خطأ أثناء جلب الجداول.");
			return { field: "root", message: "Failed to fetch table" };
		}
	}
	async function updateSession() {
		const user = await getUser();
		if (!user) return { field: "root", message: "user error" };

		await db
			.update(TB_exp_session)
			.set({
				isMoreThanTable: isMoreThanTable,
				selectCondition: selectCondition,
				useAgFun: useAgFun,
				useGroupBy: useGroupBy,
			})
			.where(eq(TB_exp_session.userId, user.id));
	}
	try {
		if (question === "What kind of instructions do you want?") {
			if (answer === "dml") {
				return {
					question: "Do you want to fetch data?",
					answers: ["yes", "no"],
				};
			}
			if (answer === "ddl") {
				return {
					question: "Do you want to modify an old table?",
					answers: ["yes", "no"],
				};
			}
		}

		if (question === "Do you want to modify an old table?") {
			if (answer === "yes") {
				return {
					question: "do you want to delete a table?",
					answers: ["yes", "no"],
				};
			}
			if (answer === "no") {
				return {
					question: "Do you want to create a new table?",
					answers: ["yes", "no"],
				};
			}
		}
		if (question === "do you want to delete a table?") {
			if (answer === "yes") {
				return {
					fun: chose_table(),
					message: "chose the table",
					answer: "DROP table {table_name}",
				};
			}
			if (answer === "no") {
				return {
					question: "do you want to delete or add a column?",
					answers: ["delete", "add"],
				};
			}
		}
		if (question === "do you want to delete or add a column?") {
			if (answer === "add") {
				return {
					// add text field to ui to write column name and drag drop list to chose the type
					message: "chose the table and enter the column and type",
					fun: chose_table(),
					answer: "ALTER TABLE {table_name} ADD {column_name} {datatype};",
				};
			}
			if (answer === "delete") {
				return {
					// view all table to chose one then view all columns for this table to chose
					message: "chose the table then chose the column",
					fun: getTablesWithColumns(),
					answer: "ALTER TABLE {table_name} DROP COLUMN {column_name};",
				};
			}
		}
		if (question === "Do you want to create a new table?") {
			if (answer === "yes") {
				return {
					// add text field to ui to write table name and column name and drag drop list to chose the type - if click on + then the user can add new column
					answer: "CREATE TABLE table_name {[column_name datatype]};",
				};
			}
			if (answer === "no") {
				return { field: "root", message: "End of questions" };
			}
		}

		// dml
		//
		//
		if (question === "Do you want to fetch data?") {
			if (answer === "yes") {
				return {
					question: "is the data present in more than one table?",
					answers: ["yes", "no"],
				};
			}
			if (answer === "no") {
				// x = chose table
				return {
					question: "Do you want to add, modify, or delete a value?",
					answers: ["add", "modify", "delete"],
				};
			}
		}

		if (question === "Do you want to add, modify, or delete a value?") {
			if (answer === "add") {
				return {
					// view all table to chose one then view all columns for this table to chose - if click on + then user can chose new column - foreach column should have input filed for value
					message: "chose the table then chose the columns and enter the value",
					fun: getTablesWithColumns(),
					answer:
						"INSERT INTO {table_name} ({[column_name]}) VALUES {[value]};",
				};
			}
			if (answer === "delete") {
				return {
					// view all table to chose one - ui for condition , show all column and when chose one show operator then enter value
					message: "chose the table to delete ",
					fun: getTablesWithColumns(),
					answer: "DELETE FROM {table_name} where (|condition|);",
				};
			}
			if (answer === "modify") {
				return {
					question: "Do you want to modify all data? (without condition)",
					answers: ["yes", "no"],
				};
			}
		}

		if (question === "Do you want to modify all data? (without condition)") {
			if (answer === "yes") {
				return {
					// view all table to chose one and when chose show all column and input filed foreach column
					message: "chose the table to delete ",
					fun: getTablesWithColumns(),
					answer: "UPDATE {table_name} SET {[column_name = value]};",
				};
			}
			if (answer === "no") {
				return {
					// view all table to chose one and when chose show all column and input filed foreach column - ui for condition , show all column and when chose one show operator then enter value
					message: "chose the table to delete ",
					fun: getTablesWithColumns(),
					answer:
						"UPDATE {table_name} SET {[column_name = value]} where |condition|;",
				};
			}
		}
		// // // // // // // // // // // // // // // // // // // // // // //
		// // // // // // // // // // // // // // // // // // // // // // //
		// // // // // // // // // // // // // // // // // // // // // // //
		if (question === "is the data present in more than one table?") {
			if (answer === "yes") {
				// x = chose tables;
				isMoreThanTable = true;
				updateSession();
				answer = "no";
			}
			if (answer === "no") {
				// chose_columns_query;
				return {
					question:
						"does the data you want have to be in one line? (use agregation function)",
					answers: ["yes", "no"],
				};
			}
		}
		if (
			question ===
			"does the data you want have to be in one line? (use agregation function)"
		) {
			if (answer === "yes") {
				// حالة خاصة
				return {
					question: "select the name of the process?",
					answers: ["min", "max", "sum", "avg", "count"],
				};
				// answer = "no";
			}
			if (answer === "no") {
				return {
					question: "do you want to add a condition?",
					answers: ["yes", "no"],
				};
			}
		}
		if (question === "select the name of the process?") {
			if (
				answer === "min" ||
				answer === "max" ||
				answer === "sum" ||
				answer === "avg" ||
				answer === "count"
			) {
				useAgFun = true;
				updateSession();

				return {
					question: "do you want to add a condition?",
					answers: ["yes", "no"],
				};
			}
		}
		if (question === "do you want to add a condition?") {
			if (answer === "yes") {
				// x = add_condition();
				selectCondition = true;
				updateSession();
				answer = "no";
			}
			if (answer === "no") {
				if (useAgFun) {
					return {
						question: "do you want to group the data?",
						answers: ["yes", "no"],
					};
				} else
					return {
						question: "do you want to arrange the data?",
						answers: ["yes", "no"],
					};
			}
		}
		if (question === "do you want to group the data?") {
			if (answer === "yes") {
				useGroupBy = true;
				updateSession();
				answer = "no";
			}
			if (answer === "no") {
				return {
					question: "do you want to arrange the data?",
					answers: ["yes", "no"],
				};
			}
		}

		if (question === "do you want to arrange the data?") {
			if (answer === "yes") {
				isMoreThanTable = false;
				selectCondition = false;
				useAgFun = false;
				useGroupBy = false;
				updateSession();
				return {
					message: `chose the ${isMoreThanTable ? "tables" : "table"} then chose the columns`,
					fun: getTablesWithColumns(),
					answer: `SELECT ${useAgFun ? "|agg| " : " "}{[column_name]} FROM ${isMoreThanTable ? "|table_name|" : "{table_name}"}${selectCondition ? " where (|condition|)" : ""}${useGroupBy ? " GROUP BY {column_name_GROUP_BY}" : ""} ORDER BY {column_name_ORDER_BY} {ASC|DESC};`,
				};
			}
			if (answer === "no") {
				isMoreThanTable = false;
				selectCondition = false;
				useAgFun = false;
				useGroupBy = false;
				return {
					message: `chose the ${isMoreThanTable ? "tables" : "table"} then chose the columns`,
					fun: getTablesWithColumns(),
					answer: `SELECT {[column_name]} FROM ${isMoreThanTable ? "|table_name|" : "{table_name}"}${selectCondition ? " where (|condition|)" : ""}${useGroupBy ? " GROUP BY {column_name_GROUP_BY}" : ""};`,
				};
			}
		}

		return { field: "root", message: "Unable to process your request." };
	} catch (error) {
		console.error("Error processing input:", error);
		return {
			field: "root",
			message: "An error occurred while processing your request.",
		};
	}
}
