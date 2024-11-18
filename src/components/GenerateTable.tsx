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
import getDummyDataSubset from '@/utils/getDummyDataSubset'

import { EmployeeRow } from '@/utils/dummyData'

interface GenerateTableParams<T> {
    RowsInterface: T,
    seed: string,
    columnsCount: number
}

export default function GenerateTable(RowsInterface, seed, columnsCount :EmployeeRow) {
interface TableStructure {
    columns: Array<keyof EmployeeRow>,
    rows: EmployeeRow
}

  const [tabledata, setTabledata] = useState<RowsInterface[]>([])

  useEffect(() => {
    // Fetch data when component mounts
    const data = getDummyDataSubset('some-seed', 5) // Adjust seed and count as needed
    setTabledata(data)
  }, [])

  // Function to format salary
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(salary)
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>Employee Information</TableCaption>
        <TableHeader>
          <TableRow>

            // change the heading to be generated using map function 
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Salary</TableHead>
            <TableHead className="text-right">Date Hired</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tabledata.map((tableRow) => (
            <TableRow key={tableRow.id}>
              <TableCell className="font-medium">{tableRow.id}</TableCell>
              <TableCell>{tableRow.name}</TableCell>
              <TableCell>{tableRow.position}</TableCell>
              <TableCell>{tableRow.department}</TableCell>
              <TableCell className="text-right">{formatSalary(tableRow.salary)}</TableCell>
              <TableCell className="text-right">{formatDate(tableRow.date_hired)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}