'use client';

import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

// --- THIS IS THE DEFINITIVE, CORRECTLY TYPED HOOK ---
export function useAuthenticatedQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'>
) {
  const { isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // The query is only enabled once the component has mounted on the client
  // AND the user is confirmed to be authenticated.
  const enabled = isClient && isAuthenticated;

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({ ...options, enabled });
}