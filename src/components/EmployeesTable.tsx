import { DUMMY_EMPLOYEES_TABLE, EmployeeRow } from '@/utils/dummyData';
import GenerateTable from '@/components/GenerateTable';

interface EmployeesTableProps {
  seed: string;
  rowsCount: number;
}

export default function EmployeesTable({ seed, rowsCount }: EmployeesTableProps) {
  return (
    <GenerateTable<EmployeeRow>
      rows={DUMMY_EMPLOYEES_TABLE.rows}
      seed={seed}
      rowsCount={rowsCount}
      title="Employees Table"
    />
  );
}