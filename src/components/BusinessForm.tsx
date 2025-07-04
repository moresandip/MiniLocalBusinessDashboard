import React, { useState } from 'react';
import { Building2, MapPin, Search, Loader2, Sparkles } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

const BusinessForm: React.FC = () => {
  const { state, dispatch } = useBusiness();
  const [formErrors, setFormErrors] = useState<{ name?: string; location?: string }>({});

  const validateForm = (name: string, location: string): boolean => {
    const errors: { name?: string; location?: string } = {};
    
    if (!name.trim()) {
      errors.name = 'Business name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Business name must be at least 2 characters';
    }
    
    if (!location.trim()) {
      errors.location = 'Location is required';
    } else if (location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, location } = state.formData;
    
    if (!validateForm(name, location)) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch('http://localhost:3001/business-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), location: location.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }

      const data = await response.json();
      dispatch({ type: 'SET_BUSINESS_DATA', payload: data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to fetch business data. Please make sure the server is running.' 
      });
    }
  };

  const handleInputChange = (field: 'name' | 'location', value: string) => {
    dispatch({ 
      type: 'SET_FORM_DATA', 
      payload: { ...state.formData, [field]: value } 
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-10 border border-gray-200/50 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Business Intelligence
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Enter your business details to unlock powerful AI-driven insights and optimization strategies
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Business Name
              </label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={state.formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 ${
                    formErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="e.g., Artisan Coffee House"
                  disabled={state.loading}
                />
              </div>
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Business Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={state.formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-400 ${
                    formErrors.location ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="e.g., Downtown Seattle"
                  disabled={state.loading}
                />
              </div>
              {formErrors.location && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {formErrors.location}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {state.loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  <span>Analyzing Business...</span>
                  <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <Search className="w-5 h-5 mr-3" />
                  <span>Generate Business Insights</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
              )}
            </button>
          </form>

          {state.error && (
            <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-sm text-red-600 font-medium">{state.error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;