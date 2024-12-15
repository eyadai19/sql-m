/*
4
select
as
into
*/
import Select from "@/components/pages/DML/select";
import { getAuthorizedPage } from "../../layout";
export default function select() {
	// return (
	// 	<div className="p-4 text-base md:text-lg lg:text-xl">
	// 		<SelectPage />

	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Select getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
