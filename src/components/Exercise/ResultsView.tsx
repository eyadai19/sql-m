import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy } from "lucide-react";
import type { QueryResult } from "./Exercise";

interface ResultsViewProps {
  result: QueryResult;
}

export default function ResultsView({ result }: ResultsViewProps) {
  return (
    <section className="mt-6">
      {result.successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <Trophy className="h-4 w-4" />
          <AlertDescription>{result.successMessage}</AlertDescription>
        </Alert>
      )}
      
      <h2 className="mb-2 text-lg font-semibold">Results:</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              {result.columns.map((column, i) => (
                <TableHead key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}