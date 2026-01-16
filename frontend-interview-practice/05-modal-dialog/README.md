# Challenge 5: Modal Dialog

**Time Limit:** 45 minutes
**Difficulty:** Basic to Intermediate
**Tech:** React + Vite

## Requirements

Build an accessible modal dialog component.

### Must Have
1. Button to open modal
2. Modal overlay (darkens background)
3. Modal content area
4. Close button (X icon)
5. Click outside to close
6. Press Escape to close
7. Prevent body scroll when open
8. Focus trap (tab doesn't leave modal)
9. Return focus to trigger button on close
10. Smooth fade-in/out animation

### Bonus (if time permits)
- Different modal sizes (sm, md, lg)
- Confirmation modal with actions
- Modal with form
- Stack multiple modals
- Portal rendering (use ReactDOM.createPortal)
- Prevent close on outside click (optional prop)

## Evaluation Criteria

- ✅ Modal opens and closes correctly
- ✅ Keyboard navigation works (Escape, Tab)
- ✅ Focus management correct
- ✅ Accessibility attributes present (ARIA)
- ✅ Smooth animations
- ✅ Body scroll locked when open

## Key Concepts

- useEffect for side effects
- useRef for DOM references
- Event listeners (keydown, click)
- Focus management
- Portals (bonus)
- Accessibility (ARIA)

## Test Cases

1. Click "Open Modal" → modal should appear
2. Click X button → modal should close
3. Click overlay → modal should close
4. Press Escape → modal should close
5. Press Tab → focus should stay within modal
6. Close modal → focus returns to trigger button
7. Body should not scroll when modal is open
8. Multiple opens/closes should work smoothly

## Accessibility Requirements

```javascript
// ARIA attributes to include
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal content...</p>
</div>
```

## Focus Trap Implementation

The modal should:
1. Focus first focusable element on open
2. Trap tab navigation within modal
3. Handle Shift+Tab (backwards)
4. Restore focus on close
