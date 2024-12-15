/*
4
drop
*/

import Drop from "@/components/pages/DDL/drop";
import { getAuthorizedPage } from "../../layout";

export default function drop() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Drop getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
