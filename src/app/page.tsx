import { Button } from "@/components/ui/button";
import createTable from "@/lib/model/userDB/user_db";
import { userCreateTabelSchema } from "@/lib/types/userSchema";
import { z } from "zod";

export default function Home() {
	const input: z.infer<typeof userCreateTabelSchema> = {
		query: "tableName (columnName1 columnType1, columnName2 columnType2)",
	};
	const db = createTable({ input: userCreateTabelSchema.parse(input) });

	return (
		<div className="p-4 text-base text-red-600 md:text-lg lg:text-xl">
			<Button className="bg-red-500">eyad</Button>
			<div>{/* <pre>{JSON.stringify(db, null, 2)}</pre>{" "} */}</div>
		</div>
	);
}
