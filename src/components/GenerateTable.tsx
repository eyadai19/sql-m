'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import getDummyDataSubset from '@/utils/getDummyDataSubset';

interface GenerateTableParams<T extends object> {
  rows: T[];
  seed: string;
  rowsCount: number;
  title?: string;
  formatFunctions?: Partial<Record<keyof T, (value: any) => string>>;
}

export default function GenerateTable<T extends object>({
  rows,
  seed,
  rowsCount,
  title,
  formatFunctions,
}: GenerateTableParams<T>) {
  const [tabledata, setTabledata] = useState<T[]>([]);

  useEffect(() => {
    const data: T[] = getDummyDataSubset<T>(rows, seed, rowsCount);
    setTabledata(data);
  }, [seed, rowsCount, rows]);

  return (
    <div className="rounded-lg border border-gray-200 mb-4">
      {title && (
        <div className="bg-gray-100/50 p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tabledata.length > 0 &&
                (Object.keys(tabledata[0]) as Array<keyof T>).map((key) => (
                  <TableHead key={key.toString()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key.toString()}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabledata.map((tableRow, rowIndex) => (
              <TableRow key={rowIndex}>
                {(Object.keys(tableRow) as Array<keyof T>).map((key) => {
                  const value = tableRow[key];
                  const formattedValue =
                    formatFunctions?.[key] ? formatFunctions[key]!(value) : value;
                  return (
                    <TableCell key={key.toString()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(formattedValue)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}