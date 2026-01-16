# Challenge 7: Infinite Scroll

**Time Limit:** 45 minutes
**Difficulty:** Intermediate
**Tech:** React + Vite

## Requirements

Build a paginated list with infinite scroll functionality.

### Must Have
1. Display list of items (20 items initially)
2. Detect when user scrolls near bottom
3. Auto-load next page when scrolled to bottom
4. Show loading indicator while fetching
5. Handle end of data (no more pages)
6. Smooth scroll experience (no jumpiness)
7. Error handling for failed requests
8. Show total count

### Bonus (if time permits)
- Scroll to top button (appears after scrolling down)
- Skeleton loading states
- Retry failed requests
- Virtual scrolling for better performance
- Pull to refresh
- Bidirectional scroll (load above too)

## Mock API

```javascript
const fetchItems = async (page, pageSize = 20) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const start = (page - 1) * pageSize
  const items = Array.from({ length: pageSize }, (_, i) => ({
    id: start + i + 1,
    title: `Item ${start + i + 1}`,
    description: `Description for item ${start + i + 1}`
  }))

  return {
    data: items,
    hasMore: page < 10, // Total 200 items
    total: 200
  }
}
```

Or use real API:
```
https://jsonplaceholder.typicode.com/posts?_page=1&_limit=20
```

## Evaluation Criteria

- ✅ Infinite scroll triggers correctly
- ✅ No duplicate API calls
- ✅ Loading states shown
- ✅ Handles end of data gracefully
- ✅ Performance is smooth
- ✅ Error handling implemented

## Key Concepts

- Intersection Observer API (recommended) or scroll event
- Pagination logic
- Async data fetching
- State management for loading/error
- Performance optimization

## Implementation Options

**Option 1: Intersection Observer (recommended)**
```javascript
const observerTarget = useRef(null)

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore()
      }
    },
    { threshold: 1 }
  )

  if (observerTarget.current) {
    observer.observe(observerTarget.current)
  }

  return () => observer.disconnect()
}, [hasMore, loading])
```

**Option 2: Scroll Event**
```javascript
useEffect(() => {
  const handleScroll = () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (bottom && hasMore && !loading) {
      loadMore()
    }
  }

  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [hasMore, loading])
```

## Test Cases

1. Load page → should show first 20 items
2. Scroll to bottom → should load next 20
3. Continue scrolling → should keep loading
4. Reach end → should show "No more items"
5. Scroll quickly → should not duplicate requests
6. Simulate error → should show error and allow retry
7. Network slow → should show loading spinner
