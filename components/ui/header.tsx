import React, { useState, useEffect } from 'react';
import { Menu, X, Bot } from 'lucide-react';
import {signIn} from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/home'
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
            <span className="text-xl font-bold bg-purple-700 bg-clip-text text-transparent">
              Reddimon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </a>
            <Button onClick={handleSignIn}   
            className="bg-purple-700 text-white px-6 py-2.5 rounded-lg
            hover:bg-purple-800 hover:scale-105
            transform transition-all duration-200
            shadow-lg hover:shadow-purple-500/50
            relative overflow-hidden
            group
            ">
    <span className="relative z-10 flex items-center">
                Start for free
                <svg 
      className="w-4 h-4 ml-2 -mr-1 transform transition-transform group-hover:translate-x-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </span>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 bg-white pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-900 hover:bg-gray-50">
                Features
              </a>
              <a href="#pricing" className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-900 hover:bg-gray-50">
                Pricing
              </a>
              <Button onClick={handleSignIn}   
            className="bg-purple-700 text-white px-8 py-2.5 rounded-lg
            hover:bg-purple-800 hover:scale-105
            transform transition-all duration-200
            shadow-lg hover:shadow-purple-500/50
            relative overflow-hidden
            group
            w-full
            ">
    <span className="relative z-10 flex items-center">
                Start for free
                <svg 
      className="w-4 h-4 ml-2 -mr-1 transform transition-transform group-hover:translate-x-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  </span>
            </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;