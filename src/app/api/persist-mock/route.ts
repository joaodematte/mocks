import { z } from 'zod';

import { db } from '@/lib/db';
import { mock } from '@/lib/db/schema';

const RequestDataSchema = z.object({
  content: z.string(),
  interfaces: z.string(),
  targetInterface: z.string(),
  size: z.number().positive().int(),
  throttling: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = RequestDataSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
    }

    const data = result.data;

    const dbData = await db
      .insert(mock)
      .values({
        content: data.content,
        interfaces: data.interfaces,
        targetInterface: data.targetInterface,
        size: data.size,
        throttling: data.throttling
      })
      .returning();

    if (dbData.length === 0) {
      return Response.json({ error: 'Failed to persist mock' }, { status: 500 });
    }

    return Response.json(dbData[0], { status: 201 });
  } catch (error) {
    console.error('Error generating mocks:', error);
    return Response.json({ error: 'Failed to persist mock' }, { status: 500 });
  }
}
