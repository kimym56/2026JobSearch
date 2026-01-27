import { useState } from 'react'
import './App.css'

function App() {
  // TODO: Add your state management here
  // Hint: You'll need state for:
  // - currentCount: the current counter value
  // - history: stack of previous states for undo
  // - redoStack: stack of states for redo

  // TODO: Implement these functions:
  // - increment: Add 1 to counter
  // - decrement: Subtract 1 from counter
  // - reset: Set counter to 0
  // - undo: Revert to previous state
  // - redo: Reapply undone state

  // Key concept: Command Pattern
  // Each operation should:
  // 1. Save current state to history
  // 2. Update currentCount
  // 3. Clear redoStack (new action invalidates redo)

  return (
    <div className="app">
      <div className="container">
        <h1>Counter with History</h1>

        {/* TODO: Add your JSX here */}
        {/*
          Structure suggestion:
          - Large display for current count
          - Button group: +1, -1, Reset
          - Button group: Undo, Redo (with disabled state)
          - History list showing all operations
        */}

        <div className="counter-display">
          <h2>Count: 0</h2>
        </div>

        <p className="hint">Start implementing the counter logic here!</p>
      </div>
    </div>
  )
}

export default App
