# Challenge 4: Accordion Component

**Time Limit:** 30 minutes
**Difficulty:** Basic
**Tech:** React + Vite

## Requirements

Build a collapsible accordion component.

### Must Have
1. At least 3-4 accordion items
2. Click to expand/collapse each item
3. Show +/- or arrow icon based on state
4. Smooth open/close animation
5. Only one item open at a time (single mode)
6. Clear visual hierarchy

### Bonus (if time permits)
- Multiple items can be open (multi mode)
- Toggle between single/multi mode
- Keyboard navigation (arrow keys, Enter, Space)
- "Expand All" / "Collapse All" buttons
- Nested accordions
- Save state to localStorage

## Example Data

```javascript
const faqData = [
  {
    id: 1,
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces...'
  },
  {
    id: 2,
    question: 'How do I use hooks?',
    answer: 'Hooks are functions that let you use state and other React features...'
  },
  {
    id: 3,
    question: 'What is JSX?',
    answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML...'
  }
];
```

## Evaluation Criteria

- ✅ All items can be opened/closed
- ✅ Animation is smooth
- ✅ Single-open mode works correctly
- ✅ Visual feedback clear
- ✅ Code is reusable/configurable

## Key Concepts

- Conditional rendering
- Controlled components
- CSS transitions
- Event handling

## Test Cases

1. Click item 1 → should open
2. Click item 2 → item 1 should close, item 2 should open
3. Click same item twice → should toggle closed
4. All items start closed
5. Animation should be smooth (no jumps)
