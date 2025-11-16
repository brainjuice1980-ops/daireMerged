import React, { useState } from 'react';
import { User, UserRole } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContentStudio from './components/ContentStudio';
import MarketIntelligence from './components/MarketIntelligence';
import Clients from './components/Clients';
import Contracts from './components/Contracts';
import MasterPrompts from './components/MasterPrompts';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import ClientOTPLogin from './components/ClientOTPLogin';
import UnifiedLogin from './components/UnifiedLogin';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import StaffRegister from './components/StaffRegister';
import DaireAssistant from './DaireAssistant'; // NEW IMPORT

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showStaffRegister, setShowStaffRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleShowSignup = () => {
    setShowSignup(true);
  };

  const handleShowStaffRegister = () => {
    setShowStaffRegister(true);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
  };

  const handleStaffLoginSuccess = (userId: string, email: string, requiresChange: boolean, name?: string, role?: string) => {
    const displayName = name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    const userRole = (role as UserRole) || UserRole.Admin;

    const staffUser: User = {
      id: userId,
      name: displayName,
      email,
      role: userRole,
      avatar: displayName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2),
    };
    setCurrentUser(staffUser);
    setShowLogin(false);
    setShowStaffRegister(false);

    if (requiresChange) {
      setRequiresPasswordChange(true);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setRequiresPasswordChange(false);
    setIsLoggedIn(true);
  };

  const handleClientLoginSuccess = async (userId: string, email: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/client_profiles?user_id=eq.${userId}&select=*`,
        {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      const data = await response.json();
      let displayName = email.split('@')[0];
      let avatar = displayName.substring(0, 2).toUpperCase();

      if (data && data[0]) {
        const profile = data[0];
        displayName = `${profile.first_name} ${profile.last_name}`;
        avatar = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
      }

      const clientUser: User = {
        id: userId,
        name: displayName,
        email,
        role: UserRole.Client,
        avatar: avatar,
      };
      setCurrentUser(clientUser);
      setIsLoggedIn(true);
      setShowLogin(false);
      setShowSignup(false);
    } catch (error) {
      console.error('Error loading client profile:', error);
      const namePart = email.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const clientUser: User = {
        id: userId,
        name: displayName,
        email,
        role: UserRole.Client,
        avatar: displayName.substring(0, 2).toUpperCase(),
      };
      setCurrentUser(clientUser);
      setIsLoggedIn(true);
      setShowLogin(false);
      setShowSignup(false);
    }
  };
  
  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.Client) {
        // Clients have a dedicated view, no sidebar navigation
    } else {
        // Default to dashboard for staff
        setCurrentView('dashboard');
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setShowLogin(false);
    setShowSignup(false);
    setShowStaffRegister(false);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'daire-assistant':  // NEW CASE
        return <DaireAssistant />;
      case 'content-studio':
        return <ContentStudio currentUser={currentUser} />;
      case 'market-intelligence':
        return <MarketIntelligence />;
      case 'clients':
        return <Clients currentUser={currentUser} />;
      case 'contracts':
        if (currentUser.role !== UserRole.Owner && currentUser.role !== UserRole.Admin) {
          return <Dashboard currentUser={currentUser} />;
        }
        return <Contracts currentUser={currentUser} />;
      case 'master-prompts':
        if (currentUser.role !== UserRole.Owner && currentUser.role !== UserRole.Admin) {
          return <Dashboard currentUser={currentUser} />;
        }
        return <MasterPrompts />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  if (requiresPasswordChange && currentUser) {
    return (
      <ChangePassword
        userId={currentUser.id}
        email={currentUser.email}
        isForced={true}
        onSuccess={handlePasswordChangeSuccess}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => {
          setShowForgotPassword(false);
          setShowLogin(true);
        }}
        onSuccess={() => {
          setShowForgotPassword(false);
          setShowLogin(true);
        }}
      />
    );
  }

  if (showSignup) {
    return (
      <ClientOTPLogin
        onSuccess={handleClientLoginSuccess}
        onBack={() => setShowSignup(false)}
      />
    );
  }

  if (showStaffRegister) {
    return (
      <StaffRegister
        onSuccess={(userId, email, name, role) => handleStaffLoginSuccess(userId, email, false, name, role)}
        onBack={() => {
          setShowStaffRegister(false);
          setShowLogin(true);
        }}
      />
    );
  }

  if (showLogin) {
    return (
      <UnifiedLogin
        onClientSuccess={handleClientLoginSuccess}
        onStaffSuccess={handleStaffLoginSuccess}
        onBack={() => setShowLogin(false)}
        onForgotPassword={handleShowForgotPassword}
      />
    );
  }

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleShowLogin} onClientLogin={handleShowSignup} onStaffRegister={handleShowStaffRegister} />;
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === UserRole.Client) {
      return (
        <div className="h-screen w-screen bg-brand-primary text-brand-text flex flex-col">
            <Header currentUser={currentUser} setCurrentUser={handleSetCurrentUser} onLogout={handleLogout} />
            <ClientDashboard currentUser={currentUser} />
        </div>
      );
  }

  return (
    <div className="h-screen w-screen bg-brand-primary text-brand-text flex flex-col overflow-hidden">
      <Header currentUser={currentUser} setCurrentUser={handleSetCurrentUser} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} currentUser={currentUser} />
        <main className="flex-1 overflow-hidden"> {/* REMOVED p-6 and overflow-y-auto for full-screen map */}
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default App;