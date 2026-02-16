
import { AuthFooter } from '@/components/AuthFooter';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About TaskFlow</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-4">
                TaskFlow is a modern task management application designed to help you stay organized and productive.
                Built with cutting-edge technologies, TaskFlow provides a seamless experience across all your devices.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                We believe that effective task management should be simple, intuitive, and accessible to everyone.
                Our mission is to provide a powerful yet easy-to-use platform that helps individuals and teams
                achieve their goals.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Create and organize tasks with categories</li>
                <li>Track task status (Pending, In Progress, Completed)</li>
                <li>Filter and search your tasks</li>
                <li>View detailed statistics and progress</li>
                <li>Responsive design for all devices</li>
                <li>Secure authentication and data protection</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technology Stack</h2>
              <p className="text-gray-600 mb-4">
                TaskFlow is built with modern technologies including Next.js 16, FastAPI, PostgreSQL,
                and Tailwind CSS, ensuring a fast, reliable, and scalable experience.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
