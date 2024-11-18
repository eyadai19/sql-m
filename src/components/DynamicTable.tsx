'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
}

interface TableConfig<T> {
  columns: Column<T>[];
  caption?: string;
}

interface DynamicTableProps<T> {
  getData: (seed: string, count: number) => T[];
  config: TableConfig<T>;
  seed: string;
  rowCount: number;
}

export default function DynamicTable<T extends Record<string, any>>({
  getData,
  config,
  seed,
  rowCount
}: DynamicTableProps<T>) {
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    const fetchedData = getData(seed, rowCount)
    setData(fetchedData)
  }, [getData, seed, rowCount])

  return (
    <div className="container mx-auto py-10">
      <Table>
        {config.caption && <TableCaption>{config.caption}</TableCaption>}
        <TableHeader>
          <TableRow className="bg-sailorBlue text-white">
            {config.columns.map((column) => (
              <TableHead key={column.key as string} className="font-bold">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-mint'}>
              {config.columns.map((column) => (
                <TableCell key={column.key as string}>
                  {column.render
                    ? column.render(item[column.key])
                    : item[column.key]?.toString()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}