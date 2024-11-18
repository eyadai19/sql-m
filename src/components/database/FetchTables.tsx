"use client";
import React, { useState } from "react";

interface Table {
  tableName: string;
  columns: { columnName: string; columnType: string }[];
}

const FetchTables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);

  const fetchTables = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/db");
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "خطأ أثناء جلب الجداول.");
        return;
      }
      setTables(data);
    } catch (error) {
      console.error("خطأ أثناء جلب الجداول:", error);
      alert("حدث خطأ أثناء جلب الجداول.");
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={fetchTables}
        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
      >
        عرض الجداول
      </button>
      {tables.length > 0 ? (
        <ul className="mt-4">
          {tables.map((table, index) => (
            <li key={index} className="mb-2">
              <strong>{table.tableName}</strong>
              <ul className="ml-4">
                {table.columns.map((col, colIndex) => (
                  <li key={colIndex}>
                    {col.columnName} ({col.columnType})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">لا توجد جداول لعرضها.</p>
      )}
    </div>
  );
};

export default FetchTables;
