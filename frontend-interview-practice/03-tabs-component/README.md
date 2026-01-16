# Challenge 3: Tabs Component

**Time Limit:** 30 minutes
**Difficulty:** Basic
**Tech:** React + Vite

## Requirements

Build a tabbed interface component.

### Must Have
1. At least 3 tabs with different content
2. Click tab to switch active content
3. Only one tab active at a time
4. Clear visual indicator for active tab
5. Keyboard navigation (arrow keys to switch)
6. Content transitions smoothly

### Bonus (if time permits)
- Configurable tabs via JSON/array
- Lazy load content (fetch on first open)
- URL hash navigation (#tab1, #tab2)
- Swipe gestures for mobile
- Vertical tab layout option

## Example Structure

```javascript
const tabs = [
  { id: 'profile', label: 'Profile', content: 'User profile content...' },
  { id: 'settings', label: 'Settings', content: 'Settings content...' },
  { id: 'history', label: 'History', content: 'History content...' }
];
```

## Evaluation Criteria

- ✅ Only active tab content is visible
- ✅ Tab switching is smooth and immediate
- ✅ Keyboard navigation works
- ✅ Active state clearly visible
- ✅ Code is reusable/configurable

## Test Cases

1. Click each tab → content should change
2. Active tab should have different styling
3. Press arrow right → should move to next tab
4. Press arrow left → should move to previous tab
5. At last tab, arrow right → should wrap to first tab (optional)
6. Reload page → should remember last active tab (bonus)
