// src/providers/TanStackQueryProvider.tsx
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { JSX, ReactNode } from "react";

interface TanStackQueryProviderProps {
  children: ReactNode;
}

export function TanStackQueryProvider({
  children,
}: TanStackQueryProviderProps): JSX.Element {
  // Create a client with default settings and error handlers
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            retry: 1, // Only retry failed queries once
            staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // Cache garbage collection after 10 minutes
          },
          mutations: {
            retry: 1, // Only retry failed mutations once
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Global error handler for queries
            console.error(`Query error: ${error.message}`, query);
            // You could add a toast notification here
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // Global error handler for mutations
            console.error(`Mutation error: ${error.message}`);
            // You could add a toast notification here
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )} */}
    </QueryClientProvider>
  );
}
