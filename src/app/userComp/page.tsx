import DatabaseManager from "@/components/database/DatabaseManager";
import { NextPage } from "next";

const UserComp: NextPage = () => {
	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-6 text-3xl font-bold">صفحة إدارة قاعدة البيانات</h1>
			<DatabaseManager/>
		</div>
	);
};

export default UserComp;
