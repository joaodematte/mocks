'use client';

import { InferSelectModel } from 'drizzle-orm';
import { createContext, useContext, useState } from 'react';

import { mock } from '@/lib/db/schema';

type Mock = InferSelectModel<typeof mock>;

interface MockPreviewContextType {
  mock: Mock | null;
  setMock: (mock: Mock | null) => void;
}

const MockPreviewContext = createContext<MockPreviewContextType | null>(null);

export function MockPreviewProvider({ children }: { children: React.ReactNode }) {
  const [mock, setMock] = useState<Mock | null>(null);

  return <MockPreviewContext.Provider value={{ mock, setMock }}>{children}</MockPreviewContext.Provider>;
}

export function useMockPreview() {
  const context = useContext(MockPreviewContext);

  if (!context) {
    throw new Error('useMockPreview must be used within a MockPreviewProvider');
  }

  return context;
}
