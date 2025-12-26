'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : '/api';

interface ComparisonResult {
  query: string;
  traditional_response: string;
  parlant_response: string;
  reasoning: string;
}

export default function DemoPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [demoQueries, setDemoQueries] = useState<string[]>([]);
  const [showDemoQueries, setShowDemoQueries] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  // Clear "Please enter a query" error when query becomes non-empty
  useEffect(() => {
    if (query.trim() && error && (error.includes('Please enter a query') || error.includes('enter a query'))) {
      setError(null);
    }
  }, [query, error]);

  async function checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result = await response.json();
      
      // Handle new standard response format
      if (result.status_code && result.data) {
        if (!result.status || !result.data.parlant_ready) {
          setError('⚠️ Backend not ready. Please make sure the Parlant agent server is running.');
        }
      } else {
        // Fallback for old format
        if (!result.parlant_ready) {
          setError('⚠️ Backend not ready. Please make sure the Parlant agent server is running.');
        }
      }
    } catch (err: any) {
      // Log detailed error for debugging
      console.error('Health check failed:', {
        error: err,
        message: err.message,
        stack: err.stack,
        apiUrl: API_BASE_URL
      });
      
      // Show friendly message to user
      setError('⚠️ Unable to connect to the backend server. Please ensure all services are running.');
    }
  }

  async function handleCompare() {
    const queryText = query.trim();
    
    if (!queryText) {
      setError('Please enter a query to compare.');
      return;
    }
    
    setError(null);
    setResults(null);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryText }),
      });
      
      const result = await response.json();
      
      // Handle new standard response format
      if (result.status_code && result.data) {
        if (!result.status || result.status_code >= 400) {
          // Log detailed error
          console.error('Comparison API error:', {
            status_code: result.status_code,
            message: result.message,
            path: result.path,
            fullResponse: result
          });
          
          // Show friendly message
          const friendlyMessage = getFriendlyErrorMessage(result.message || 'Failed to process comparison');
          throw new Error(friendlyMessage);
        }
        // Extract data from the standard response format
        setResults(result.data);
      } else if (!response.ok) {
        // Log detailed error
        console.error('Comparison API error:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        
        // Show friendly message
        const friendlyMessage = getFriendlyErrorMessage(
          result.message || result.error || 'Failed to process comparison'
        );
        throw new Error(friendlyMessage);
      } else {
        // Old format fallback
        setResults(result);
      }
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (err: any) {
      // Log detailed error for debugging
      console.error('Comparison error:', {
        error: err,
        message: err.message,
        stack: err.stack,
        query: queryText
      });
      
      // Show friendly message to user
      const friendlyMessage = getFriendlyErrorMessage(err.message || 'An unexpected error occurred');
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  }

  async function loadDemoQueries() {
    if (demoQueries.length > 0) {
      setShowDemoQueries(!showDemoQueries);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/demo-queries`);
      const result = await response.json();
      
      // Handle new standard response format
      if (result.status_code && result.data) {
        if (!result.status || result.status_code >= 400) {
          // Log detailed error
          console.error('Demo queries API error:', {
            status_code: result.status_code,
            message: result.message,
            fullResponse: result
          });
          
          throw new Error('Unable to load demo queries. Please try again later.');
        }
        setDemoQueries(result.data.queries || []);
      } else if (!response.ok) {
        // Log detailed error
        console.error('Demo queries API error:', {
          status: response.status,
          statusText: response.statusText,
          result: result
        });
        
        throw new Error('Unable to load demo queries. Please try again later.');
      } else {
        // Fallback for old format
        setDemoQueries(result.queries || []);
      }
      setShowDemoQueries(true);
    } catch (err: any) {
      // Log detailed error for debugging
      console.error('Demo queries error:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      
      // Show friendly message to user
      setError('Unable to load demo queries. Please try again later.');
    }
  }

  // Helper function to convert technical errors to friendly messages
  function getFriendlyErrorMessage(technicalMessage: string): string {
    const lowerMessage = technicalMessage.toLowerCase();
    
    // Connection errors
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
      return 'Unable to connect to the server. Please check your internet connection and ensure all services are running.';
    }
    
    // Server errors
    if (lowerMessage.includes('500') || lowerMessage.includes('internal server')) {
      return 'The server encountered an error while processing your request. Please try again in a moment.';
    }
    
    // Not found errors
    if (lowerMessage.includes('404') || lowerMessage.includes('not found')) {
      return 'The requested service is not available. Please ensure all services are running.';
    }
    
    // Timeout errors
    if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
      return 'The request took too long to process. Please try again with a simpler query.';
    }
    
    // Parlant/agent errors
    if (lowerMessage.includes('parlant') || lowerMessage.includes('agent') || lowerMessage.includes('session')) {
      return 'The AI agent is not responding. Please ensure the Parlant agent server is running and try again.';
    }
    
    // API key errors
    if (lowerMessage.includes('api key') || lowerMessage.includes('authentication') || lowerMessage.includes('unauthorized')) {
      return 'Authentication failed. Please check your API configuration.';
    }
    
    // Generic error
    return 'Something went wrong while processing your request. Please try again.';
  }

  function handleQueryClick(selectedQuery: string) {
    setQuery(selectedQuery);
    setShowDemoQueries(false);
    handleCompare();
  }

  function clearAll() {
    setQuery('');
    setError(null);
    setResults(null);
    setShowDemoQueries(false);
  }

  function formatReasoning(reasoning: string) {
    if (!reasoning || reasoning === '(no explicit tools/guidelines recorded)') {
      return 'No explicit tools/guidelines recorded for this query.';
    }
    
    let formatted = reasoning;
    formatted = formatted.replace(
      /Guidelines:/g,
      '<strong style="color: #8BAE66;">📋 Guidelines:</strong>'
    );
    formatted = formatted.replace(
      /Tools:/g,
      '<strong style="color: #628141;">🔧 Tools:</strong>'
    );
    formatted = formatted.replace(/\s*\|\s*/g, '<br><br>');
    
    return formatted;
  }

  return (
    <div className="container">
      <header className="demo-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Live Comparison Demo</h1>
        <p className="subtitle">Enter a query below to see how both approaches handle the same question</p>
      </header>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="query-input">Enter your query:</label>
          <textarea
            id="query-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // Clear error when user starts typing (especially if it's the "Please enter a query" error)
              if (error && (error.includes('Please enter a query') || error.includes('enter a query'))) {
                setError(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                handleCompare();
              }
            }}
            placeholder="e.g., I want to replace my existing $500k term policy with a whole life policy. What should I do?"
            rows={3}
          />
        </div>
        
        <div className="button-group">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary"
          >
            Compare Responses
          </button>
          <button
            onClick={loadDemoQueries}
            disabled={loading}
            className="btn btn-secondary"
          >
            Load Demo Queries
          </button>
          <button
            onClick={clearAll}
            className="btn btn-outline"
          >
            Clear
          </button>
        </div>
      </div>

      {showDemoQueries && demoQueries.length > 0 && (
        <div className="demo-queries">
          <h3>Demo Queries:</h3>
          <div className="query-list">
            {demoQueries.map((q, index) => (
              <div
                key={index}
                className="query-item"
                onClick={() => handleQueryClick(q)}
              >
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing comparison...</p>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {results && (
        <div id="results" className="results">
          <div className="comparison-header">
            <h2>Comparison Results</h2>
          </div>
          
          <div className="query-display">
            <h3>📝 Query:</h3>
            <p className="query-display-text">{results.query}</p>
          </div>

          <div className="comparison-grid">
            <div className="response-card traditional">
              <div className="card-header">
                <h3>🤖 Traditional LLM</h3>
                <span className="card-badge">Monolithic Prompt</span>
              </div>
              <div className="card-content">
                {results.traditional_response || 'No response received'}
              </div>
            </div>

            <div className="response-card parlant">
              <div className="card-header">
                <h3>🎯 Parlant Agent</h3>
                <span className="card-badge success">Structured Guidelines</span>
              </div>
              <div className="card-content">
                {results.parlant_response || 'No response received'}
              </div>
            </div>
          </div>

          <div className="reasoning-section">
            <h3>🧠 Reasoning & Guidelines</h3>
            <div
              className="reasoning-content"
              dangerouslySetInnerHTML={{ __html: formatReasoning(results.reasoning) }}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

