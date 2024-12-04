export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-purple max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600">
                  Welcome to Reddimon. By accessing our website and using our services, you agree to these Terms of Service. Please read them carefully before using our platform.
                </p>
              </section>

              {/* Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services</h2>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-600 mb-4">
                    Reddimon provides the following services:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Reddit analytics and insights
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Subreddit performance tracking
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Content analysis tools
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      Data visualization
                    </li>
                  </ul>
                </div>
              </section>

              {/* User Obligations */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Obligations</h2>
                <div className="bg-purple-50 rounded-lg p-6 space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      <span className="inline-block p-2 bg-blue-100 rounded-full">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibilities</h3>
                      <p className="text-gray-600 leading-relaxed">
                        You are responsible for maintaining the confidentiality of your account 
                        credentials and for all activities that occur under your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      <span className="inline-block p-2 bg-red-100 rounded-full">
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Activities</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Violating any applicable laws or regulations</li>
                        <li>• Impersonating others or providing false information</li>
                        <li>• Attempting to gain unauthorized access to our systems</li>
                        <li>• Using our services for any illegal purposes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Termination</h2>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-600">
                    We reserve the right to suspend or terminate your access to our services at any time for violations of these Terms of Service or for any other reason we deem appropriate.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to Terms</h2>
                <div className="bg-purple-50 rounded-lg p-6 space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      <span className="inline-block p-2 bg-yellow-100 rounded-full">
                        <svg
                          className="w-6 h-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Updates to Terms</h3>
                      <p className="text-gray-600 leading-relaxed">
                        We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mt-12 bg-purple-50 rounded-lg p-6">
                <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <span className="font-semibold">Questions about our Terms?</span>{" "}
                    Contact us at{" "}
                    <a 
                      href="mailto:david@reddimon.com" 
                      className="text-purple-700 hover:text-purple-900 underline"
                    >
                      david@reddimon.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
