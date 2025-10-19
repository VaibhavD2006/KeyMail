import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">KeyMail Features</h1>
          
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Client Management</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium mb-3">Manual Data Entry</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Add individual client profiles with key details</li>
                    <li>Customize fields based on needs</li>
                    <li>Track important dates (birthdays, closing anniversaries)</li>
                    <li>Store relationship context</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Bulk Import</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>CSV file upload support</li>
                    <li>Standardized template format</li>
                    <li>Data validation</li>
                    <li>Automatic field mapping</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">AI Email Generation</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium mb-3">Smart Templates</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Celebratory messages (birthdays, anniversaries)</li>
                    <li>Market updates and newsletters</li>
                    <li>Holiday greetings</li>
                    <li>Relationship milestones</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Personalization Engine</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Dynamic content insertion</li>
                    <li>Tone adjustment based on relationship</li>
                    <li>Context-aware messaging</li>
                    <li>Custom variables</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Approval System</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium mb-3">Review Process</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Dashboard notifications</li>
                    <li>Email preview and editing</li>
                    <li>Batch approval options</li>
                    <li>Version history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Scheduling</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Automated sending</li>
                    <li>Time zone management</li>
                    <li>Delivery confirmation</li>
                    <li>Recurring campaigns</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-purple-700">Email Platform Integration</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium mb-3">Supported Services</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Gmail (Google Workspace)</li>
                    <li>Microsoft Outlook</li>
                    <li>Mailchimp</li>
                    <li>Custom SMTP servers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">Security</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>OAuth 2.0 authentication</li>
                    <li>Secure token management</li>
                    <li>Data encryption</li>
                    <li>GDPR compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 