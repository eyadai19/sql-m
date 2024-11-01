import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

export async function openDb(): Promise<Database> {
	return open({
		filename: "./db/database.sqlite",
		driver: sqlite3.Database,
	});
}
