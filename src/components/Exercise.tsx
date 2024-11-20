"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";
import DepartmentsTable from "./DepartmentsTable";
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ResultType = {
  columns: string[];
  rows: (string | number)[][];
} | null;

type ErrorType = string | null;

type ExerciseProps = {
  title?: string;
  prompt: string;
  tips?: string;
  tables: string[];
  difficulty: string;
  reference?: string;
  answer?: string;
  seed?: string;
};

export default function Exercise({
  title,
  prompt,
  tables,
  answer,
  difficulty,
  seed = uuidv4(),
}: ExerciseProps) {
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [error, setError] = useState<ErrorType>(null);
  const [isIncorrectAnswer, setIsIncorrectAnswer] = useState(false);

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
      setError("Please enter a SQL query");
      return;
    }

    try {
      setError(null);
      setResult(null);
      setIsIncorrectAnswer(false);

      const response = await fetch('/api/validate-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sqlQuery,
          seed,
          employeesCount: 8,
          departmentsCount: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error('Query execution error:', err);
      setError('An error occurred while executing the query');
    }
  };

  const handleShowAnswerClick = () => {
    setSqlQuery(answer || '');
    setShowAnswer(true);
  };

  const handleReset = () => {
    setSqlQuery("");
    setError(null);
    setResult(null);
    setIsIncorrectAnswer(false);
  };
  const renderTables = () => {
    if (!tables || tables.length === 0) {
      return <p className="text-gray-500 italic">No tables available for this exercise.</p>
    }

    return tables.map((table, index) => (
      <div key={index} className="mb-4">
        {table.toLowerCase().includes('employees') && (
          <EmployeesTable seed={seed} rowsCount={8} />
        )}
        {table.toLowerCase().includes('departments') && (
          <DepartmentsTable seed={seed} rowsCount={4} />
        )}
      </div>
    ))
  }
  return (
    <Card className="w-full max-w-4xl mx-auto mb-3 backdrop-blur-xl bg-white/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-sailorBlue">{title}</CardTitle>
        <Badge className="bg-sailorBlue text-white">{difficulty}</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="bg-gray-100/40 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Task:</h2>
          <p className="text-gray-700">{prompt}</p>
        </section>

        <section className="space-y-4">
          
          {renderTables()}
        </section>

        <section>
          <Label htmlFor="sql-editor" className="mb-2 block text-lg font-semibold">
            SQL Editor
          </Label>
          <textarea
            id="sql-editor"
            className="h-40 w-full rounded-md border border-gray-300/40 bg-gray-100/40 p-2 font-mono text-sm focus:outline-none"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Type your SQL query here..."
          />
        </section>

        <section className="flex justify-between">
          <div className="space-x-2">
            <Button
              onClick={handleRunQuery}
              className="bg-sailorBlue hover:bg-lightSailorBlue text-gray-200"
            >
              Run Query
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
            >
              Reset
            </Button>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
            onClick={handleShowAnswerClick}
            type="button"
          >
            Show Answer
          </Button>
        </section>

        {error && (
          <section className="mt-6">
            <div
              className="relative rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </section>
        )}

        {result && (
          <section className="mt-6">
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
        )}
      </CardContent>
    </Card>
  );
}