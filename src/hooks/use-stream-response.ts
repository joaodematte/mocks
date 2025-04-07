import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export function useStreamResponse<T>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [responses, setResponses] = useState<string>('');
  const [data, setData] = useState<string>('');

  const { mutate: startStream, mutateAsync: startStreamAsync } = useMutation({
    mutationFn: async (value: T) => {
      const res = await fetch('/api/generate-mock', {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.body) {
        throw new Error('Readable not supported');
      }

      const reader = res.body.getReader();

      return reader;
    },
    onSuccess: (reader) => {
      setLoading(true);

      async function read() {
        const { done, value } = await reader.read();

        if (done) {
          setLoading(false);
          return;
        }

        const text = new TextDecoder('utf-8').decode(value);

        if (text.includes('END STREAM')) {
          setData(JSON.parse(text.replace(/.*END STREAM/, '')));
        } else {
          setResponses((responses) => responses + text);
        }

        read();
      }

      read();
    }
  });

  return {
    startStream,
    startStreamAsync,
    data,
    responses,
    loading
  };
}
