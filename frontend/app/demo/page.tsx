'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  async function checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result = await response.json();
      
      // Handle new standard response format
      if (result.status_code && result.data) {
        if (!result.status || !result.data.parlant_ready) {
          setError('⚠️ Backend not ready. Please make sure parlant_agent_server.py is running.');
        }
      } else {
        // Fallback for old format
        if (!result.parlant_ready) {
          setError('⚠️ Backend not ready. Please make sure parlant_agent_server.py is running.');
        }
      }
    } catch (err) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const apiPort = apiUrl.split(':').pop() || '5000';
      setError(`⚠️ Cannot connect to API server. Make sure api_server.py is running on port ${apiPort}.`);
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
          throw new Error(result.message || 'Failed to get comparison');
        }
        // Extract data from the standard response format
        setResults(result.data);
      } else if (!response.ok) {
        // Fallback for old format or error responses
        let errorMessage = 'Failed to get comparison';
        if (result.message) {
          errorMessage = result.message;
        } else if (result.error) {
          errorMessage = result.error;
        }
        throw new Error(errorMessage);
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
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(`Error: ${errorMessage}`);
      console.error('Comparison error:', err);
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
          throw new Error(result.message || 'Failed to load demo queries');
        }
        setDemoQueries(result.data.queries || []);
      } else if (!response.ok) {
        throw new Error(`Failed to load demo queries: ${response.status} ${response.statusText}`);
      } else {
        // Fallback for old format
        setDemoQueries(result.queries || []);
      }
      setShowDemoQueries(true);
    } catch (err: any) {
      setError(`Error loading demo queries: ${err.message}`);
      console.error('Demo queries error:', err);
    }
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
      '<strong style="color: #10b981;">📋 Guidelines:</strong>'
    );
    formatted = formatted.replace(
      /Tools:/g,
      '<strong style="color: #6366f1;">🔧 Tools:</strong>'
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
            onChange={(e) => setQuery(e.target.value)}
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
    </div>
  );
}

