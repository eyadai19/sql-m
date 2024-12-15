/*
1
delete
*/

import Delete from "@/components/pages/DML/delete";
import { getAuthorizedPage } from "../../layout";

export default function del() {
	return (
	<div className="p-4 text-base md:text-lg lg:text-xl">
		<Delete getAuthorizedPage={getAuthorizedPage}/>
	</div>);
}
