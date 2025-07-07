import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Search, Loader2, Sparkles, AlertCircle, CheckCircle, Server } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

const BusinessForm: React.FC = () => {
  const { state, dispatch } = useBusiness();
  const [formErrors, setFormErrors] = useState<{ name?: string; location?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline' | 'starting'>('checking');
  const [autoStartAttempted, setAutoStartAttempted] = useState(false);

  // Auto-start server and check status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      setServerStatus('checking');
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setServerStatus('online');
        dispatch({ type: 'SET_ERROR', payload: null });
        return true;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.log('Server not responding, attempting to start...');
      if (!autoStartAttempted) {
        setAutoStartAttempted(true);
        await attemptServerStart();
      } else {
        setServerStatus('offline');
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Backend server is not running. Please start it manually by running: npm run dev:server' 
        });
      }
      return false;
    }
  };

  const attemptServerStart = async () => {
    try {
      setServerStatus('starting');
      
      // Try to start the server by making a request that might trigger auto-start
      console.log('Attempting to auto-start server...');
      
      // Wait a moment for potential auto-start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check again after waiting
      const isOnline = await checkServerStatus();
      if (!isOnline) {
        setServerStatus('offline');
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Could not auto-start server. Please run: npm run dev:server in a separate terminal' 
        });
      }
    } catch (error) {
      setServerStatus('offline');
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to start server automatically. Please run: npm run dev:server' 
      });
    }
  };

  const validateForm = (name: string, location: string): boolean => {
    const errors: { name?: string; location?: string } = {};
    
    if (!name.trim()) {
      errors.name = 'Business name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Business name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      errors.name = 'Business name must be less than 100 characters';
    }
    
    if (!location.trim()) {
      errors.location = 'Location is required';
    } else if (location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (location.trim().length > 100) {
      errors.location = 'Location must be less than 100 characters';
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

    // Check server status before submitting
    if (serverStatus !== 'online') {
      const isServerOnline = await checkServerStatus();
      if (!isServerOnline) {
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    setIsSubmitted(false);

    try {
      console.log('Sending request to backend:', { name: name.trim(), location: location.trim() });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('http://localhost:3001/business-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          location: location.trim() 
        }),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('Received business data:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (!data.name || !data.location || typeof data.rating !== 'number' || typeof data.reviews !== 'number' || !data.headline) {
        throw new Error('Incomplete business data received from server');
      }
      
      // Save business data
      dispatch({ type: 'SET_BUSINESS_DATA', payload: data });
      setIsSubmitted(true);
      
      // Show success message briefly
      setTimeout(() => setIsSubmitted(false), 3000);
      
    } catch (error) {
      console.error('Fetch error details:', error);
      
      let errorMessage = 'Failed to fetch business data. ';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += 'Request timed out. Checking server status...';
          // Re-check server status on timeout
          setTimeout(() => checkServerStatus(), 1000);
        } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          errorMessage += 'Cannot connect to server. Attempting to restart...';
          // Try to restart server
          setTimeout(() => attemptServerStart(), 1000);
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred. Please try again.';
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
    
    // Clear global error when user modifies form
    if (state.error) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  };

  const handleNewAnalysis = () => {
    dispatch({ type: 'RESET_STATE' });
    setFormErrors({});
    setIsSubmitted(false);
  };

  const handleManualServerStart = async () => {
    setAutoStartAttempted(false);
    await attemptServerStart();
  };

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'starting': return 'text-yellow-500';
      case 'checking': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'online': return 'Server Online';
      case 'offline': return 'Server Offline';
      case 'starting': return 'Starting Server...';
      case 'checking': return 'Checking Server...';
      default: return 'Unknown Status';
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

          {/* Server Status Indicator */}
          <div className="mb-6 p-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className={`w-5 h-5 mr-3 ${getServerStatusColor()}`} />
                <div>
                  <p className={`text-sm font-medium ${getServerStatusColor()}`}>
                    {getServerStatusText()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Backend API: localhost:3001
                  </p>
                </div>
              </div>
              {serverStatus === 'offline' && (
                <button
                  onClick={handleManualServerStart}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Retry Start
                </button>
              )}
              {serverStatus === 'starting' && (
                <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
              )}
              {serverStatus === 'checking' && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              )}
              {serverStatus === 'online' && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {isSubmitted && state.businessData && (
            <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Business data loaded successfully!
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Your insights are now available below
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  disabled={state.loading || serverStatus !== 'online'}
                  maxLength={100}
                />
              </div>
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-in slide-in-from-left-2 duration-300">
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
                  disabled={state.loading || serverStatus !== 'online'}
                  maxLength={100}
                />
              </div>
              {formErrors.location && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-in slide-in-from-left-2 duration-300">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {formErrors.location}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={state.loading || serverStatus !== 'online'}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {state.loading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    <span>Analyzing...</span>
                  </div>
                ) : serverStatus !== 'online' ? (
                  <div className="flex items-center justify-center relative z-10">
                    <Server className="w-5 h-5 mr-3" />
                    <span>Server Required</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center relative z-10">
                    <Search className="w-5 h-5 mr-3" />
                    <span>Generate Insights</span>
                    <Sparkles className="w-4 h-4 ml-2" />
                  </div>
                )}
              </button>

              {state.businessData && (
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  disabled={state.loading}
                  className="px-6 py-4 text-gray-600 bg-gray-100/80 backdrop-blur-sm rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  New Analysis
                </button>
              )}
            </div>
          </form>

          {state.error && (
            <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 font-medium">{state.error}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={checkServerStatus}
                      className="text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Check Server Status
                    </button>
                    <span className="text-xs text-red-400">•</span>
                    <button
                      onClick={handleManualServerStart}
                      className="text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Try Auto-Start
                    </button>
                    <span className="text-xs text-red-400">•</span>
                    <span className="text-xs text-red-500">
                      Manual: npm run dev:server
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Start Instructions */}
          {serverStatus === 'offline' && (
            <div className="mt-6 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl">
              <div className="flex items-start">
                <Server className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    Backend Server Required
                  </p>
                  <p className="text-xs text-blue-500 mb-3">
                    To use the business intelligence features, start the backend server:
                  </p>
                  <div className="bg-blue-100/50 rounded-lg p-3 font-mono text-xs text-blue-700">
                    npm run dev:server
                  </div>
                  <p className="text-xs text-blue-500 mt-2">
                    The server will start on http://localhost:3001
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;