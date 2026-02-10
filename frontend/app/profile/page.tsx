'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { taskAPI, APIError } from '@/lib/api';
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { AuthFooter } from '@/components/AuthFooter';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication check and redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch tasks for statistics
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const tasks = await taskAPI.getTasks(user.id);
        setTasks(tasks);
      } catch (err) {
        if (err instanceof APIError) {
          if (err.status === 401) {
            router.push('/login');
            return;
          }
          setError(err.message);
        } else {
          setError('Failed to load statistics. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, router]);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed || t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Format member since date
  const memberSince = user ? new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  // Show loading spinner during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-slideUp">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              View your account information and task statistics
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              {/* User Information Card */}
              <Card variant="bordered" className="animate-scaleIn">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Member since:</span> {memberSince}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Task Statistics */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Task Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Tasks */}
                  <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
                    <Card variant="hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{totalTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Completed Tasks */}
                  <div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
                    <Card variant="hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completed</p>
                          <p className="text-3xl font-bold text-green-600 mt-2">{completedTasks}</p>
                          <p className="text-xs text-gray-500 mt-1">{completionPercentage}% complete</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Pending Tasks */}
                  <div className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
                    <Card variant="hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{pendingTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* In Progress Tasks */}
                  <div className="animate-scaleIn" style={{ animationDelay: '0.4s' }}>
                    <Card variant="hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">In Progress</p>
                          <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {totalTasks > 0 && (
                <div className="animate-scaleIn" style={{ animationDelay: '0.5s' }}>
                  <Card variant="bordered">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Completion Rate</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {completedTasks} of {totalTasks} tasks completed
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
