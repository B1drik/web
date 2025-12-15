import { NextResponse, type NextRequest } from 'next/server';
import { getStudentsDb, addStudentDb } from '@/db/studentDb';
import { dbInit } from '@/db/AppDataSource';

export async function GET(): Promise<NextResponse> {
  try {
    await dbInit();
    const students = await getStudentsDb();

    return NextResponse.json(students, {
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/students GET:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbInit();
    const student = await req.json();
    delete student['id'];
    const newStudent = await addStudentDb(student);

    console.log(newStudent);
    return NextResponse.json(newStudent, {
      status: 201,
    });
  } catch (error) {
    console.error('Error in /api/students POST:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
};
