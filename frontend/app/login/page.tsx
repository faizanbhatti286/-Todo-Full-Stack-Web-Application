'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { AuthFooter } from '@/components/AuthFooter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsLoading(true);

    // Validate email
    if (!email.trim()) {
      setValidationError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (!password) {
      setValidationError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);

      // Immediately redirect to tasks without waiting
      setSuccessMessage('Login successful!');
      router.push('/tasks');
    } catch (err: unknown) {
      // Handle authentication errors (401, 400) as normal user feedback
      if (err && typeof err === 'object' && 'status' in err && 'code' in err && 'message' in err) {
        const error = err as { status?: number; code?: string; message?: string };
        if (error.status === 401 || error.status === 400 || error.code === 'UNAUTHORIZED' || error.code === 'VALIDATION_ERROR') {
          // This is expected user feedback, not an application error
          setValidationError(error.message || 'Invalid credentials. Please try again.');
        } else {
          // Log actual errors (network issues, server errors, etc.)
          console.error('Login error:', err);
          setValidationError('An unexpected error occurred. Please try again.');
        }
      } else {
        console.error('Login error:', err);
        setValidationError('An unexpected error occurred. Please try again.');
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slideUp">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
            {/* Welcome Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={validationError && !isValidEmail(email) && email ? 'Please enter a valid email' : undefined}
                required
              />

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={validationError && !password ? validationError : undefined}
                  required
                />
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Error Messages */}
            {(validationError || error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-slideDown">
                <p className="text-sm text-red-600 text-center">
                  {validationError || error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-slideDown">
                <p className="text-sm text-green-600 text-center">
                  {successMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
