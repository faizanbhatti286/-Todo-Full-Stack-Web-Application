'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { AuthFooter } from '@/components/AuthFooter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const { signup, error, clearError, user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (!pwd) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsLoading(true);

    // Validate username
    if (!username.trim()) {
      setValidationError('Username is required');
      setIsLoading(false);
      return;
    }
    if (!isValidUsername(username)) {
      setValidationError('Username must be 3-20 characters (letters, numbers, underscore only)');
      setIsLoading(false);
      return;
    }

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
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      return;
    }

    try {
      // Pass username, email, and password to backend
      await signup(username, email, password);

      // Immediately redirect to login without waiting
      setSuccessMessage('Account created successfully! Redirecting...');
      router.push('/login');
    } catch (err: any) {
      // Handle validation errors (409, 400) as normal user feedback
      if (err.status === 409 || err.status === 400 || err.code === 'CONFLICT' || err.code === 'VALIDATION_ERROR') {
        // This is expected user feedback, not an application error
        setValidationError(err.message || 'Please check your input and try again.');
      } else {
        // Log actual errors (network issues, server errors, etc.)
        console.error('Signup error:', err);
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
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Join us and start managing your tasks
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={validationError && !isValidUsername(username) && username ? 'Username must be 3-20 characters (letters, numbers, underscore)' : undefined}
                required
              />

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
                  error={validationError && password.length < 8 && password ? 'Password must be at least 8 characters' : undefined}
                  required
                />
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.label === 'Weak' ? 'text-red-600' :
                        passwordStrength.label === 'Fair' ? 'text-yellow-600' :
                        passwordStrength.label === 'Good' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={validationError && password !== confirmPassword && confirmPassword ? "Passwords don't match" : undefined}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign in
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


