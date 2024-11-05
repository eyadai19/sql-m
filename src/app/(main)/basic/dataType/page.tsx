/*
1
شرح انواع المتغيرات في الجدول
UNIQUE
*/
import { DataType } from "@/components/pages/basic/dataType";
import { UserExcerciseAnswerAction } from "@/lib/userExcerciseAnswerAction";

export default function dataTypePage() {
	
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<div>eyad</div>
			<DataType userExcerciseAnswerAction={UserExcerciseAnswerAction} />
		</div>
	);
}
