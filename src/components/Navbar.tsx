import Link from 'next/link';
import { ReactNode } from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            🏪 소상공인 트래커
          </Link>

          <div className="flex items-center space-x-4">
            <NavLink href="/">홈</NavLink>
            <NavLink href="/businesses">소상공인 목록</NavLink>
            <NavLink href="/new">신규 등록</NavLink>
            <NavLink href="/admin">어드민</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}
