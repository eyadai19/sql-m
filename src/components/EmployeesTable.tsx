import { DUMMY_EMPLOYEES_TABLE, EmployeeRow } from '@/utils/dummyData';
import GenerateTable from '@/components/GenerateTable';
interface EmployeeTableProps {
  seed: string;
  rowsCount: number;
}
export default function EmployeeTable({ seed, rowsCount }: EmployeeTableProps) {
  return (
    <GenerateTable<EmployeeRow>
      rows={DUMMY_EMPLOYEES_TABLE.rows}  
      seed={seed}
      rowsCount={rowsCount}
    />
  );
}