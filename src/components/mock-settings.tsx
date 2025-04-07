'use client';

import Editor from '@monaco-editor/react';
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
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
import { cn } from '@/lib/utils';

const mockSettingsSchema = z.object({
  mockInterfaces: z.string().min(1, 'Interfaces is required.'),
  mockInterface: z.string().min(1, 'Mock Interface is required.'),
  mockSize: z.number().min(1, 'Mock size must be at least 1.').max(100, 'Mock size cannot exceed 100'),
  throttling: z.number().max(5000, 'API throttling cannot exceed 5000ms.')
});

type MockSettingsSchema = z.infer<typeof mockSettingsSchema>;

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

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['mock'],
    mutationFn: (value: MockSettingsSchema) =>
      fetch('/api/generate-mock', { method: 'POST', body: JSON.stringify(value) }).then((res) => res.json()),
    onSuccess: (value) => {
      setMock(value);
    }
  });

  const form = useForm({
    onSubmit({ value }) {
      toast.promise(async () => await mutateAsync(value), {
        loading: 'Generating mock endpoint...',
        success: 'Mock endpoint generated with success!'
      });
    },
    defaultValues: {
      mockInterfaces: '',
      mockInterface: '',
      mockSize: 10,
      throttling: 0
    },
    validators: {
      onChange: mockSettingsSchema
    }
  });

  const mockInterfaces = useStore(form.store, (form) => form.values.mockInterfaces);

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
          <form.Field name="mockInterfaces">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="mockInterfaces" className={cn(error && 'text-red-500')}>
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

          <form.Field name="mockInterface">
            {(field) => {
              const parsedInterfaces = [...mockInterfaces.matchAll(/interface\s+(\w+)/g)].map((match) => match[1]);
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="mockInterface" className={cn(error && 'text-red-500')}>
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

          <form.Field name="mockSize">
            {(field) => {
              const error = field.state.meta.errors[0]?.message;

              return (
                <div className="space-y-1.5">
                  <Label htmlFor="mockSize" className={cn(error && 'text-red-500')}>
                    Mock size (number of records)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="mockSize"
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
          <Button type="submit" className="w-full active:scale-95" disabled={isPending}>
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : 'Generate mock API'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
