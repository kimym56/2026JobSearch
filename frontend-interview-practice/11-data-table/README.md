# Challenge 11: Interactive Data Table

**Time Limit:** 60-90 minutes
**Difficulty:** Advanced
**Tech:** React + Vite

## Requirements

Build a feature-rich data table component.

### Must Have
1. Display data in table format
2. Column sorting (click header to sort asc/desc)
3. Search/filter across all columns
4. Pagination (10, 25, 50 items per page)
5. Show page numbers and navigation
6. Display total count and current range
7. Loading state while fetching data
8. Responsive design (works on mobile)
9. Empty state when no data

### Bonus (if time permits)
- Column filtering (individual column filters)
- Multi-column sorting
- Select rows (checkbox)
- Bulk actions (delete selected)
- Export to CSV
- Resizable columns
- Column visibility toggle
- Sticky header on scroll

## Mock Data

Use this API:
```
https://jsonplaceholder.typicode.com/users
```

Or create mock data:
```javascript
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  // ... more users
];
```

## Evaluation Criteria

- ✅ Sorting works correctly for different data types
- ✅ Filtering/search updates results instantly
- ✅ Pagination calculations correct
- ✅ Performance good with large datasets
- ✅ Code is well-organized and maintainable
- ✅ UI is clean and intuitive
- ✅ Accessible (keyboard navigation, screen readers)

## Key Concepts

- Complex state management
- Array manipulation (sort, filter, slice)
- Performance optimization (memoization)
- Component composition
- Controlled components

## Test Cases

1. Click column header → should sort ascending
2. Click again → should sort descending
3. Click third time → should return to original order
4. Type in search → should filter results
5. Change page size → should recalculate pagination
6. Go to last page → next button should be disabled
7. Filter to 0 results → should show empty state
8. Sort with active filter → should sort filtered results
9. Test with 1000+ rows → should perform well

## Architecture Tips

```javascript
// Suggested component structure
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ]}
  pageSize={10}
  searchable={true}
/>
```

## Performance Considerations

- Don't re-sort/filter on every render
- Use useMemo for expensive calculations
- Debounce search input
- Virtual scrolling for very large datasets (bonus)
