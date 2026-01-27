import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const triggerButtonRef = useRef(null)

  // TODO: Implement modal functionality
  // Key tasks:
  // 1. Prevent body scroll when modal is open (add/remove class on body)
  // 2. Handle Escape key to close (useEffect with event listener)
  // 3. Handle click outside to close (check if clicked element is overlay)
  // 4. Focus management:
  //    - Save reference to trigger button
  //    - Focus first focusable element in modal when opened
  //    - Return focus to trigger button when closed
  // 5. Focus trap (prevent tab from leaving modal)

  const openModal = () => {
    setIsOpen(true)
    // TODO: Add body class to prevent scroll
  }

  const closeModal = () => {
    setIsOpen(false)
    // TODO: Remove body class, restore focus to trigger button
  }

  // TODO: Add useEffect for Escape key handler
  // useEffect(() => {
  //   const handleEscape = (e) => {
  //     if (e.key === 'Escape' && isOpen) {
  //       closeModal()
  //     }
  //   }
  //   window.addEventListener('keydown', handleEscape)
  //   return () => window.removeEventListener('keydown', handleEscape)
  // }, [isOpen])

  return (
    <div className="app">
      <div className="container">
        <h1>Modal Dialog</h1>
        <p>Click the button below to open the modal dialog.</p>

        <button
          ref={triggerButtonRef}
          onClick={openModal}
          className="open-button"
        >
          Open Modal
        </button>

        {/* TODO: Render modal when isOpen is true */}
        {isOpen && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              // TODO: Close if clicked on overlay (not modal content)
              // if (e.target === e.currentTarget) closeModal()
            }}
          >
            <div
              className="modal-content"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={closeModal}
                className="close-button"
                aria-label="Close modal"
              >
                ×
              </button>

              <h2 id="modal-title">Modal Title</h2>
              <p>
                This is a modal dialog. You can close it by:
              </p>
              <ul>
                <li>Clicking the X button</li>
                <li>Pressing Escape</li>
                <li>Clicking outside the modal</li>
              </ul>

              <div className="modal-actions">
                <button onClick={closeModal} className="button-primary">
                  Confirm
                </button>
                <button onClick={closeModal} className="button-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
