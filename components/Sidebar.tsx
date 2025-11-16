import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ContractIcon } from './icons/ContractIcon';
import { User, UserRole } from '../types';

// Create MapIcon if it doesn't exist
const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, currentUser }) => {
  const isStaff = currentUser.role !== UserRole.Client;

  const staffNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'daire-assistant', label: 'Daire Assistant', icon: MapIcon }, // NEW
    { id: 'content-studio', label: 'Content Studio', icon: DocumentTextIcon },
    { id: 'market-intelligence', label: 'Market Intelligence', icon: ChartBarIcon },
    { id: 'clients', label: 'Client Registry', icon: UsersIcon },
    { id: 'contracts', label: 'Contracts', icon: ContractIcon, roles: [UserRole.Owner, UserRole.Admin] },
    { id: 'master-prompts', label: 'Master Prompts', icon: BookmarkIcon, roles: [UserRole.Owner, UserRole.Admin] },
  ];

  const navItems = isStaff
    ? staffNavItems.filter(item => !item.roles || item.roles.includes(currentUser.role))
    : [];

  return (
    <aside className="bg-brand-primary w-20 sm:w-64 flex-shrink-0 flex flex-col items-center sm:items-stretch border-r border-brand-accent">
      <nav className="p-4 space-y-3 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors ${
              currentView === item.id
                ? 'bg-brand-accent text-brand-text font-bold'
                : 'text-brand-light hover:bg-brand-secondary hover:text-brand-text'
            }`}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;