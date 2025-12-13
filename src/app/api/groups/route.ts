import { getGroupsDb } from '@/db/groupDb';
import { dbInit } from '@/db/AppDataSource';

export async function GET(): Promise<Response> {
  await dbInit();
  const groups = await getGroupsDb();

  return new Response(JSON.stringify(groups), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
