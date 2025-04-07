'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const jsonData = `[
  {
    "id": 1,
    "name": "User 1",
    "email": "user1@example.com",
    "role": "admin",
    "createdAt": "2025-04-03T18:14:19.334Z"
  },
  {
    "id": 2,
    "name": "User 2",
    "email": "user2@example.com",
    "role": "user",
    "createdAt": "2025-02-22T02:33:21.869Z"
  },
  {
    "id": 3,
    "name": "User 3",
    "email": "user3@example.com",
    "role": "user",
    "createdAt": "2025-03-15T15:10:09.392Z"
  },
  {
    "id": 4,
    "name": "User 4",
    "email": "user4@example.com",
    "role": "user",
    "createdAt": "2025-01-11T04:58:57.660Z"
  },
  {
    "id": 5,
    "name": "User 5",
    "email": "user5@example.com",
    "role": "user",
    "createdAt": "2025-02-27T17:09:23.936Z"
  },
  {
    "id": 6,
    "name": "User 6",
    "email": "user6@example.com",
    "role": "admin",
    "createdAt": "2025-02-24T01:33:24.267Z"
  },
  {
    "id": 7,
    "name": "User 7",
    "email": "user7@example.com",
    "role": "user",
    "createdAt": "2025-02-12T20:20:41.349Z"
  },
  {
    "id": 8,
    "name": "User 8",
    "email": "user8@example.com",
    "role": "user",
    "createdAt": "2025-01-29T05:55:50.472Z"
  },
  {
    "id": 9,
    "name": "User 9",
    "email": "user9@example.com",
    "role": "user",
    "createdAt": "2025-03-26T23:26:23.186Z"
  },
  {
    "id": 10,
    "name": "User 10",
    "email": "user10@example.com",
    "role": "user",
    "createdAt": "2025-03-07T22:20:18.345Z"
  }
]`;

const usageExampleData = `fetch("https://api.mocky.dev/v3/wqptvrwrk0i73rk00oeysr")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))`;

// This component is reused and improves performance by avoiding repeated state logic
interface CopyToClipboardProps {
  children: (props: { copy: () => Promise<void>; isCopying: boolean; hasCopied: boolean }) => React.ReactNode;
  textToCopy: string;
}

function CopyToClipboard({ children, textToCopy }: CopyToClipboardProps) {
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const copy = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(textToCopy);
      setHasCopied(true);
      setIsCopying(false);

      setTimeout(() => {
        setHasCopied(false);
      }, 2500);
    } catch (err) {
      console.error('Error copying to the clipboard: ', err);

      setIsCopying(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={hasCopied}>
        <TooltipTrigger asChild>{children({ copy, isCopying, hasCopied })}</TooltipTrigger>
        <TooltipContent className="flex items-center gap-1">
          <Check className="size-4" />
          Copied to clipboard
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function MockPreview() {
  const endpoint = 'https://api.mocks.dev/v1/5qgc85n6fewfg4xmo5dzms';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated mock API</CardTitle>
        <CardDescription>Preview your mock data and get the API endpoint</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <div className="space-y-1.5">
              <Label>JSON data preview</Label>
              <div className="flex gap-1">
                <pre className="bg-muted max-h-84 w-full overflow-auto rounded-md border p-4">{jsonData}</pre>
              </div>
            </div>

            <CopyToClipboard textToCopy={jsonData}>
              {({ copy, isCopying }) => (
                <Button variant="outline" className="w-full" disabled={isCopying} onClick={copy}>
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
                <CopyToClipboard textToCopy={endpoint}>
                  {({ copy, isCopying }) => (
                    <Button size="icon" variant="outline" disabled={isCopying} onClick={copy}>
                      <Copy className="size-4" strokeWidth={2.5} />
                    </Button>
                  )}
                </CopyToClipboard>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Response time</Label>

              <p className="text-muted-foreground text-sm">
                Responses will be delayed by 350ms to simulate real-world conditions
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Usage example</Label>

              <pre className="bg-muted overflow-hidden rounded-md border p-4">{usageExampleData}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
