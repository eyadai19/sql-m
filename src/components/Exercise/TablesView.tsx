import EmployeesTable from "./EmployeesTable";
import DepartmentsTable from "./DepartmentsTable";

interface TablesViewProps {
  tables: string[];
  seed: string;
}

export default function TablesView({ tables, seed }: TablesViewProps) {
  if (!tables || tables.length === 0) {
    return <p className="text-gray-500 italic">No tables available for this exercise.</p>;
  }

  return (
    <section className="space-y-4">
      {tables.map((table, index) => (
        <div key={index} className="mb-4">
          {table.toLowerCase().includes('employees') && (
            <EmployeesTable seed={seed} rowsCount={8} />
          )}
          {table.toLowerCase().includes('departments') && (
            <DepartmentsTable seed={seed} rowsCount={4} />
          )}
        </div>
      ))}
    </section>
  );
}