import { Drama } from 'lucide-react';

import MockPreview from '@/components/mock-preview';
import MockSettings from '@/components/mock-settings';

export default async function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="flex items-center justify-center gap-2 text-4xl font-bold tracking-tight">
          <Drama className="size-8" />
          mocks
        </h1>
        <p className="text-muted-foreground mt-[1ch]">
          Generate mock APIs from TypeScript interfaces to unblock your frontend development
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MockSettings />

        <MockPreview />
      </div>
    </div>
  );
}
