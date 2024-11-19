'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import getDummyDataSubset from '@/utils/getDummyDataSubset';

interface GenerateTableParams<T extends object> {
  rows: T[]; // Add rows as a prop
  seed: string;
  rowsCount: number;
  formatFunctions?: Partial<Record<keyof T, (value: any) => string>>; // Optional formatting functions for specific columns
}

export default function GenerateTable<T extends object>({
  rows,
  seed,
  rowsCount,
  formatFunctions,
}: GenerateTableParams<T>) {
  const [tabledata, setTabledata] = useState<T[]>([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const data: T[] = getDummyDataSubset<T>(rows, seed, rowsCount);
    setTabledata(data);
  }, [seed, rowsCount]);

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader className="bg-sailorBlue text-white">
          <TableRow>
            {/* Generate table headers dynamically */}
            {tabledata.length > 0 &&
              (Object.keys(tabledata[0]) as Array<keyof T>).map((key) => (
                <TableHead key={key.toString()}>{key.toString()}</TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-mint">
          {/* Generate table rows dynamically */}
          {tabledata.map((tableRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {(Object.keys(tableRow) as Array<keyof T>).map((key) => {
                const value = tableRow[key];
                const formattedValue =
                  formatFunctions?.[key] ? formatFunctions[key]!(value) : value;
                return (
                  <TableCell key={key.toString()} className="text-sailorBlue">
                    {String(formattedValue)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
