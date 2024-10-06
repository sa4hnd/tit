'use client'; // Error components must be Client Components

import { AlertCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className='bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900'>
        <div className='flex min-h-screen flex-col items-center justify-center text-center text-white'>
          <AlertCircle size={60} className='animate-pulse text-red-500' />
          <h1 className='mt-8 text-4xl md:text-6xl font-bold'>
            Oops, something went wrong!
          </h1>
          <Button onClick={reset} className='mt-4'>
            Try again
          </Button>
        </div>
      </section>
    </main>
  );
}
