'use client';

import Editor from '@monaco-editor/react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { InferSelectModel } from 'drizzle-orm';
import { CircleAlert, LoaderCircle, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMock } from '@/components/mock-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { mock } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const mockSettingsSchema = z.object({
  interfaces: z.string().min(1, 'Interfaces is required.'),
  targetInterface: z.string().min(1, 'Mock Interface is required.'),
  size: z.number().min(1, 'Mock size must be at least 1.').max(100, 'Mock size cannot exceed 100'),
  throttling: z.number().max(5000, 'API throttling cannot exceed 5000ms.')
});

type GenerateMockSchema = z.infer<typeof mockSettingsSchema>;
type SaveMockSchema = z.infer<typeof mockSettingsSchema> & {
  content: string;
};

function LoadingMonacoEditor() {
  return (
    <div className="h-full w-full space-y-1">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
    </div>
  );
}

export default function MockSettings() {
  const { setMock } = useMock();

  const { mutateAsync: persistMock, isPending: isPersistMockPending } = useMutation({
    mutationFn: (value: SaveMockSchema): Promise<InferSelectModel<typeof mock>> =>
      fetch('/api/persist-mock', { method: 'POST', body: JSON.stringify(value) }).then((res) => res.json())
  });

  const { mutateAsync: generateMock, isPending: isGenerateMockPending } = useMutation({
    mutationKey: ['mock'],
    mutationFn: (value: GenerateMockSchema): Promise<SaveMockSchema> =>
      fetch('/api/generate-mock', { method: 'POST', body: JSON.stringify(value) })
        .then((res) => res.json())
        .then((content) => ({ ...value, content: JSON.stringify(content) })),
    onSuccess: async (data) => {
      const savedMock = await persistMock(data);

      setMock(savedMock);
    }
  });

  const form = useForm({
    onSubmit({ value }) {
      toast.promise(async () => await generateMock(value), {
        loading: 'Generating mock endpoint...',
        success: 'Mock endpoint generated with success!'
      });
    },
    defaultValues: {
      interfaces: '',
      targetInterface: '',
      size: 10,
      throttling: 0
    },
    validators: {
      onSubmit: mockSettingsSchema
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Define your mock API</CardTitle>
          <CardDescription>Enter your TypeScript interface, set the size and throttling options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.Field name="interfaces">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="interfaces" className={cn(error && 'text-red-500')}>
                    Define your Interfaces
                  </Label>
                  <Editor
                    height="15rem"
                    defaultLanguage="typescript"
                    language="typescript"
                    value={field.state.value}
                    onChange={(value) => value && field.handleChange(value)}
                    loading={<LoadingMonacoEditor />}
                    options={{
                      fontFamily: 'Geist Mono',
                      fontWeight: '500',
                      lineHeight: 1.7,
                      scrollbar: {
                        horizontal: 'auto',
                        verticalScrollbarSize: 0
                      },
                      minimap: {
                        enabled: false
                      }
                    }}
                  />
                  {error && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <CircleAlert className="size-4" />
                      {error}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.interfaces}>
            {(interfaces) => (
              <form.Field name="targetInterface">
                {(field) => {
                  const parsedInterfaces = [...interfaces.matchAll(/(?:interface|type|enum)\s+(\w+)/g)].map(
                    (match) => match[1]
                  );
                  const error = field.state.meta.errors[0]?.message;

                  return (
                    <div className="space-y-1.5">
                      <Label htmlFor="targetInterface" className={cn(error && 'text-red-500')}>
                        Mock Interface
                      </Label>
                      <Combobox
                        data={parsedInterfaces.map((item) => ({ value: item, label: item }))}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        title="Interface"
                      />

                      {error && (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <CircleAlert className="size-4" />
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            )}
          </form.Subscribe>

          <form.Field name="size">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="size" className={cn(error && 'text-red-500')}>
                    Mock size (number of records)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="size"
                      type="number"
                      className="w-24"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.state.value]}
                      onValueChange={(value) => field.handleChange(value[0])}
                    />
                  </div>

                  {error && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <CircleAlert className="size-4" />
                      {error}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="throttling">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="throttling">
                    API Throttling (ms) <span className="text-muted-foreground">— {field.state.value}ms</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Sliders className="text-muted-foreground size-4" strokeWidth={2.5} />
                    <Slider
                      min={0}
                      max={5000}
                      step={50}
                      name={field.name}
                      value={[field.state.value]}
                      onValueChange={(value) => field.handleChange(value[0])}
                    />
                  </div>

                  {error && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <CircleAlert className="size-4" />
                      {error}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full active:scale-95"
            disabled={isGenerateMockPending || isPersistMockPending}
          >
            {isGenerateMockPending || isPersistMockPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              'Generate mock API'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
