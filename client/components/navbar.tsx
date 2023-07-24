'use client';
import { useCurrentUser } from '@/app/current-user-context';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function NavBar() {
  const currentUser = useCurrentUser();

  const links = [
    !currentUser && { href: '/auth/signup', label: 'Sign Up' },
    !currentUser && { href: '/auth/signin', label: 'Sign In' },
    currentUser && { href: '/auth/signout', label: 'Sign Out' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ href, label }: any) => {
      return (
        <Link
          href={href}
          key={href}
          className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          {label}
        </Link>
      );
    });

  return (
    <div>
      <nav className="bg-white dark:bg-gray-800  shadow ">
        <div className="px-8 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className=" flex items-center">
              <a className="flex-shrink-0" href="/">
                <Image
                  className="w-8 h-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                  width={32}
                  height={32}
                />
              </a>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10 space-x-4">
                  {links}
                </div>
              </div>
            </div>
            <div className="block">
              <div className="flex items-center ml-4 md:ml-6"></div>
            </div>
            <div className="flex -mr-2 md:hidden">
              <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="w-8 h-8"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <Link href="/tickets" className="text-blue-200">
          Create Ticket
        </Link>

        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{links}</div>
        </div>
      </nav>
    </div>
  );
}
