'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError, user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  // Check if input is email format
  const isEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate username or email
    if (!usernameOrEmail.trim()) {
      setValidationError('Username or email is required');
      return;
    }

    // Validate password
    if (!password) {
      setValidationError('Password is required');
      return;
    }

    try {
      // Determine if input is email or username
      const loginIdentifier = isEmail(usernameOrEmail) ? usernameOrEmail : usernameOrEmail;

      // For now, the backend expects email, so we pass the input as email
      // In a full implementation, the backend would handle both username and email
      await login(usernameOrEmail, password);

      setSuccessMessage('Login successful!');
      setTimeout(() => router.push('/tasks'), 1500);
    } catch (err: any) {
      console.error('Login API Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-lg shadow-lg p-10 transition-all duration-500 ease-in-out hover:scale-105">

          {/* Stylish Welcome Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue-600 mb-2 animate-fadeIn">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm animate-fadeIn">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your username or email address</p>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Validation error message */}
          {validationError && (
            <p className="text-red-500 mt-4 text-center animate-fadeIn">
              {validationError}
            </p>
          )}

          {/* API error message */}
          {error && (
            <p className="text-red-500 mt-4 text-center animate-fadeIn">
              {error}
            </p>
          )}

          {/* Success message */}
          {successMessage && (
            <p className="text-green-500 mt-4 text-center animate-fadeIn">
              {successMessage}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
