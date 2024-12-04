export default function PrivacyPolicy() {
    return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
         
        <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to Reddimon (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.reddimon.com and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            We collect personal information that you provide to us, such as your name, email address, and any other information you choose to provide when you:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Register for an account
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Use our Reddit analytics services
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Subscribe to our newsletter
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            Contact our support team
            </li>
            </ul>
            </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <div className="bg-purple-50 rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
                Providing and maintaining our services
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
                Improving our website and services
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span> 
                Communicating with you about updates, offers, and promotions
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span> 
                Responding to your inquiries and support requests
            </li>
            <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span> 
                Complying with legal obligations
            </li>
          </ul>
          </div>
        </section>

        <section className="mb-12">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Children&apos;s Privacy</h2>
  <div className="bg-purple-50 rounded-lg p-6 space-y-6">
    {/* Age Restriction Notice */}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Age Restriction</h3>
        <p className="text-gray-600 leading-relaxed">
          Our Service does not address anyone under the age of 13. We do not knowingly collect 
          personally identifiable information from anyone under the age of 13.
        </p>
      </div>
    </div>

    {/* Parental Consent */}
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Parental Consent</h3>
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            If you are a parent or guardian and you are aware that your child has provided us 
            with Personal Data, please contact us. We will take steps to remove that information 
            from our servers.
          </p>
          <p className="text-gray-600 leading-relaxed">
            If we need to rely on consent as a legal basis for processing your information and 
            your country requires consent from a parent, we may require your parent&apos;s consent 
            before we collect and use that information.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to This Privacy Policy</h2>
  <div className="bg-purple-50 rounded-lg p-6 space-y-6">
    {/* Update Notice */}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Updates</h3>
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
          </p>
        </div>
      </div>
    </div>

    {/* Attribution */}
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-shrink-0">
        <span className="inline-block p-2 bg-green-100 rounded-full">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Attribution</h3>
        <p className="text-gray-600 leading-relaxed">
          Our Privacy Policy was created with the help of a Privacy Policy Generator.
        </p>
      </div>
    </div>

    {/* Last Updated Badge */}
    <div className="flex justify-end">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  </div>
</section>

        <section className="mt-12 bg-purple-50 rounded-lg p-6">
                {/* Contact Information */}
    <div className="mt-4 p-4 bg-purple-100 rounded-lg">
      <p className="text-sm text-purple-700">
        <span className="font-semibold">Need to report an issue?</span>{" "}
        Contact us immediately at{" "}
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
    )
  }
  