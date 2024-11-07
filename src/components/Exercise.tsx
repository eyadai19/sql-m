'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type ResultType = {
  columns: string[];
  rows: (string | number)[][];
} | null;

type ErrorType = string | null;

type ExerciseProps = {
  title: string;
  prompt: string;
  tips: string;
  initialColumns: string[];
  initialRows: (string | number)[][];
  onRunQuery?: (query: string) => ResultType | ErrorType;
}

export default function Exercise({
  title,
  prompt,
  tips,
  initialColumns,
  initialRows,
  onRunQuery,
}: ExerciseProps) {
  const [sqlQuery, setSqlQuery] = useState<string>('')
  const [result, setResult] = useState<ResultType | null>({ columns: initialColumns, rows: initialRows })
  const [error, setError] = useState<ErrorType>(null)

  const handleRunQuery = () => {
    if (onRunQuery) {
      const queryResult = onRunQuery(sqlQuery);
      if (typeof queryResult === 'string') {
        setError(queryResult);
        setResult(null);
      } else {
        setResult(queryResult);
        setError(null);
      }
    }
  }

  const resetQuery = () => {
    setSqlQuery('');
    setResult({ columns: initialColumns, rows: initialRows });
    setError(null);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mb-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Section */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Task:</h2>
          <p className="text-gray-700">{prompt}</p>
        </section>

        {/* SQL Editor Section */}
        <section>
          <Label htmlFor="sql-editor" className="text-lg font-semibold mb-2 block">
            SQL Editor
          </Label>
          <textarea
            id="sql-editor"
            className="w-full h-40 p-2 font-mono text-sm bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Type your SQL query here..."
          />
        </section>

        {/* Action Buttons Section */}
        <section className="flex justify-between">
          <Button onClick={handleRunQuery} className="bg-blue-500 hover:bg-blue-600 text-white">
            Run Query
          </Button>
          <Button onClick={resetQuery} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
            Reset
          </Button>
        </section>

        {/* Results Section */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Results:</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {result && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {result.columns.map((column, index) => (
                      <th key={index} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 border-t border-gray-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {tips}
      </CardFooter>
    </Card>
  )
}