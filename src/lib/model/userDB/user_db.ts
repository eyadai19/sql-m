import { userCreateTabelSchema } from "@/lib/types/userSchema";
import { z } from "zod";

interface User_db {
	tabels: User_db_tabel[];
}

interface User_db_tabel {
	name: string;
	columns: User_db_column_data[];
}

interface User_db_column_data {
	name: string;
	type: string;
}

export default function createTable({
	input,
}: {
	input: z.infer<typeof userCreateTabelSchema>;
}): User_db {
	const db: User_db = { tabels: [] };

	const [tableNamePart, columnsPart] = input.query.split("(");
	const tableName = tableNamePart.trim();
	const columnDefinitions = columnsPart
		.replace(")", "")
		.split(",")
		.map((col) => col.trim());

	const columns = columnDefinitions.map((def) => {
		const [name, type] = def.split(" ").map((part) => part.trim());
		return {
			name,
			type: type.toUpperCase(),
		};
	});

	const newTable: User_db_tabel = {
		name: tableName,
		columns,
	};

	db.tabels.push(newTable);

	return db;
}
