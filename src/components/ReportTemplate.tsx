import React from 'react';
import { FileText, Download, Calendar, BarChart3, Star, MessageCircle, TrendingUp, Award, Target, Globe, Building2, Sparkles } from 'lucide-react';

interface ReportTemplateProps {
  businessData: {
    name: string;
    location: string;
    rating: number;
    reviews: number;
    headline: string;
  };
  onExport: () => void;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({ businessData, onExport }) => {
  const { name, location, rating, reviews, headline } = businessData;
  
  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.5) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (rating >= 4.0) return { level: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (rating >= 3.5) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const getEngagementLevel = (reviews: number) => {
    if (reviews >= 300) return 'High';
    if (reviews >= 150) return 'Medium-High';
    if (reviews >= 75) return 'Medium';
    return 'Growing';
  };

  const performance = getPerformanceLevel(rating);
  const engagement = getEngagementLevel(reviews);
  const seoScore = Math.round(85 + (rating - 3.5) * 10);
  const localVisibility = Math.round(70 + (reviews / 10));
  const competitiveRank = rating >= 4.5 ? 'Top 10%' : rating >= 4.0 ? 'Top 25%' : 'Top 50%';

  const reportData = {
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
      engagementLevel: engagement
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

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold">Business Analysis Report</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Business:</span>
                <div className="font-semibold">{reportData.businessInfo.name}</div>
              </div>
              <div>
                <span className="text-white/70">Location:</span>
                <div className="font-semibold">{reportData.businessInfo.location}</div>
              </div>
              <div>
                <span className="text-white/70">Report ID:</span>
                <div className="font-semibold">{reportData.businessInfo.reportId}</div>
              </div>
              <div>
                <span className="text-white/70">Analysis Date:</span>
                <div className="font-semibold">{reportData.businessInfo.analysisDate}</div>
              </div>
            </div>
          </div>
          <button
            onClick={onExport}
            className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
            Executive Summary
          </h2>
          <div className={`p-6 rounded-2xl ${performance.bg} ${performance.border} border`}>
            <p className="text-gray-700 leading-relaxed">
              <strong>{reportData.businessInfo.name}</strong> in {reportData.businessInfo.location} shows{' '}
              <span className={`font-semibold ${performance.color}`}>{reportData.metrics.performanceLevel.toLowerCase()}</span>{' '}
              performance with a <strong>{reportData.metrics.googleRating}/5.0</strong> rating and{' '}
              <strong>{reportData.metrics.totalReviews.toLocaleString()}</strong> reviews. The business demonstrates{' '}
              <strong>{reportData.metrics.engagementLevel.toLowerCase()}</strong> customer engagement and ranks in the{' '}
              <strong>{reportData.metrics.competitiveRank}</strong> of local competitors.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
            Key Performance Metrics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{reportData.metrics.googleRating}</div>
                  <div className="text-sm text-gray-600">Google Rating</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Out of 5.0 stars</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{reportData.metrics.totalReviews.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Customer feedback count</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{reportData.metrics.seoScore}%</div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Search optimization rating</div>
            </div>
          </div>
        </div>

        {/* SEO Headline Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
            AI-Generated SEO Headline
          </h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <blockquote className="text-xl font-semibold text-gray-800 italic mb-2">
              "{reportData.seoHeadline}"
            </blockquote>
            <div className="text-sm text-gray-600">
              Optimized for local search and customer engagement
            </div>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              Key Strengths
            </h3>
            <div className="space-y-3">
              {reportData.insights.strengths.map((strength, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {reportData.insights.improvements.length > 0 ? (
                reportData.insights.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{improvement}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">No major areas for improvement identified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-3 text-indigo-600" />
            Strategic Recommendations
          </h2>
          <div className="space-y-4">
            {reportData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full mr-4 flex-shrink-0 font-semibold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Next Steps
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Implement recommended improvements</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Monitor metrics monthly</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Update SEO content regularly</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Engage with customer feedback</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Track competitive positioning</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Schedule quarterly reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Report generated by GrowthProAI • {new Date().toLocaleString()}</p>
          <p className="mt-1">For questions or support, contact your business analyst</p>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplate;