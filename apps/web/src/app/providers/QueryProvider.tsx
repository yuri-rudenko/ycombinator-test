"use client";

import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { useState } from "react";
import {toast} from 'sonner'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined) return

            toast.error(`Error: ${error.message}`)
            console.error('Global Query Error:', error)
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
