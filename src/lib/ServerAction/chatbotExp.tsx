import { getContextApi } from "@/utils/apis";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUser } from "../auth";
import { db } from "../db";
import { TB_exp_session } from "../schema";

const questionTranslations = new Map<string, string>([
	["What kind of instructions do you want?", "ما نوع التعليمات التي تريدها؟"],
	["Do you want to fetch data?", "هل تريد جلب البيانات؟"],
	["Do you want to modify an old table?", "هل تريد تعديل جدول قديم؟"],
	["do you want to delete a table?", "هل تريد حذف جدول؟"],
	["Do you want to create a new table?", "هل تريد إنشاء جدول جديد؟"],
	["do you want to delete or add a column?", "هل تريد حذف أو إضافة عمود؟"],
	[
		"is the data present in more than one table?",
		"هل البيانات موجودة في أكثر من جدول؟",
	],
	[
		"does the data you want have to be in one line? (use agregation function)",
		"هل البيانات التي تريدها يجب أن تكون في سطر واحد؟ (استخدام دالة تجميع)",
	],
	["select the name of the process?", "اختر اسم العملية؟"],
	["do you want to add a condition?", "هل تريد إضافة شرط؟"],
	["do you want to group the data?", "هل تريد تجميع البيانات؟"],
	["do you want to arrange the data?", "هل تريد ترتيب البيانات؟"],
	[
		"Do you want to add, modify, or delete a value?",
		"هل تريد إضافة، تعديل، أو حذف قيمة؟",
	],
	[
		"Do you want to modify all data? (without condition)",
		"هل تريد تعديل جميع البيانات؟ (بدون شرط)",
	],
	["chose the table", "اختر الجدول"],
	[
		"chose the table and enter the column and type",
		"اختر الجدول وأدخل اسم العمود ونوعه",
	],
	["chose the table then chose the column", "اختر الجدول ثم اختر العمود"],
	[
		"chose the table then chose the columns and enter the value",
		"اختر الجدول ثم اختر الأعمدة وأدخل القيمة",
	],
	["chose the table to delete", "اختر الجدول للحذف"],
	["chose the table to delete (with condition)", "اختر الجدول للحذف (مع شرط)"],
	["chose the table to modify", "اختر الجدول للتعديل"],
	["chose the tables then chose the columns", "اختر الجداول ثم اختر الأعمدة"],
]);

const answerTranslations = new Map<string, string>([
	["yes", "نعم"],
	["no", "لا"],
	["add", "إضافة"],
	["delete", "حذف"],
	["modify", "تعديل"],
	["min", "الحد الأدنى"],
	["max", "الحد الأقصى"],
	["sum", "المجموع"],
	["avg", "المتوسط"],
	["count", "العدد"],
]);

function translateQuestion(question: string, language: string): string {
	return language === "EN"
		? question
		: questionTranslations.get(question) || question;
}

function translateAnswer(answer: string, language: string): string {
	return language === "EN" ? answer : answerTranslations.get(answer) || answer;
}

let cachedTablesWithColumns: Record<string, string[]> | null = null;

async function getTablesWithColumns(): Promise<
	Record<string, string[]> | { field: string; message: string }
> {
	if (cachedTablesWithColumns) {
		return Promise.resolve(cachedTablesWithColumns); // إرجاع Promise
	}

	function extractTablesWithColumns(context: string): Record<string, string[]> {
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
		const response = await fetch(getContextApi);
		const data = await response.json();

		if (!response.ok) {
			alert(data.error || "خطأ أثناء جلب الجداول.");
			return Promise.resolve({
				field: "root",
				message: "Failed to fetch table",
			}); // إرجاع Promise
		}

		const context = data.context;
		cachedTablesWithColumns = extractTablesWithColumns(context);
		return Promise.resolve(cachedTablesWithColumns); // إرجاع Promise
	} catch (error) {
		console.error("خطأ أثناء جلب الجداول:", error);
		alert("حدث خطأ أثناء جلب الجداول.");
		return Promise.resolve({ field: "root", message: "Failed to fetch table" }); // إرجاع Promise
	}
}

async function chose_table(): Promise<
	string[] | { field: string; message: string }
> {
	function extractTableNames(context: string): string[] {
		const regex = /CREATE TABLE (\w+)/g;
		const tableNames: string[] = [];
		let match;

		while ((match = regex.exec(context)) !== null) {
			tableNames.push(match[1]);
		}

		return tableNames;
	}

	try {
		const response = await fetch(getContextApi);
		const data = await response.json();

		if (!response.ok) {
			alert(data.error || "خطأ أثناء جلب الجداول.");
			return Promise.resolve({
				field: "root",
				message: "Failed to fetch table",
			}); // إرجاع Promise
		}

		const context = data.context;
		return Promise.resolve(extractTableNames(context)); // إرجاع Promise
	} catch (error) {
		console.error("خطأ أثناء جلب الجداول:", error);
		alert("حدث خطأ أثناء جلب الجداول.");
		return Promise.resolve({ field: "root", message: "Failed to fetch table" }); // إرجاع Promise
	}
}

