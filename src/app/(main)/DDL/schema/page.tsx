/*
2
schema
*/

import Schema from "@/components/pages/DDL/schema";
import { getAuthorizedPage } from "../../layout";

export default function schema() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Schema getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
