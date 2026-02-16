import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AuthFooter } from '@/components/AuthFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} href="/" />
          </div>

          {/* Hero Content */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slideUp">
            Welcome to <span className="text-blue-600">TaskFlow</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp animate-delay-100">
            Organize your tasks, boost your productivity, and achieve your goals with our modern task management platform.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slideUp animate-delay-200">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organize Tasks</h3>
              <p className="text-gray-600 text-sm">Create, categorize, and manage your tasks efficiently</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">Monitor your productivity with detailed statistics</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Focused</h3>
              <p className="text-gray-600 text-sm">Filter and prioritize tasks to stay on track</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp animate-delay-300">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Social Proof */}
          <p className="mt-12 text-gray-500 text-sm animate-fadeIn animate-delay-400">
            Join thousands of users managing their tasks efficiently
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fadeIn animate-delay-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">99%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
