import { asArray } from '@toolpad/utils/collections';
import { useRouter } from 'next/router';
import * as React from 'react';
import type { AppProviderProps, Navigate, Router } from '../AppProvider';
import { AppProvider } from '../AppProvider';
import { NextLink } from './NextLink';

/**
 * @ignore - internal component.
 */
export function NextAppProviderPages(props: AppProviderProps) {
  const { push, replace, asPath, query } = useRouter();

  const search = React.useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      asArray(value ?? []).forEach((v) => {
        params.append(key, v);
      });
    });
    return params.toString();
  }, [query]);

  // Stable search params object
  const searchParams = React.useMemo(() => new URLSearchParams(search), [search]);

  const navigate = React.useCallback<Navigate>(
    (url, { history = 'auto', shallow } = {}) => {
      if (history === 'auto' || history === 'push') {
        return push(String(url), undefined, {shallow});
      }
      if (history === 'replace') {
        return replace(String(url), undefined, {shallow});
      }
      throw new Error(`Invalid history option: ${history}`);
    },
    [push, replace],
  );

  const routerImpl = React.useMemo<Router>(
    () => ({
      pathname: asPath?.split('?')[0],
      searchParams,
      navigate,
      Link: NextLink
    }),
    [asPath, navigate, searchParams],
  );

  return <AppProvider router={routerImpl} {...props} />;
}
