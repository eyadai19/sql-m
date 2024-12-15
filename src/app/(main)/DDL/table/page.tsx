/*
1
create table
auto increment
*/

import CreateTable from "@/components/pages/DDL/tabel";
import { getAuthorizedPage } from "../../layout";

export default function tabel() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<CreateTable getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