async function updateSession(
	userId: string,
	sessionData: Partial<typeof TB_exp_session.$inferInsert>,
): Promise<void> {
	await db
		.update(TB_exp_session)
		.set(sessionData)
		.where(eq(TB_exp_session.userId, userId));
}

export async function ChatbotExpAction(
	question: string,
	answer: string,
	language: string = "EN",
): Promise<
	| { answer: string }
	| {
			answer: string;
			message: string;
			fun: Promise<
				| string[]
				| Record<string, string[]>
				| { field: string; message: string }
				| undefined
			>;
	  }
	| { question: string; answers: string[] }
	| { field: string; message: string }
> {
	"use server";

	question = translateQuestion(question, language);
	answer = translateAnswer(answer, language);

	try {
		if (
			question === "What kind of instructions do you want?" ||
			question === "ما نوع التعليمات التي تريدها؟"
		) {
			if (answer === "dml") {
				return {
					question: translateQuestion("Do you want to fetch data?", language),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
			if (answer === "ddl") {
				return {
					question: translateQuestion(
						"Do you want to modify an old table?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "Do you want to modify an old table?" ||
			question === "هل تريد تعديل جدول قديم؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				return {
					question: translateQuestion(
						"do you want to delete a table?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"Do you want to create a new table?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "do you want to delete a table?" ||
			question === "هل تريد حذف جدول؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				return {
					fun: chose_table(),
					message: translateQuestion("chose the table", language),
					answer: "DROP table {table_name}",
				};
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"do you want to delete or add a column?",
						language,
					),
					answers: ["delete", "add"].map((ans) =>
						translateAnswer(ans, language),
					),
				};
			}
		}

		if (
			question === "do you want to delete or add a column?" ||
			question === "هل تريد حذف أو إضافة عمود؟"
		) {
			if (answer === "add" || answer === "إضافة") {
				return {
					message: translateQuestion(
						"chose the table and enter the column and type",
						language,
					),
					fun: chose_table(),
					answer: "ALTER TABLE {table_name} ADD {column_name} {datatype};",
				};
			}
			if (answer === "delete" || answer === "حذف") {
				const tablesWithColumns = await getTablesWithColumns();

				return {
					message: translateQuestion(
						"chose the table then chose the column",
						language,
					),
					fun: Promise.resolve(tablesWithColumns),
					answer: "ALTER TABLE {table_name} DROP COLUMN {column_name};",
				};
			}
		}

		if (
			question === "Do you want to create a new table?" ||
			question === "هل تريد إنشاء جدول جديد؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				return {
					answer: "CREATE TABLE [table_name] ({[column_name datatype]});",
				};
			}
			if (answer === "no" || answer === "لا") {
				return { field: "root", message: "End of questions" };
			}
		}

		if (
			question === "Do you want to fetch data?" ||
			question === "هل تريد جلب البيانات؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				return {
					question: translateQuestion(
						"is the data present in more than one table?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"Do you want to add, modify, or delete a value?",
						language,
					),
					answers: ["add", "modify", "delete"].map((ans) =>
						translateAnswer(ans, language),
					),
				};
			}
		}

		if (
			question === "Do you want to add, modify, or delete a value?" ||
			question === "هل تريد إضافة، تعديل، أو حذف قيمة؟"
		) {
			if (answer === "add" || answer === "إضافة") {
				const tablesWithColumns = await getTablesWithColumns();
				return {
					message: translateQuestion(
						"chose the table then chose the columns and enter the value",
						language,
					),
					fun: Promise.resolve(tablesWithColumns),
					answer:
						"INSERT INTO {table_name} ({[column_name]}) VALUES {[value]};",
				};
			}
			if (answer === "delete" || answer === "حذف") {
				const tablesWithColumns = await getTablesWithColumns();
				return {
					message: translateQuestion("chose the table to delete", language),
					fun: Promise.resolve(tablesWithColumns),
					answer: "DELETE FROM {table_name} where (|condition|);",
				};
			}
			if (answer === "modify" || answer === "تعديل") {
				return {
					question: translateQuestion(
						"Do you want to modify all data? (without condition)",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "Do you want to modify all data? (without condition)" ||
			question === "هل تريد تعديل جميع البيانات؟ (بدون شرط)"
		) {
			const tablesWithColumns = await getTablesWithColumns();
			if (answer === "yes" || answer === "نعم") {
				return {
					message: translateQuestion("chose the table to modify", language),
					fun: Promise.resolve(tablesWithColumns),
					answer: "UPDATE {table_name} SET {[column_name = value]};",
				};
			}
			if (answer === "no" || answer === "لا") {
				return {
					message: translateQuestion(
						"chose the table to delete (with condition)",
						language,
					),
					fun: Promise.resolve(tablesWithColumns),
					answer:
						"UPDATE {table_name} SET {[column_name = value]} where (|condition|);",
				};
			}
		}

		if (
			question === "is the data present in more than one table?" ||
			question === "هل البيانات موجودة في أكثر من جدول؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				await updateSession(user.id, {
					isMoreThanTable: true,
				});
				answer = "no";
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"does the data you want have to be in one line? (use agregation function)",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question ===
				"does the data you want have to be in one line? (use agregation function)" ||
			question ===
				"هل البيانات التي تريدها يجب أن تكون في سطر واحد؟ (استخدام دالة تجميع)"
		) {
			if (answer === "yes" || answer === "نعم") {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				await updateSession(user.id, {
					useAgFun: true,
				});
				return {
					question: translateQuestion(
						"select the name of the process?",
						language,
					),
					answers: ["min", "max", "sum", "avg", "count"].map((ans) =>
						translateAnswer(ans, language),
					),
				};
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"do you want to add a condition?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "select the name of the process?" ||
			question === "اختر اسم العملية؟"
		) {
			if (
				answer === "min" ||
				answer === "الحد الأدنى" ||
				answer === "max" ||
				answer === "الحد الأقصى" ||
				answer === "sum" ||
				answer === "المجموع" ||
				answer === "avg" ||
				answer === "المتوسط" ||
				answer === "count" ||
				answer === "العدد"
			) {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				await updateSession(user.id, {
					useAgFun: true,
				});
				return {
					question: translateQuestion(
						"do you want to add a condition?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "do you want to add a condition?" ||
			question === "هل تريد إضافة شرط؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				await updateSession(user.id, {
					selectCondition: true,
				});
				answer = "no";
			}
			if (answer === "no" || answer === "لا") {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				let useAgFun = existingSession?.useAgFun ?? false;
				if (useAgFun) {
					return {
						question: translateQuestion(
							"do you want to group the data?",
							language,
						),
						answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
					};
				} else {
					return {
						question: translateQuestion(
							"do you want to arrange the data?",
							language,
						),
						answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
					};
				}
			}
		}

		if (
			question === "do you want to group the data?" ||
			question === "هل تريد تجميع البيانات؟"
		) {
			if (answer === "yes" || answer === "نعم") {
				const user = await getUser();
				if (!user) return { field: "root", message: "user error" };

				const existingSession = await db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				});

				if (!existingSession) {
					const newSession = {
						id: nanoid(),
						userId: user.id,
						isMoreThanTable: false,
						selectCondition: false,
						useAgFun: false,
						useGroupBy: false,
					};
					await db.insert(TB_exp_session).values(newSession);
				}
				await updateSession(user.id, {
					useGroupBy: true,
				});
				answer = "no";
			}
			if (answer === "no" || answer === "لا") {
				return {
					question: translateQuestion(
						"do you want to arrange the data?",
						language,
					),
					answers: ["yes", "no"].map((ans) => translateAnswer(ans, language)),
				};
			}
		}

		if (
			question === "do you want to arrange the data?" ||
			question === "هل تريد ترتيب البيانات؟"
		) {
			const user = await getUser();
			if (!user) return { field: "root", message: "user error" };

			const [existingSession, tablesWithColumns] = await Promise.all([
				db.query.TB_exp_session.findFirst({
					where: (s, { eq }) => eq(s.userId, user.id),
				}),
				getTablesWithColumns(),
			]);

			if (!existingSession) {
				const newSession = {
					id: nanoid(),
					userId: user.id,
					isMoreThanTable: false,
					selectCondition: false,
					useAgFun: false,
					useGroupBy: false,
				};
				await db.insert(TB_exp_session).values(newSession);
			}
			let isMoreThanTable = existingSession?.isMoreThanTable ?? false;
			let selectCondition = existingSession?.selectCondition ?? false;
			let useAgFun = existingSession?.useAgFun ?? false;
			let useGroupBy = existingSession?.useGroupBy ?? false;
			if (answer === "yes" || answer === "نعم") {
				const message = translateQuestion(
					`chose the ${isMoreThanTable ? "tables" : "table"} then chose the columns`,
					language,
				);
				const fun = Promise.resolve(tablesWithColumns);
				const answer = `SELECT${useAgFun ? " |agg| " : " "}{[column_name]} FROM ${isMoreThanTable ? "|table_name|" : "{table_name}"}${selectCondition ? " where (|condition|)" : ""}${useGroupBy ? " GROUP BY {column_name_GROUP_BY}" : ""} ORDER BY {column_name_ORDER_BY} {ASC|DESC};`;
				await updateSession(user.id, {
					isMoreThanTable: false,
					selectCondition: false,
					useAgFun: false,
					useGroupBy: false,
				});
				return {
					message: message,
					fun: fun,
					answer: answer,
				};
			}
			if (answer === "no" || answer === "لا") {
				const message = translateQuestion(
					`chose the ${isMoreThanTable ? "tables" : "table"} then chose the columns`,
					language,
				);
				const fun = Promise.resolve(tablesWithColumns);
				const answer = `SELECT${useAgFun ? " |agg| " : " "}{[column_name]} FROM ${isMoreThanTable ? "|table_name|" : "{table_name}"}${selectCondition ? " where (|condition|)" : ""}${useGroupBy ? " GROUP BY {column_name_GROUP_BY}" : ""};`;
				await updateSession(user.id, {
					isMoreThanTable: false,
					selectCondition: false,
					useAgFun: false,
					useGroupBy: false,
				});
				return {
					message: message,
					fun: fun,
					answer: answer,
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
