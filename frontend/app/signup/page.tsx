'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, error, clearError, user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Username validation (alphanumeric, 3-20 characters)
  const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate username
    if (!username.trim()) {
      setValidationError('Username is required');
      return;
    }
    if (!isValidUsername(username)) {
      setValidationError('Username must be 3-20 characters (letters, numbers, underscore only)');
      return;
    }

    // Validate email
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    try {
      // Pass username, email, and password to backend
      await signup(username, email, password);

      setSuccessMessage('Account created successfully!');
      setTimeout(() => router.push('/tasks'), 2000);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-lg shadow-lg p-10 transition-all duration-500 ease-in-out hover:scale-105">

          {/* Stylish Welcome Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue-600 mb-2 animate-fadeIn">
              Welcome to Todo App
            </h2>
            <p className="text-gray-500 text-sm animate-fadeIn">
              Create a new account
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">3-20 characters (letters, numbers, underscore)</p>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300"
              >
                Sign in
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


