import React from 'react';
import { Star, MessageCircle, Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

const BusinessDisplay: React.FC = () => {
  const { state, dispatch } = useBusiness();
  const [regenerating, setRegenerating] = React.useState(false);

  if (!state.businessData) {
    return null;
  }

  const { rating, reviews, headline, name, location } = state.businessData;

  const handleRegenerateHeadline = async () => {
    setRegenerating(true);
    
    try {
      const response = await fetch(
        `http://localhost:3001/regenerate-headline?name=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`
      );

      if (!response.ok) {
        throw new Error('Failed to regenerate headline');
      }

      const data = await response.json();
      dispatch({ type: 'UPDATE_HEADLINE', payload: data.headline });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to regenerate headline. Please try again.' 
      });
    } finally {
      setRegenerating(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300 fill-current" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />
      );
    }

    return stars;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {name}
          </h3>
          <p className="text-gray-600 flex items-center justify-center">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              📍 {location}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Rating Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl font-bold text-gray-800">
                {rating}
              </div>
              <div className="ml-2">
                <div className="flex items-center mb-1">
                  {renderStars(rating)}
                </div>
                <div className="text-sm text-gray-600">Google Rating</div>
              </div>
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-4xl font-bold text-gray-800">
                  {reviews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Headline Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              AI-Generated SEO Headline
            </h4>
            <button
              onClick={handleRegenerateHeadline}
              disabled={regenerating}
              className="flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {regenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white/80 rounded-lg p-4 border border-purple-100">
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              "{headline}"
            </p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            💡 This headline is optimized for search engines and local discovery
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => dispatch({ type: 'RESET_STATE' })}
            className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Analyze Another Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessDisplay;