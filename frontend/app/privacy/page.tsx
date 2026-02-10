import { AuthFooter } from '@/components/AuthFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

            <p className="text-sm text-gray-500 mb-8">Last updated: February 10, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-600">
                  We collect information you provide directly to us, including your name, email address,
                  and any other information you choose to provide when using TaskFlow.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-2">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Your Rights</h2>
                <p className="text-gray-600 mb-2">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at
                  <a href="mailto:privacy@taskflow.com" className="text-blue-600 hover:text-blue-700"> privacy@taskflow.com</a>.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
