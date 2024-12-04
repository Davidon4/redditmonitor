import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Reddimon. All rights reserved.
            </div>
            <div className="flex space-x-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms
                </Link>
                <Link href="https://x.com/kingoverwealth" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}