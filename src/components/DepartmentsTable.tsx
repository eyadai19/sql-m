import { DUMMY_DEPARTMENTS_TABLE, DepartmentRow } from '@/utils/dummyData';
import GenerateTable from '@/components/GenerateTable';
interface DepartmentsTableProps {
  seed: string;
  rowsCount: number;
}
export default function EmployeeTable({ seed, rowsCount }: DepartmentsTableProps) {
  return (
    <GenerateTable<DepartmentRow>
      rows={DUMMY_DEPARTMENTS_TABLE.rows}  
      seed={seed}
      rowsCount={rowsCount}
    />
  );
}