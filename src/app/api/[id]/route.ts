import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { mock } from '@/lib/db/schema';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;

  const exists = await db.select().from(mock).limit(1).where(eq(mock.id, id));

  if (!exists || exists.length === 0) {
    return Response.json({ error: 'Failed to get requested mock' }, { status: 404 });
  }

  const result = exists[0];

  if (result.throttling && result.throttling > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, result.throttling || 0);
    });
  }

  return Response.json(result.content, { status: 200 });
}
