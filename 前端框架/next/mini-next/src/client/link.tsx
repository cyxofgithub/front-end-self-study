/**
 * <Link>（对应 next/link）。
 * 渲染成普通 <a href>（保证 SSR 输出可点击、SEO 友好、可右键新标签打开），
 * 仅在「普通左键点击」时 preventDefault，改走客户端导航。
 */
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useRouter } from './router';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export function Link({ href, children, onClick, ...rest }: LinkProps): ReactNode {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    // 服务端渲染时 router 为 null；修饰键（新标签打开等）放行默认行为
    if (!router || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} {...rest} onClick={handleClick}>
      {children}
    </a>
  );
}
