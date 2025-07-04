import React from 'react';
import { BusinessProvider } from './context/BusinessContext';
import BusinessForm from './components/BusinessForm';
import BusinessDisplay from './components/BusinessDisplay';
import { useBusiness } from './context/BusinessContext';

const DashboardContent: React.FC = () => {
  const { state } = useBusiness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GrowthPro
            </span>
            <span className="text-gray-800">AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock your local business potential with AI-powered insights and SEO optimization
          </p>
        </div>

        <BusinessForm />
        <BusinessDisplay />
      </div>
    </div>
  );
};

function App() {
  return (
    <BusinessProvider>
      <DashboardContent />
    </BusinessProvider>
  );
}

export default App;