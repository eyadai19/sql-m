import GenerateTable from "@/components/Exercise/GenerateTable";
import { DUMMY_DEPARTMENTS_TABLE, DepartmentRow } from "@/utils/dummyData";

interface DepartmentsTableProps {
	seed: string;
	rowsCount: number;
}

export default function DepartmentsTable({
	seed,
	rowsCount,
}: DepartmentsTableProps) {
	return (
		<GenerateTable<DepartmentRow>
			rows={DUMMY_DEPARTMENTS_TABLE.rows}
			seed={seed}
			rowsCount={rowsCount}
			title="Departments Table"
		/>
	);
}
