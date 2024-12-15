/*
1
شرح انواع المتغيرات في الجدول
UNIQUE
*/
import DataType from "@/components/pages/basic/dataType";
import { getAuthorizedPage } from "../../layout";
export default function dataTypePage() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<DataType getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
