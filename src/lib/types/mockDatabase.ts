export interface DatabaseRow {
    id: number;
    [key: string]: any;
  }
  
  export interface TableSnapshot {
    rows: DatabaseRow[];
    fields: { name: string }[];
  }
  
  export interface TablesSnapshot {
    employees: TableSnapshot;
    departments: TableSnapshot;
  }
  
  export type OperationType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  
  export interface QueryOperation {
    type: OperationType;
    rowCount: number;
  }
  
  export interface QueryResult {
    columns: string[];
    rows: (string | number)[][];
    operation: QueryOperation;
    successMessage?: string;
  }