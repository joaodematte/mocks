import type { Metadata } from 'next';
import { Geist_Mono, Lexend_Deca } from 'next/font/google';

import '@/styles/globals.css';

import { cn } from '@/lib/utils';

const fontSans = Lexend_Deca({
  variable: '--font-sans',
  subsets: ['latin']
});

const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'mocks'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontSans.variable, fontMono.variable, 'min-h-dvh w-full px-4 py-12 font-sans antialiased')}>
        {children}
      </body>
    </html>
  );
}
