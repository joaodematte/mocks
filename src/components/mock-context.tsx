'use client';

import { InferSelectModel } from 'drizzle-orm';
import { createContext, useContext, useState } from 'react';

import { mock } from '@/lib/db/schema';

type Mock = InferSelectModel<typeof mock>;

interface MockContextType {
  mock: Mock | null;
  setMock: (mock: Mock | null) => void;
}

const MockContext = createContext<MockContextType | null>(null);

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [mock, setMock] = useState<Mock | null>(null);

  return <MockContext.Provider value={{ mock, setMock }}>{children}</MockContext.Provider>;
}

export function useMock() {
  const context = useContext(MockContext);

  if (!context) {
    throw new Error('useMock must be used within a MockProvider');
  }

  return context;
}
