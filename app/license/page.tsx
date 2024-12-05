import LicenseCheck from '@/components/LicenseCheck';

export default function LicensePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Enter Your License Key
        </h1>
        <LicenseCheck />
      </div>
    </main>
  );
} 