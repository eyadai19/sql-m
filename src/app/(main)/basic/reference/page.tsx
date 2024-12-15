/*
2
FOREIGN KEY
PRIMARY KEY
*/
import Reference from "@/components/pages/basic/reference";
import { getAuthorizedPage } from "../../layout";
export default function reference() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Reference getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
