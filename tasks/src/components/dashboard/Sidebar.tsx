'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Team', href: '/dashboard/team', icon: UserGroupIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-6 w-6
                  ${
                    isActive
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}