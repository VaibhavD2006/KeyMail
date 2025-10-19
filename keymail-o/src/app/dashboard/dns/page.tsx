"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Status indicator component
const StatusIndicator = ({ status }: { status: 'verified' | 'pending' | 'failed' | 'not-started' }) => {
  const statusConfig = {
    'verified': {
      color: 'bg-green-100 text-green-800',
      icon: (
        <svg className="w-5 h-5 text-green-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      text: 'Verified'
    },
    'pending': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: (
        <svg className="w-5 h-5 text-yellow-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      text: 'Pending Verification'
    },
    'failed': {
      color: 'bg-red-100 text-red-800',
      icon: (
        <svg className="w-5 h-5 text-red-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      ),
      text: 'Verification Failed'
    },
    'not-started': {
      color: 'bg-gray-100 text-gray-800',
      icon: (
        <svg className="w-5 h-5 text-gray-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      text: 'Not Started'
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {statusConfig[status].text}
    </span>
  );
};

// Domain record component
const DomainRecord = ({ 
  type, 
  name, 
  value, 
  ttl = "3600",
  status = 'not-started'
}: { 
  type: string; 
  name: string; 
  value: string; 
  ttl?: string;
  status?: 'verified' | 'pending' | 'failed' | 'not-started';
}) => {
  return (
    <div className="p-4 border rounded-md mb-4 bg-white shadow-sm">
      <div className="flex justify-between mb-2">
        <div className="font-medium">{type} Record</div>
        <StatusIndicator status={status} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Host</div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">{name}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-gray-500 mb-1">Value</div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200 break-all">{value}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">TTL</div>
          <div className="p-2 bg-gray-50 rounded border border-gray-200">{ttl}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-500">
        Add this record to your domain's DNS settings in your domain registrar's control panel.
      </div>
    </div>
  );
};

export default function DNSPage() {
  const [domain, setDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('not-started');
  
  // Mock domain data
  const domainData = {
    domain: "yourdomain.com",
    defaultEmail: "your-account@keymail.app",
    setupComplete: false,
    mx: [
      { priority: "10", value: "mx1.keymail-smtp.com" },
      { priority: "20", value: "mx2.keymail-smtp.com" }
    ],
    spf: { value: "v=spf1 include:_spf.keymail.app ~all" },
    dkim: { 
      selector: "km1", 
      value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxVb4KPKrJPO2..." 
    },
    dmarc: { value: "v=DMARC1; p=none; sp=none; rua=mailto:dmarc@keymail.app" },
  };

  const startDomainVerification = () => {
    if (!domain) {
      alert("Please enter a domain name");
      return;
    }
    
    // This would normally make an API call to start the domain verification process
    setIsCustomDomain(true);
    setVerificationStatus('pending');
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus('verified');
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Domain Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Domain Configuration</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your custom email domain to send emails from your own domain name.
          </p>
        </div>
        
        <div className="p-6">
          {!isCustomDomain ? (
            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Currently, you're using the default KeyMail domain for sending emails. To improve deliverability and brand recognition, we recommend setting up your own domain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Default KeyMail Domain</h3>
                    <p className="text-sm text-gray-500 mt-1">Your current email address for sending emails is:</p>
                    <p className="mt-1 text-sm font-medium text-purple-600">your-account@keymail.app</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Enter your domain name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    name="domain"
                    id="domain"
                    className="focus:ring-purple-500 focus:border-purple-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                    placeholder="yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter a domain you own. You'll need to add DNS records to verify ownership.
                </p>
                <div className="pt-4">
                  <Button 
                    onClick={startDomainVerification}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Start Domain Verification
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 mr-3">Domain: {domain || domainData.domain}</h3>
                    <StatusIndicator status={verificationStatus as any} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Add the following DNS records to your domain registrar:</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">1. Verification Record</h3>
                  <DomainRecord 
                    type="TXT" 
                    name="@" 
                    value="keymail-verification=abc123def456" 
                    status={verificationStatus as any}
                  />
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">2. MX Records</h3>
                  {domainData.mx.map((record, index) => (
                    <DomainRecord 
                      key={index}
                      type="MX" 
                      name="@" 
                      value={`${record.priority} ${record.value}`} 
                      status={verificationStatus === 'verified' ? 'verified' : 'not-started'}
                    />
                  ))}
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">3. SPF Record</h3>
                  <DomainRecord 
                    type="TXT" 
                    name="@" 
                    value={domainData.spf.value} 
                    status={verificationStatus === 'verified' ? 'verified' : 'not-started'}
                  />
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">4. DKIM Record</h3>
                  <DomainRecord 
                    type="TXT" 
                    name={`${domainData.dkim.selector}._domainkey`} 
                    value={domainData.dkim.value} 
                    status={verificationStatus === 'verified' ? 'verified' : 'not-started'}
                  />
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">5. DMARC Record</h3>
                  <DomainRecord 
                    type="TXT" 
                    name="_dmarc" 
                    value={domainData.dmarc.value} 
                    status={verificationStatus === 'verified' ? 'verified' : 'not-started'}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setVerificationStatus('not-started');
                      setIsCustomDomain(false);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setVerificationStatus('verified')}
                    disabled={verificationStatus === 'verified'}
                  >
                    Verify DNS Records
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Help & Resources</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">How to add DNS records?</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Need help adding DNS records? Check our step-by-step guides for popular domain registrars:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><Link href="#" className="text-purple-600 hover:text-purple-800">GoDaddy</Link></li>
                    <li><Link href="#" className="text-purple-600 hover:text-purple-800">Namecheap</Link></li>
                    <li><Link href="#" className="text-purple-600 hover:text-purple-800">Google Domains</Link></li>
                    <li><Link href="#" className="text-purple-600 hover:text-purple-800">Cloudflare</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Common DNS Issues</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Having trouble with DNS verification? Check these common issues:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>DNS propagation can take up to 48 hours</li>
                    <li>Ensure you've added all required records</li>
                    <li>Check for typos in record values</li>
                    <li>Some registrars require the @ symbol in the host field</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Need more help?</h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>Our support team is ready to assist you with domain setup and verification.</p>
                    <p className="mt-2">
                      <Link href="/dashboard/support" className="font-medium text-purple-600 hover:text-purple-500">
                        Contact Support →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 