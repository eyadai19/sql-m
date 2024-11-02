import { Button } from "@/components/ui/button";
import createTable from "@/lib/model/userDB/user_db";
import { userCreateTabelSchema } from "@/lib/types/userSchema";
import { allPath } from "@/utils/path";
import { z } from "zod";

export default function Home() {
	const input: z.infer<typeof userCreateTabelSchema> = {
		query: "tableName (columnName1 columnType1, columnName2 columnType2)",
	};

	const db = createTable({ input: userCreateTabelSchema.parse(input) });

	return (
		<div className="p-4 text-base text-red-600 md:text-lg lg:text-xl">
			<Button className="bg-red-500">eyad</Button>
			<div>
				{/* <pre>{JSON.stringify(db, null, 2)}</pre>{" "} */}
				{allPath.map((group, groupIndex) => (
					<div key={groupIndex}>
						<h2 className="mt-4 text-lg font-bold">{group.name}</h2>{" "}
						<ul>
							{group.data.map((page, pageIndex) => (
								<li key={pageIndex} className="text-blue-500 underline">
									<a href={page.path}>{page.name}</a> {/* اسم الصفحة ورابطها */}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
