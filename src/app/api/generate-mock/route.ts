import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

import { db } from '@/lib/db';
import { mock } from '@/lib/db/schema';

interface RequestData {
  mockInterfaces: string;
  mockInterface: string;
  mockSize: number;
  throttling?: number;
}

const prompt = (mockInterfaces: string, mockInterface: string, size: number) => `
You are a TypeScript mock data generator. Your task is to create realistic mock data based on the provided TypeScript interfaces, formatted as a JSON array suitable for a REST API endpoint.

Guidelines for mock generation:
1. Generate ${size} mock objects that strictly follow the TypeScript interface structure
2. Use realistic values that match the property types
3. For string fields, use meaningful text that represents real-world data
4. For number fields, use reasonable ranges based on the context
5. For boolean fields, use a mix of true and false values
6. For nested objects, maintain the same structure as defined in the interfaces
7. For arrays, include 2-5 items unless specified otherwise
8. For dates, use recent dates in ISO format (e.g., "2024-03-20T12:00:00Z")
9. For enums, use valid enum values
10. For optional fields, sometimes include them and sometimes omit them
11. All property names should be in camelCase
12. Ensure all values are valid JSON (no undefined, use null instead)

Available interfaces for context:
\`\`\`typescript
${mockInterfaces}
\`\`\`

Interface to generate mocks for:
\`\`\`typescript
${mockInterface}
\`\`\`

Your response should be a valid JSON array containing ${size} mock objects. The response should be ready to be used as a REST API endpoint response. Do not include any explanations or additional text - just the JSON array.

Example format:
[
  {
    "id": "1",
    "name": "Example Item",
    "isActive": true,
    "createdAt": "2024-03-20T12:00:00Z"
  },
  ...
]
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body as RequestData;

    const promptMessage = prompt(data.mockInterfaces, data.mockInterface, data.mockSize);

    const { text: generatedJsonMock } = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates TypeScript mock data in JSON format.'
        },
        {
          role: 'user',
          content: promptMessage
        }
      ]
    });

    const dbData = await db
      .insert(mock)
      .values({
        data: generatedJsonMock,
        mockInterfaces: data.mockInterfaces,
        mockInterface: data.mockInterface,
        mockSize: data.mockSize,
        throttling: data.throttling
      })
      .returning();

    if (dbData.length === 0) {
      return Response.json({ error: 'Failed to generate mocks' }, { status: 500 });
    }

    return Response.json(dbData[0], { status: 201 });
  } catch (error) {
    console.error('Error generating mocks:', error);
    return Response.json({ error: 'Failed to generate mocks' }, { status: 500 });
  }
}
