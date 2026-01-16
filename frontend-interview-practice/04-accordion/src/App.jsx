import { useState } from 'react'
import './App.css'

const faqData = [
  {
    id: 1,
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces. It lets you create reusable components and manage state efficiently.'
  },
  {
    id: 2,
    question: 'How do I use hooks?',
    answer: 'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, and useContext.'
  },
  {
    id: 3,
    question: 'What is JSX?',
    answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write markup in your JavaScript files.'
  },
  {
    id: 4,
    question: 'What is the Virtual DOM?',
    answer: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by calculating the minimal set of changes needed.'
  }
]

function App() {
  // TODO: Add your state management here
  // Hint: You'll need state for:
  // - openId: the id of the currently open accordion item (for single mode)
  // - or openIds: array of open ids (for multi mode)

  // TODO: Implement these functions:
  // - toggleItem: Open/close an accordion item
  // - handleKeyDown: Keyboard navigation (optional)

  return (
    <div className="app">
      <div className="container">
        <h1>FAQ Accordion</h1>

        <div className="accordion">
          {/* TODO: Map over faqData and create accordion items */}
          {/*
            Structure for each item:
            - Button/header with question and icon
            - Content area (shown/hidden based on state)
            - Use onClick to toggle
            - Add transition class for smooth animation
          */}

          <p className="hint">Build your accordion component here!</p>
        </div>
      </div>
    </div>
  )
}

export default App
