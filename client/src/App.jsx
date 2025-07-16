import { useState } from 'react';
// Removed: import './App.css'; // No longer needed if using Tailwind

function App() {
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = '/api/accessibility/analyze'; // Assuming Vite proxy is set up

  const analyze = async (e) => {
    e.preventDefault();

    if (!urlToAnalyze.trim()) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToAnalyze }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch analysis results.');
      }

      const data = await response.json();
      setAnalysisResult(data.data);
      console.log('Analysis Result from Backend:', data.data);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-700 text-white flex flex-col items-center justify-center py-10"> {/* Overall container */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"> {/* Main card */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Accessibility Analyzer</h1>

        <form onSubmit={analyze} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="url"
            value={urlToAnalyze}
            onChange={(e) => setUrlToAnalyze(e.target.value)}
            placeholder="Enter URL to analyze (e.g., https://example.com)"
            required
            disabled={loading}
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {analysisResult && (
          <div className="results-section mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Analysis Results for: <a href={analysisResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{analysisResult.url}</a>
            </h2>
            <p className="text-gray-600 mb-6">Analysis Time: {new Date(analysisResult.timestamp).toLocaleString()}</p>

            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">Accessibility Violations ({analysisResult.violations?.length || 0})</h3>
            {analysisResult.violations && analysisResult.violations.length > 0 ? (
              <ul className="space-y-4">
                {analysisResult.violations.map((violation, index) => (
                  <li key={index} className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
                    <strong className={`font-bold ${violation.impact === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                      {violation.impact?.toUpperCase()}:
                    </strong>
                    <span className="ml-2 text-gray-800">{violation.description}</span>
                    <br />
                    <span className="font-medium text-gray-600 block mt-2">Nodes:</span>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 text-sm">
                      {violation.nodes?.map((node, nodeIndex) => (
                        <li key={nodeIndex}>
                          <code className="bg-gray-100 p-1 rounded-sm text-xs break-all">{node.html}</code>
                          <br />
                          <small className="text-gray-500 block mt-1">
                            Help: <a href={node.helpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{node.help}</a>
                          </small>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">No accessibility violations found by axe-core.</p>
            )}

            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b border-gray-200 pb-2">AI-Generated Alt Texts ({analysisResult.aiAltTexts?.length || 0})</h3>
            {analysisResult.aiAltTexts && analysisResult.aiAltTexts.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.aiAltTexts.map((alt, index) => (
                  <li key={index} className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                    <img src={alt.imageUrl} alt="Image for AI alt text generation" className="w-20 h-20 object-cover rounded-md border border-blue-300" />
                    <div>
                      <p className="text-gray-700 text-sm break-all">Original Image URL: <a href={alt.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{alt.imageUrl}</a></p>
                      <p className="text-gray-800 mt-1">AI Alt Text: <strong className="text-blue-800">{alt.altText}</strong></p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">No images found without alt text, or AI service could not generate for any.</p>
            )}

            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-b border-gray-200 pb-2">Readability Score</h3>
            {analysisResult.readabilityScore !== null && analysisResult.readabilityScore !== undefined ? (
              <p className="text-lg font-medium text-purple-700 bg-purple-50 p-4 rounded-lg border border-purple-200">
                Flesch-Kincaid Readability Score (or similar): <strong className="text-purple-900">{analysisResult.readabilityScore}</strong>
              </p>
            ) : (
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">Readability analysis could not be performed.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export default App;