import { useState, useEffect } from 'react'
import './App.css'

// Mock search function
const mockSearch = async (query) => {
  const items = [
    'Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Cranberry',
    'Date', 'Dragonfruit', 'Elderberry', 'Fig', 'Grape', 'Grapefruit',
    'Honeydew', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya',
    'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry'
  ]

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // TODO: Implement debouncing
  // Hint: Use useEffect with setTimeout
  // Clear previous timeout on each keystroke
  // Only search if query length >= 2

  // TODO: Implement keyboard navigation
  // Track selectedIndex state
  // Handle ArrowUp, ArrowDown, Enter, Escape

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    // TODO: Trigger debounced search
  }

  const handleSelectResult = (item) => {
    setQuery(item)
    setShowDropdown(false)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Autocomplete Search</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a fruit..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            // TODO: Add onKeyDown for keyboard navigation
          />

          {loading && <div className="loading">Loading...</div>}

          {showDropdown && query.length >= 2 && !loading && (
            <ul className="results-dropdown">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <li
                    key={item}
                    className="result-item"
                    onClick={() => handleSelectResult(item)}
                    // TODO: Add selected class for keyboard navigation
                  >
                    {/* TODO: Highlight matching text */}
                    {item}
                  </li>
                ))
              ) : (
                <li className="no-results">No results found</li>
              )}
            </ul>
          )}
        </div>

        <div className="hint">
          <p>Start typing to search (min 2 characters)</p>
          <p>Features to implement:</p>
          <ul>
            <li>Debouncing (300ms)</li>
            <li>Loading state</li>
            <li>Keyboard navigation (↑↓ Enter Escape)</li>
            <li>Highlight matching text</li>
            <li>Click outside to close</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
