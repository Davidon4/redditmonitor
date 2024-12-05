'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LicenseCheck() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyLicense = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey })
      });
      
      const data = await response.json();
      if (data.valid) {
        // Store license key and proceed
        localStorage.setItem('license_key', licenseKey);
        window.location.href = '/welcome';
      } else {
        setError('Invalid license key');
        return;
      }
    } catch (error) {
      console.error('License verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your license key"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
      />
      <Button 
        onClick={verifyLicense}
        disabled={isVerifying}
      >
        Verify License
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
} 