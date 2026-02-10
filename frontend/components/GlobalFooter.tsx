import React from 'react';
import Link from 'next/link';

export const GlobalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { label: 'Tasks', href: '/tasks' },
    { label: 'Profile', href: '/profile' },
  ];

  const infoLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">TaskFlow</h3>
            <p className="text-sm text-gray-600">
              Manage your tasks efficiently and stay organized.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Information</h4>
            <nav className="flex flex-col gap-2">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
