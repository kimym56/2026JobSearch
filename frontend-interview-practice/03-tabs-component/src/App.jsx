import { useState } from 'react'
import './App.css'

// Sample tabs data
const tabsData = [
  { id: 'profile', label: 'Profile', content: 'User profile information goes here. Name, email, bio, etc.' },
  { id: 'settings', label: 'Settings', content: 'Application settings go here. Theme, notifications, privacy, etc.' },
  { id: 'history', label: 'History', content: 'User activity history goes here. Recent actions, logs, etc.' }
]

function App() {
  // TODO: Add your state management here
  // Hint: You'll need state for:
  // - activeTab: the currently selected tab id

  // TODO: Implement keyboard navigation
  // - Arrow Left/Right to switch tabs
  // - Home/End to go to first/last tab

  return (
    <div className="app">
      <div className="container">
        <h1>Tabs Component</h1>

        {/* TODO: Add your tabs implementation here */}
        {/*
          Structure suggestion:
          - Tab buttons list (map over tabsData)
          - Active tab content area
          - Apply active class to selected tab
          - Handle keyboard events (onKeyDown)
        */}

        <div className="tabs">
          <div className="tab-list" role="tablist">
            {/* Map tabs here */}
          </div>
          <div className="tab-content">
            {/* Show active tab content */}
            <p className="hint">Click a tab to see its content!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
