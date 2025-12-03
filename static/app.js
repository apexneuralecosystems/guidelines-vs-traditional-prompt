// Use relative URL for API calls (works when served from same origin)
const API_BASE_URL = '/api';

// DOM elements
const queryInput = document.getElementById('query-input');
const compareBtn = document.getElementById('compare-btn');
const demoBtn = document.getElementById('demo-btn');
const clearBtn = document.getElementById('clear-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const demoQueries = document.getElementById('demo-queries');
const queryList = document.querySelector('.query-list');

// Event listeners
compareBtn.addEventListener('click', handleCompare);
demoBtn.addEventListener('click', loadDemoQueries);
clearBtn.addEventListener('click', clearAll);
queryInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        handleCompare();
    }
});

// Load demo queries on page load
window.addEventListener('load', () => {
    checkHealth();
});

async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (!data.parlant_ready) {
            showError('⚠️ Backend not ready. Please make sure parlant_agent_server.py is running.');
        }
    } catch (err) {
        showError('⚠️ Cannot connect to API server. Make sure api_server.py is running on port 5000.');
    }
}

async function handleCompare() {
    const query = queryInput.value.trim();
    
    if (!query) {
        showError('Please enter a query to compare.');
        return;
    }
    
    // Hide previous results and errors
    hideError();
    hideResults();
    showLoading();
    disableButtons(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/compare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get comparison');
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (err) {
        showError(`Error: ${err.message}`);
    } finally {
        hideLoading();
        disableButtons(false);
    }
}

async function loadDemoQueries() {
    if (queryList.children.length > 0) {
        demoQueries.classList.toggle('hidden');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/demo-queries`);
        const data = await response.json();
        
        queryList.innerHTML = '';
        data.queries.forEach((query, index) => {
            const queryItem = document.createElement('div');
            queryItem.className = 'query-item';
            queryItem.textContent = query;
            queryItem.addEventListener('click', () => {
                queryInput.value = query;
                demoQueries.classList.add('hidden');
                handleCompare();
            });
            queryList.appendChild(queryItem);
        });
        
        demoQueries.classList.remove('hidden');
    } catch (err) {
        showError(`Error loading demo queries: ${err.message}`);
    }
}

function displayResults(data) {
    // Display query
    document.getElementById('query-display-text').textContent = data.query;
    
    // Display traditional response
    const traditionalEl = document.getElementById('traditional-response');
    traditionalEl.textContent = data.traditional_response || 'No response received';
    
    // Display Parlant response
    const parlantEl = document.getElementById('parlant-response');
    parlantEl.textContent = data.parlant_response || 'No response received';
    
    // Display reasoning
    const reasoningEl = document.getElementById('reasoning-display');
    if (data.reasoning && data.reasoning !== '(no explicit tools/guidelines recorded)') {
        // Format reasoning text
        let formattedReasoning = data.reasoning;
        
        // Highlight guidelines and tools
        formattedReasoning = formattedReasoning.replace(
            /Guidelines:/g,
            '<strong style="color: #10b981;">📋 Guidelines:</strong>'
        );
        formattedReasoning = formattedReasoning.replace(
            /Tools:/g,
            '<strong style="color: #6366f1;">🔧 Tools:</strong>'
        );
        
        // Replace pipe separators with line breaks
        formattedReasoning = formattedReasoning.replace(/\s*\|\s*/g, '<br><br>');
        
        reasoningEl.innerHTML = formattedReasoning;
    } else {
        reasoningEl.textContent = 'No explicit tools/guidelines recorded for this query.';
    }
    
    results.classList.remove('hidden');
    
    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function hideResults() {
    results.classList.add('hidden');
}

function disableButtons(disabled) {
    compareBtn.disabled = disabled;
    demoBtn.disabled = disabled;
}

function clearAll() {
    queryInput.value = '';
    hideError();
    hideResults();
    demoQueries.classList.add('hidden');
    queryList.innerHTML = '';
}

