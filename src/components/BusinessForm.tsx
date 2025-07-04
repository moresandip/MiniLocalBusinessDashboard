import React, { useState } from 'react';
import { Building2, MapPin, Search, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Business Dashboard
          </h2>
          <p className="text-gray-600">
            Enter your business details to get insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={state.formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter business name"
                disabled={state.loading}
              />
            </div>
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={state.formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter location"
                disabled={state.loading}
              />
            </div>
            {formErrors.location && (
              <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={state.loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {state.loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing Business...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Get Business Insights
              </div>
            )}
          </button>
        </form>

        {state.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessForm;