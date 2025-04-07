'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { MockProvider } from '@/components/mock-context';

interface ProvidersProps {
  children: React.ReactNode;
}
const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <MockProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MockProvider>
    </ThemeProvider>
  );
}
