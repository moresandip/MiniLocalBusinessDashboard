import React from 'react';
import { BusinessProvider } from './context/BusinessContext';
import BusinessForm from './components/BusinessForm';
import BusinessDisplay from './components/BusinessDisplay';
import { useBusiness } from './context/BusinessContext';

const DashboardContent: React.FC = () => {
  const { state } = useBusiness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl mb-8 shadow-2xl shadow-blue-500/25">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-lg"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Growth
            </span>
            <span className="text-gray-800">Pro</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your local business with 
            <span className="font-semibold text-gray-800"> AI-powered insights</span>, 
            advanced <span className="font-semibold text-gray-800">SEO optimization</span>, 
            and data-driven growth strategies
          </p>
          
          <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Real-time Analytics
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              AI-Generated Content
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              Local SEO Optimization
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-12 max-w-7xl mx-auto">
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <BusinessForm />
          </div>
          
          {state.businessData && (
            <div className="w-full lg:flex-1 lg:max-w-4xl">
              <BusinessDisplay />
            </div>
          )}
        </div>

        {/* Features Section */}
        {!state.businessData && (
          <div className="mt-24 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose GrowthProAI?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the powerful features that make us the leading choice for local business growth
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get comprehensive insights into your business performance with real-time data and predictive analytics.
                </p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered SEO</h3>
                <p className="text-gray-600 leading-relaxed">
                  Leverage cutting-edge AI to generate compelling headlines and optimize your content for maximum visibility.
                </p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Local Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dominate your local market with targeted strategies designed specifically for location-based businesses.
                </p>
              </div>
            </div>
          </div>
        )}
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