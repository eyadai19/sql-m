import { Pool } from 'pg';
import { DUMMY_DEPARTMENTS_TABLE, DUMMY_EMPLOYEES_TABLE } from '@/utils/dummyData';
import getDummyDataSubset from '@/utils/getDummyDataSubset';

export class TempDatabase {
  private pool: Pool;
  private seed: string;
  private employeesCount: number;
  private departmentsCount: number;

  constructor(seed: string, employeesCount: number, departmentsCount: number) {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB,
    });
    this.seed = seed;
    this.employeesCount = employeesCount;
    this.departmentsCount = departmentsCount;
  }

  async initialize() {
    const client = await this.pool.connect();
    try {
      // Create temporary tables
      await client.query(`
        CREATE TEMP TABLE employees (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100),
          position VARCHAR(100),
          department_id INTEGER,
          salary INTEGER,
          date_hired DATE
        );

        CREATE TEMP TABLE departments (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100),
          manager VARCHAR(100),
          budget INTEGER,
          location VARCHAR(100)
        );
      `);

      // Get subsets of dummy data
      const employees = getDummyDataSubset(DUMMY_EMPLOYEES_TABLE.rows, this.seed, this.employeesCount);
      const departments = getDummyDataSubset(DUMMY_DEPARTMENTS_TABLE.rows, this.seed, this.departmentsCount);

      // Insert data into temporary tables
      for (const emp of employees) {
        await client.query(
          'INSERT INTO employees (id, name, position, department_id, salary, date_hired) VALUES ($1, $2, $3, $4, $5, $6)',
          [emp.id, emp.name, emp.position, emp.department_id, emp.salary, emp.date_hired]
        );
      }

      for (const dept of departments) {
        await client.query(
          'INSERT INTO departments (id, name, manager, budget, location) VALUES ($1, $2, $3, $4, $5)',
          [dept.id, dept.name, dept.manager, dept.budget, dept.location]
        );
      }
    } finally {
      client.release();
    }
  }

  async executeQuery(query: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query);
      return {
        columns: result.fields.map(field => field.name),
        rows: result.rows.map(row => Object.values(row))
      };
    } finally {
      client.release();
    }
  }

  async cleanup() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
      `);
    } finally {
      client.release();
      await this.pool.end();
    }
  }
}