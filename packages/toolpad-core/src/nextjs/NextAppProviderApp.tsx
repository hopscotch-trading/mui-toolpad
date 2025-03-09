import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import type { AppProviderProps, Navigate, Router } from '../AppProvider';
import { AppProvider } from '../AppProvider';
import { NextLink } from './NextLink';

/**
 * @ignore - internal component.
 */
export function NextAppProviderApp(props: AppProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push, replace } = useRouter();

  const navigate = React.useCallback<Navigate>(
    (url, { history = 'auto' } = {}) => {
      if (history === 'auto' || history === 'push') {
        return push(String(url));
      }
      if (history === 'replace') {
        return replace(String(url));
      }
      throw new Error(`Invalid history option: ${history}`);
    },
    [push, replace],
  );

  const routerImpl = React.useMemo<Router>(
    () => ({
      pathname: pathname.split('?')[0],
      searchParams,
      navigate,
      Link: NextLink
    }),
    [pathname, navigate, searchParams],
  );

  return <AppProvider router={routerImpl} {...props} />;
}
