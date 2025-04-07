import type { Metadata } from 'next';
import { Geist_Mono, Lexend_Deca } from 'next/font/google';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import { Toaster } from '@/components/ui/sonner';
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
  title: 'mocks',
  description: 'Generate mock APIs from TypeScript interfaces to unblock your frontend development',
  twitter: {
    site: '@joaodematte',
    creator: '@joaodematte',
    card: 'summary_large_image',
    title: 'mocks',
    description: 'Generate mock APIs from TypeScript interfaces to unblock your frontend development',
    images: ['/metaimage.png']
  },
  openGraph: {
    title: 'mocks',
    description: 'Generate mock APIs from TypeScript interfaces to unblock your frontend development',
    siteName: 'joão dematte',
    url: 'https://joaodematte.com/',
    type: 'website',
    images: ['/metaimage.png']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(fontSans.variable, fontMono.variable, 'min-h-dvh w-full px-4 py-12 font-sans antialiased')}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
