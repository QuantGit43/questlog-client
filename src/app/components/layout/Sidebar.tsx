'use client'; 

import Link from 'next/link';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className="block p-2 rounded hover:bg-gray-700">
              Dashboard (Завдання)
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/profile" className="block p-2 rounded hover:bg-gray-700">
              Профіль
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/shop" className="block p-2 rounded hover:bg-gray-700">
              Магазин
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};