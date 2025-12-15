import { NextResponse } from 'next/server';
import { getGroupsDb } from '@/db/groupDb';
import { dbInit } from '@/db/AppDataSource';

export async function GET(): Promise<NextResponse> {
  try {
    await dbInit();
    const groups = await getGroupsDb();

    return NextResponse.json(groups, {
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/groups:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
