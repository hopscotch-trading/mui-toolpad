import Link from 'next/link';
import * as React from "react";
import { LinkProps } from "../shared/Link";

export const NextLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { href, history, shallow, ...rest } = props;
  return <Link ref={ref} href={href!} replace={history === 'replace'} shallow={shallow} {...rest} />
})