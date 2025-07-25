import React, { useState } from 'react';
import { Star, MessageCircle, Sparkles, RefreshCw, Loader2, TrendingUp, Award, Target, BarChart3, Users, Globe, Calendar, Edit3, Check, X, Download, Building2 } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { serverManager } from '../utils/serverManager';

const BusinessDisplay: React.FC = () => {
  const { state, dispatch } = useBusiness();
  const [editingRating, setEditingRating] = useState(false);
  const [editingReviews, setEditingReviews] = useState(false);
  const [tempRating, setTempRating] = useState('');
  const [tempReviews, setTempReviews] = useState('');

  if (!state.businessData) {
    return null;
  }

  const { rating, reviews, headline, name, location } = state.businessData;

  const generateMockHeadline = (name: string, location: string) => {
    const headlines = [
      `${name}: Leading ${location}'s Business Innovation in 2025`,
      `Why ${name} is ${location}'s Most Trusted Choice`,
      `${name} Redefines Excellence in ${location}`,
      `Discover What Makes ${name} ${location}'s Premier Destination`,
      `${name}: Where ${location} Finds Quality and Service`,
      `Experience the ${name} Difference in ${location}`,
      `${name} - ${location}'s Award-Winning Business Solution`,
      `Join Thousands Who Choose ${name} in ${location}`,
      `${name}: Elevating ${location}'s Business Standards`
    ];

    return headlines[Math.floor(Math.random() * headlines.length)];
  };

  const handleRegenerateHeadline = async () => {
    dispatch({ type: 'SET_HEADLINE_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Try server first
      const data = await serverManager.makeApiRequest(`/regenerate-headline?name=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`);
      dispatch({ type: 'UPDATE_HEADLINE', payload: data.headline });
    } catch (error) {
      // Use mock headline if server fails
      const mockHeadline = generateMockHeadline(name, location);
      dispatch({ type: 'UPDATE_HEADLINE', payload: mockHeadline });
    }
  };

  const handleEditRating = () => {
    setEditingRating(true);
    setTempRating(rating.toString());
  };

  const handleSaveRating = () => {
    const newRating = parseFloat(tempRating);
    if (newRating >= 1 && newRating <= 5) {
      dispatch({ 
        type: 'UPDATE_BUSINESS_DATA', 
        payload: { ...state.businessData!, rating: newRating }
      });
      setEditingRating(false);
    }
  };

  const handleCancelRating = () => {
    setEditingRating(false);
    setTempRating('');
  };

  const handleEditReviews = () => {
    setEditingReviews(true);
    setTempReviews(reviews.toString());
  };

  const handleSaveReviews = () => {
    const newReviews = parseInt(tempReviews);
    if (newReviews >= 0) {
      dispatch({ 
        type: 'UPDATE_BUSINESS_DATA', 
        payload: { ...state.businessData!, reviews: newReviews }
      });
      setEditingReviews(false);
    }
  };

  const handleCancelReviews = () => {
    setEditingReviews(false);
    setTempReviews('');
  };

  const generateBusinessReport = () => {
    const performance = getPerformanceLevel(rating);
    const engagement = getEngagementLevel(reviews);
    const seoScore = Math.round(85 + (rating - 3.5) * 10);
    const localVisibility = Math.round(70 + (reviews / 10));
    const competitiveRank = rating >= 4.5 ? 'Top 10%' : rating >= 4.0 ? 'Top 25%' : 'Top 50%';

    const report = {
      businessInfo: {
        name,
        location,
        analysisDate: new Date().toLocaleDateString(),
        reportId: `RPT-${Date.now()}`
      },
      metrics: {
        googleRating: rating,
        totalReviews: reviews,
        seoScore,
        localVisibility: Math.min(localVisibility, 100),
        competitiveRank,
        performanceLevel: performance.level,
        engagementLevel: engagement.level
      },
      seoHeadline: headline,
      recommendations: [
        rating < 4.0 ? "Focus on improving customer satisfaction to increase rating" : "Maintain excellent customer service standards",
        reviews < 100 ? "Encourage more customers to leave reviews" : "Continue engaging with customer feedback",
        seoScore < 90 ? "Optimize website content for better SEO performance" : "Maintain current SEO optimization strategies",
        "Regularly update business information on Google My Business",
        "Respond promptly to customer reviews and feedback"
      ],
      insights: {
        strengths: [
          rating >= 4.0 ? "Strong customer satisfaction" : null,
          reviews >= 100 ? "Good review volume" : null,
          seoScore >= 85 ? "Solid SEO foundation" : null
        ].filter(Boolean),
        improvements: [
          rating < 4.0 ? "Customer satisfaction needs attention" : null,
          reviews < 50 ? "Low review count" : null,
          seoScore < 80 ? "SEO optimization required" : null
        ].filter(Boolean)
      }
    };

    return report;
  };

  const exportBusinessReport = () => {
    const report = generateBusinessReport();
    const reportContent = `
# Business Analysis Report

**Business:** ${report.businessInfo.name}
**Location:** ${report.businessInfo.location}
**Analysis Date:** ${report.businessInfo.analysisDate}
**Report ID:** ${report.businessInfo.reportId}

## Executive Summary
${report.businessInfo.name} in ${report.businessInfo.location} shows ${report.metrics.performanceLevel.toLowerCase()} performance with a ${report.metrics.googleRating}/5.0 rating and ${report.metrics.totalReviews} reviews.

## Key Metrics
- **Google Rating:** ${report.metrics.googleRating}/5.0
- **Total Reviews:** ${report.metrics.totalReviews.toLocaleString()}
- **SEO Score:** ${report.metrics.seoScore}%
- **Local Visibility:** ${report.metrics.localVisibility}%
- **Market Position:** ${report.metrics.competitiveRank}
- **Performance Level:** ${report.metrics.performanceLevel}
- **Engagement Level:** ${report.metrics.engagementLevel}

## AI-Generated SEO Headline
"${report.seoHeadline}"

## Strengths
${report.insights.strengths.map(strength => `- ${strength}`).join('\n')}

## Areas for Improvement
${report.insights.improvements.map(improvement => `- ${improvement}`).join('\n')}

## Recommendations
${report.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

## Next Steps
1. Implement recommended improvements
2. Monitor metrics monthly
3. Update SEO content regularly
4. Engage with customer feedback
5. Track competitive positioning

---
*Report generated by GrowthProAI - ${new Date().toLocaleString()}*
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_Business_Report_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" />
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

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (rating >= 4.0) return { level: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (rating >= 3.5) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const getEngagementLevel = (reviews: number) => {
    if (reviews >= 300) return { level: 'High', percentage: 90, color: 'from-green-500 to-emerald-600' };
    if (reviews >= 150) return { level: 'Medium-High', percentage: 70, color: 'from-blue-500 to-indigo-600' };
    if (reviews >= 75) return { level: 'Medium', percentage: 50, color: 'from-yellow-500 to-orange-600' };
    return { level: 'Growing', percentage: 30, color: 'from-purple-500 to-pink-600' };
  };

  const performance = getPerformanceLevel(rating);
  const engagement = getEngagementLevel(reviews);

  // Calculate additional metrics
  const seoScore = Math.round(85 + (rating - 3.5) * 10);
  const localVisibility = Math.round(70 + (reviews / 10));
  const competitiveRank = rating >= 4.5 ? 'Top 10%' : rating >= 4.0 ? 'Top 25%' : 'Top 50%';

  return (
    <div className="w-full animate-in slide-in-from-right-8 duration-700">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-200/50 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold mb-2">{name}</h3>
                <div className="flex items-center text-white/90">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-lg">{location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${performance.bg} ${performance.color} ${performance.border} border backdrop-blur-sm`}>
                  <Award className="w-4 h-4 mr-2" />
                  {performance.level}
                </div>
                <div className="mt-2 text-xs text-white/80">
                  Market Position: {competitiveRank}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Primary Metrics Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Rating Card */}
            <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    {editingRating ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={tempRating}
                          onChange={(e) => setTempRating(e.target.value)}
                          className="w-20 px-2 py-1 text-2xl font-bold text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                          onClick={handleSaveRating}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelRating}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="text-3xl font-bold text-gray-800">{rating}</div>
                        <button
                          onClick={handleEditRating}
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 font-medium">Google Rating</div>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex items-center justify-center mb-3">
                {renderStars(rating)}
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Customer Satisfaction</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Reviews Card */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    {editingReviews ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          value={tempReviews}
                          onChange={(e) => setTempReviews(e.target.value)}
                          className="w-24 px-2 py-1 text-2xl font-bold text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleSaveReviews}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelReviews}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="text-3xl font-bold text-gray-800">{reviews.toLocaleString()}</div>
                        <button
                          onClick={handleEditReviews}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 font-medium">Total Reviews</div>
                  </div>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Engagement Level</span>
                  <span>{engagement.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${engagement.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${engagement.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{seoScore}%</div>
              <div className="text-xs text-gray-600">SEO Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50 text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{Math.min(localVisibility, 100)}%</div>
              <div className="text-xs text-gray-600">Local Visibility</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200/50 text-center">
              <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">2025</div>
              <div className="text-xs text-gray-600">Analysis Year</div>
            </div>
          </div>

          {/* SEO Headline Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Latest AI-Generated SEO Headline
                </h4>
                <button
                  onClick={handleRegenerateHeadline}
                  disabled={state.headlineLoading}
                  className="flex items-center px-6 py-3 text-sm font-semibold text-purple-700 bg-white/80 backdrop-blur-sm border border-purple-300/50 rounded-xl hover:bg-purple-50 hover:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  {state.headlineLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate SEO Headline
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-start">
                  <div className="w-1 h-16 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-800 leading-relaxed mb-2">
                      "{headline}"
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      SEO Optimized • Local Discovery Ready • AI-Powered
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100/50">
                  <div className="text-lg font-bold text-purple-600">A+</div>
                  <div className="text-xs text-gray-600">Content Grade</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100/50">
                  <div className="text-lg font-bold text-purple-600">Local</div>
                  <div className="text-xs text-gray-600">Targeting</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100/50">
                  <div className="text-lg font-bold text-purple-600">Fresh</div>
                  <div className="text-xs text-gray-600">AI Generated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Insights Summary */}
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50">
            <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
              Business Insights Summary
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-semibold text-gray-800">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-800">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance Level:</span>
                  <span className={`font-semibold ${performance.color}`}>{performance.level}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Rating:</span>
                  <span className="font-semibold text-gray-800">{rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Review Count:</span>
                  <span className="font-semibold text-gray-800">{reviews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Position:</span>
                  <span className="font-semibold text-green-600">{competitiveRank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => dispatch({ type: 'RESET_STATE' })}
              className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Analyze Another Business
            </button>
            <button 
              onClick={exportBusinessReport}
              className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Business Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDisplay;