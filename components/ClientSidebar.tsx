import React from 'react';
import { ClientView } from '../types';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { MortgageIcon } from './icons/MortgageIcon';
import { VaultIcon } from './icons/VaultIcon';

// Add MapIcon
const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

interface ClientSidebarProps {
  currentView: ClientView;
  setCurrentView: (view: ClientView) => void;
}

const navItems = [
    { id: ClientView.AI, label: 'Ask AI Assistant', icon: ChatBubbleIcon },
    { id: ClientView.MapAssistant, label: 'Map Assistant', icon: MapIcon }, // NEW
    { id: ClientView.Listings, label: 'My Listings', icon: BuildingIcon },
    { id: ClientView.Mortgage, label: 'Mortgage Calculator', icon: MortgageIcon },
    { id: ClientView.Vault, label: 'My Vault', icon: VaultIcon },
];

const ClientSidebar: React.FC<ClientSidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="bg-brand-secondary w-20 sm:w-72 flex-shrink-0 flex flex-col items-center sm:items-stretch border-r border-brand-accent">
      <nav className="p-4 space-y-3 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-4 p-3 rounded-lg w-full transition-colors ${
              currentView === item.id
                ? 'bg-brand-accent text-brand-text font-bold'
                : 'text-brand-light hover:bg-brand-primary/50 hover:text-brand-text'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default ClientSidebar;