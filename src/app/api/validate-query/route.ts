import { NextRequest, NextResponse } from 'next/server';
import { TempDatabase } from '@/lib/mockDb/db';

export async function POST(req: NextRequest) {
  try {
    const { query, seed, employeesCount, departmentsCount } = await req.json();

    // Only prevent system-level commands
    if (query.toLowerCase().includes('drop database') || 
        query.toLowerCase().includes('create database') ||
        query.toLowerCase().includes('alter database') ||
        query.toLowerCase().includes('truncate database')) {
      return NextResponse.json(
        { error: 'Invalid query: Database-level operations are not allowed' },
        { status: 400 }
      );
    }

    // Create temporary database and execute query
    const db = new TempDatabase(seed, employeesCount, departmentsCount);
    await db.initialize();

    try {
      const result = await db.executeQuery(query);
      return NextResponse.json(result);
    } finally {
      await db.cleanup();
    }
  } catch (error: any) {
    console.error('Query execution error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your query' },
      { status: 500 }
    );
  }
}