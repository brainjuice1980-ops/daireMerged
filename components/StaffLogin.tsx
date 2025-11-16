import React, { useState } from 'react';

interface StaffLoginProps {
  onSuccess: (userId: string, email: string, requiresPasswordChange: boolean) => void;
  onBack: () => void;
  onClientSignup: () => void;
}

const StaffLogin: React.FC<StaffLoginProps> = ({ onSuccess, onBack, onClientSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/staff-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      onSuccess(data.userId, data.email, data.requiresPasswordChange || false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Staff Login</h1>
          <p className="text-gray-600">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">
              Contact your administrator to reset your password
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onClientSignup}
            className="text-brand-primary hover:text-brand-secondary transition-colors text-sm font-medium"
          >
            New client? Sign up here
          </button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default StaffLogin;
