import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ClientOTPLoginProps {
  onSuccess: (userId: string, email: string) => void;
  onBack: () => void;
}

const ClientOTPLogin: React.FC<ClientOTPLoginProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [developmentOTP, setDevelopmentOTP] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-client-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone, location, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyRegistered) {
          alert(data.error);
        }
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSuccess(data.message || 'OTP code sent successfully! Check your email.');
      if (data.developmentOTP) {
        setDevelopmentOTP(data.developmentOTP);
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-client-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone, location, password, emailOTP: emailOTP.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        throw new Error(data.error || 'Failed to verify OTP');
      }

      onSuccess(data.userId, data.email);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('input');
      setEmailOTP('');
      setError('');
      setSuccess('');
      setAttemptsRemaining(null);
      setDevelopmentOTP(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Client Login</h1>
          <p className="text-gray-600">
            {step === 'input'
              ? 'Register to access your personalized real estate portal'
              : 'Enter the OTP code sent to your email'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
            {attemptsRemaining !== null && (
              <p className="text-xs mt-1">Attempts remaining: {attemptsRemaining}</p>
            )}
          </div>
        )}

        {success && step === 'verify' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm font-medium">{success}</p>
            {developmentOTP ? (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs font-semibold text-yellow-800 mb-1">Development Mode - Your OTP Code:</p>
                <p className="text-2xl font-mono font-bold text-yellow-900 text-center tracking-wider">{developmentOTP}</p>
                <p className="text-xs text-yellow-700 mt-1">Copy this code and paste it in the field below</p>
              </div>
            ) : (
              <p className="text-xs mt-1">Please check your email for the verification code.</p>
            )}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                placeholder="+971 XX XXX XXXX"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter a valid phone number (min 10 digits)</p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Home Location <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                placeholder="e.g., Dubai Marina"
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
                placeholder="Enter password"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                placeholder="Confirm password"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="emailOTP" className="block text-sm font-medium text-gray-700 mb-1">
                Email OTP Code
              </label>
              <input
                type="text"
                id="emailOTP"
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-primary font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('input');
                setEmailOTP('');
                setError('');
                setSuccess('');
                setAttemptsRemaining(null);
                setDevelopmentOTP(null);
              }}
              disabled={loading}
              className="w-full text-brand-primary hover:text-brand-secondary transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP Code
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={handleBack}
          className="w-full mt-6 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          {step === 'verify' ? 'Back to Login Details' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

export default ClientOTPLogin;
