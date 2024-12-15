/*
3
update
*/

import Update from "@/components/pages/DML/update";
import { getAuthorizedPage } from "../../layout";

export default function update() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Update getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
