'use client';

import { Copy } from 'lucide-react';

import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { EmptyPreview } from '@/components/empty-preview';
import { useMock } from '@/components/mock-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const createEndpoint = (id: string) => `${process.env.NEXT_PUBLIC_URL!}/api/${id}`;

const createUsageExampleString = (id: string) => `fetch("${createEndpoint(id)}")
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error))`;

export default function MockPreview() {
  const { mock } = useMock();

  let usageExample = '';
  let endpoint = '';
  let parsedData = '';

  if (mock) {
    usageExample = createUsageExampleString(mock.id);
    endpoint = createEndpoint(mock.id);
    parsedData = JSON.stringify(mock.content, null, 2);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated mock API</CardTitle>
        <CardDescription>Preview your mock data and get the API endpoint</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        {mock ? (
          <Tabs defaultValue="preview">
            <TabsList className="mb-2 w-full">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-6">
              <div className="space-y-1.5">
                <Label>JSON data preview</Label>
                <div className="flex gap-1">
                  <pre className="bg-muted max-h-84 w-full overflow-auto rounded-md border p-4">{parsedData}</pre>
                </div>
              </div>

              <CopyToClipboard toCopy={parsedData}>
                {({ copy, isCopying, hasCopied }) => (
                  <Button variant="outline" className="w-full" disabled={isCopying || hasCopied} onClick={copy}>
                    <Copy className="size-4" strokeWidth={2.5} /> Copy JSON data
                  </Button>
                )}
              </CopyToClipboard>
            </TabsContent>

            <TabsContent value="endpoint" className="space-y-6">
              <div className="space-y-1.5">
                <Label>Your mock API endpoint</Label>
                <div className="flex gap-1">
                  <Input value={endpoint} readOnly />
                  <CopyToClipboard toCopy={endpoint}>
                    {({ copy, isCopying, hasCopied }) => (
                      <Button size="icon" variant="outline" disabled={isCopying || hasCopied} onClick={copy}>
                        <Copy className="size-4" strokeWidth={2.5} />
                      </Button>
                    )}
                  </CopyToClipboard>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Response time</Label>

                <p className="text-muted-foreground text-sm">
                  {mock.throttling
                    ? `datas will be delayed by ${mock.throttling}ms to simulate real-world conditions`
                    : 'Responses will not be delayed'}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Usage example</Label>

                <pre className="bg-muted relative overflow-auto rounded-md border p-4">{usageExample}</pre>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyPreview />
        )}
      </CardContent>
    </Card>
  );
}
