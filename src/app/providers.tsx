'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MockProvider } from '@/components/mock-context';

interface ProvidersProps {
  children: React.ReactNode;
}
const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <MockProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockProvider>
  );
}
