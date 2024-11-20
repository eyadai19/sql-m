import { DUMMY_EMPLOYEES_TABLE } from './dummyData';
import getDummyDataSubset from "@/utils/getDummyDataSubset";
import { EmployeeRow } from './dummyData';

interface EmployeeTableData {
  columns: string[];
  rows: Array<Record<string, unknown>>;
}

interface ExplanationParams {
    howItWorks: string;
    syntax: string;
    example: {
      code: string;
      explanation: string;
    };
    notes: string[];
    reference: string;
  }
  
  interface ExerciseParams {
    prompt: string;
    tips: string;
    initialColumns: string[];
    initialRows: ()=>EmployeeRow[],
    difficulty: string;
    reference: string;
    answer: string;
    userExcerciseAnswerAction: (
      input: {
        trials: number;
        is_show_ans: boolean;
        time: number;
      }
    ) => Promise<string | undefined>; // Returns a string or undefined
  }
  
  interface SelectParams {
    //exerciseParams: ExerciseParams;
    explanationParams: ExplanationParams;
  }
  
  interface PageData {
    select: SelectParams;
  }
  
 // Updated PAGE_DATA
const PAGE_DATA: PageData = {
    select: {
      explanationParams: {
        howItWorks: "The SELECT statement retrieves specific data from a database table.",
        syntax: `SELECT column1, column2, ... FROM table_name WHERE condition;`,
        example: {
          code: `SELECT id, name FROM employees WHERE salary > 50000;`,
          explanation: "This retrieves the id and name of employees earning over $50,000.",
        },
        notes: [
          "The WHERE clause filters rows based on a condition.",
          "Column names should match those defined in the database schema.",
          "Always sanitize inputs to prevent SQL injection in real-world scenarios.",
        ],
        reference: "W3Schools SQL Tutorial (https://www.w3schools.com/sql/sql_select.asp)",
      },
    },
  };
  
  export default PAGE_DATA;