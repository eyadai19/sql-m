/*
3
erd
*/
import ERDPage from "@/components/pages/basic/ERD";
import { getAuthorizedPage } from "../../layout";
export default function ERD() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<ERDPage getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
