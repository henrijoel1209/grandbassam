import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { 
    name: 'Accueil', 
    href: '/', 
    icon: HomeIcon,
    allowedRoles: ['admin', 'finance_manager', 'recettes_agent', 'depenses_agent', 'viewer']
  },
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: ChartBarIcon,
    allowedRoles: ['admin', 'finance_manager', 'recettes_agent', 'depenses_agent']
  },
  { 
    name: 'Recettes', 
    href: '/recettes', 
    icon: ClipboardDocumentListIcon,
    allowedRoles: ['admin', 'finance_manager', 'recettes_agent']
  },
  { 
    name: 'Dépenses', 
    href: '/depenses', 
    icon: ClipboardDocumentListIcon,
    allowedRoles: ['admin', 'finance_manager', 'depenses_agent']
  },
  { 
    name: 'Fournisseurs', 
    href: '/fournisseurs', 
    icon: BuildingOfficeIcon,
    allowedRoles: ['admin', 'finance_manager']
  },
  { 
    name: 'Budget', 
    href: '/budget', 
    icon: CurrencyDollarIcon,
    allowedRoles: ['admin', 'finance_manager']
  },
];

const userNavigation = [
  { name: 'Mon Profil', href: '/profile', icon: UserCircleIcon },
  { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Déconnexion', href: '#', icon: ArrowRightOnRectangleIcon }
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.allowedRoles.includes(user.role)
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Grand-Bassam
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium',
                      isActive
                        ? 'border-b-2 border-green-500 text-gray-900'
                        : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            onClick={item.name === 'Déconnexion' ? logout : undefined}
                            className={cn(
                              active ? 'bg-gray-100' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Disclosure as="div" className="relative">
              {({ open, close }) => (
                <>
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Disclosure.Panel className="absolute top-full right-0 w-screen bg-white shadow-lg border-b border-gray-200">
                      <div className="space-y-1 px-4 pb-3 pt-2">
                        {filteredNavigation.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          return (
                            <Disclosure.Button
                              key={item.name}
                              as={Link}
                              to={item.href}
                              onClick={() => close()}
                              className={cn(
                                'block w-full text-left rounded-md px-3 py-2 text-base font-medium',
                                isActive
                                  ? 'bg-green-50 text-green-700'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center">
                                <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                                {item.name}
                              </div>
                            </Disclosure.Button>
                          );
                        })}
                        
                        <div className="border-t border-gray-200 pt-4">
                          {userNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Disclosure.Button
                                key={item.name}
                                as={Link}
                                to={item.href}
                                onClick={(e) => {
                                  close();
                                  if (item.name === 'Déconnexion') {
                                    e.preventDefault();
                                    logout();
                                  }
                                }}
                                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              >
                                <div className="flex items-center">
                                  <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
                                  {item.name}
                                </div>
                              </Disclosure.Button>
                            );
                          })}
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
