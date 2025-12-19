'use client';

import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

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

  const enabled = isClient && isAuthenticated;

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({ ...options, enabled });
}