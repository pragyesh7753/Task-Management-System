'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/src/lib/auth';
import { tokenStorage } from '@/src/lib/tokenStorage';
import type { User } from '@/src/types/auth';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user] = useState<User | null>(() => tokenStorage.getUser());
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const initials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Task Manager</h1>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 rounded-full px-3 py-1.5 transition-all hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md">
                {initials(user?.name)}
              </div>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {`Welcome, ${user?.name?.trim().split(' ')[0] || 'User'}`}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
              >
                <div className="px-4 py-3 text-sm bg-slate-50">
                  <p className="truncate font-semibold text-slate-900">{user?.name ?? 'User'}</p>
                  {user?.email && (
                    <p className="truncate text-slate-500 text-xs mt-0.5">{user.email}</p>
                  )}
                </div>
                <div className="border-t border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
