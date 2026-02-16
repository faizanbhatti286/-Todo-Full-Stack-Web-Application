import { AuthFooter } from '@/components/AuthFooter';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

            <p className="text-sm text-gray-500 mb-8">Last updated: February 10, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using TaskFlow, you accept and agree to be bound by the terms and
                  provisions of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-600">
                  Permission is granted to temporarily use TaskFlow for personal, non-commercial use only.
                  This is the grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Account</h2>
                <p className="text-gray-600 mb-2">When you create an account with us, you must:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Prohibited Uses</h2>
                <p className="text-gray-600 mb-2">You may not use TaskFlow:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>For any unlawful purpose</li>
                  <li>To violate any regulations or laws</li>
                  <li>To harm or exploit minors</li>
                  <li>To transmit malicious code or viruses</li>
                  <li>To interfere with the service&apos;s security features</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend your account immediately, without prior notice, for any
                  reason, including breach of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-600">
                  TaskFlow shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to modify these terms at any time. We will notify users of any
                  material changes via email or through the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                <p className="text-gray-600">
                  Questions about the Terms of Service should be sent to
                  <a href="mailto:legal@taskflow.com" className="text-blue-600 hover:text-blue-700"> legal@taskflow.com</a>.
                </p>
              </section>
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
