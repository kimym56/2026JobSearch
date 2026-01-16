# Challenge 6: Autocomplete Search

**Time Limit:** 45 minutes
**Difficulty:** Intermediate
**Tech:** React + Vite

## Requirements

Build an autocomplete/typeahead search component.

### Must Have
1. Input field that triggers search as user types
2. Debounce API calls (300ms after user stops typing)
3. Display loading state while fetching
4. Show dropdown list of results
5. Highlight matching text in results
6. Click to select a result
7. Keyboard navigation (arrow keys, enter to select, escape to close)
8. Handle empty results gracefully
9. Handle API errors

### Bonus (if time permits)
- Cache previous searches
- Clear button (x icon in input)
- Recent searches
- Minimum character requirement (e.g., 3 chars)
- Show "No results found" message

## Mock API

Use this free API for testing:
```
https://jsonplaceholder.typicode.com/users?name_like={query}
```

Or create a mock function:
```javascript
const mockSearch = (query) => {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
                 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(items.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ));
    }, 500);
  });
};
```

## Evaluation Criteria

- ✅ Debouncing implemented correctly (no excessive API calls)
- ✅ Loading states shown
- ✅ Keyboard navigation works smoothly
- ✅ Results update as user types
- ✅ Clean UI/UX
- ✅ Error handling

## Key Concepts

- Debouncing
- Async operations
- Keyboard event handling
- Accessibility (ARIA attributes)

## Test Cases

1. Type slowly → should see results update
2. Type quickly → should only make one API call after stopping
3. Press arrow down → should highlight first result
4. Press enter → should select highlighted result
5. Press escape → should close dropdown
6. Click outside → should close dropdown
7. Type invalid query → should handle gracefully
