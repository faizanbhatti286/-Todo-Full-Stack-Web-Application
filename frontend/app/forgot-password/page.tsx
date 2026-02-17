'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { AuthFooter } from '@/components/AuthFooter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validate email
    if (!email.trim()) {
      setErrorMessage('Email is required');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement password reset API call
      // For now, show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setSuccessMessage('If an account exists with this email, you will receive password reset instructions.');
      setEmail('');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
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
                Reset Password
              </h1>
              <p className="text-gray-600">
                Enter your email address and we&apos;ll send you instructions to reset your password
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errorMessage && !isValidEmail(email) && email ? 'Please enter a valid email' : undefined}
                required
                disabled={!!successMessage}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
                disabled={!!successMessage}
              >
                Send Reset Instructions
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-slideDown">
                <p className="text-sm text-red-600 text-center">
                  {errorMessage}
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
