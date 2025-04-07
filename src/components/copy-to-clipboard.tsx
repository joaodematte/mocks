import { Check } from 'lucide-react';
import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CopyToClipboardProps {
  children: (props: { copy: () => Promise<void>; isCopying: boolean; hasCopied: boolean }) => React.ReactNode;
  toCopy: string;
}

export function CopyToClipboard({ children, toCopy }: CopyToClipboardProps) {
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const copy = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(toCopy);
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
