import GenerateTable from "@/components/Exercise/GenerateTable";
import { DUMMY_EMPLOYEES_TABLE, EmployeeRow } from "@/utils/dummyData";

interface EmployeesTableProps {
	seed: string;
	rowsCount: number;
}

export default function EmployeesTable({
	seed,
	rowsCount,
}: EmployeesTableProps) {
	return (
		<GenerateTable<EmployeeRow>
			rows={DUMMY_EMPLOYEES_TABLE.rows}
			seed={seed}
			rowsCount={rowsCount}
			title="Employees Table"
		/>
	);
}
