# Quick Reference Guide

Common patterns and snippets for interview challenges.

## Debouncing

```javascript
// Vanilla JS
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// React Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Local Storage

```javascript
// Save
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Load
const loadFromStorage = (key, defaultValue = null) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};
```

## Keyboard Navigation

```javascript
const handleKeyDown = (e) => {
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      // Move down
      break;
    case 'ArrowUp':
      e.preventDefault();
      // Move up
      break;
    case 'Enter':
      // Select current
      break;
    case 'Escape':
      // Close/cancel
      break;
  }
};
```

## Async Data Fetching (React)

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(url);
    const json = await response.json();
    setData(json);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Array Sorting

```javascript
// Sort strings
items.sort((a, b) => a.name.localeCompare(b.name));

// Sort numbers
items.sort((a, b) => a.value - b.value);

// Sort dates
items.sort((a, b) => new Date(a.date) - new Date(b.date));

// Toggle sort direction
const sortedData = [...data].sort((a, b) => {
  const result = a[sortKey] > b[sortKey] ? 1 : -1;
  return sortDirection === 'asc' ? result : -result;
});
```

## Pagination

```javascript
const paginate = (items, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return items.slice(startIndex, endIndex);
};

const totalPages = Math.ceil(items.length / pageSize);
```

## Form Validation

```javascript
const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password || values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
};
```

## Drag and Drop (vanilla JS)

```javascript
// Make draggable
element.draggable = true;

element.addEventListener('dragstart', (e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
});

// Drop zone
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/html');
  // Handle drop
});
```

## CSS Flexbox Layout

```css
/* Center content */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive grid */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.grid-item {
  flex: 1 1 300px;
}
```

## Accessibility Basics

```html
<!-- ARIA labels -->
<button aria-label="Close dialog">×</button>

<!-- ARIA live regions -->
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

<!-- Keyboard focusable -->
<div tabindex="0" role="button">Click me</div>

<!-- Form labels -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true" />
```

## Performance Optimization (React)

```javascript
// Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// Prevent unnecessary re-renders
const MemoizedComponent = memo(Component);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

## Common Interview Gotchas

1. **Event delegation** - Better than individual listeners
2. **Closures** - Watch out for stale closures in React
3. **Async timing** - Race conditions in API calls
4. **Array mutations** - Always create new arrays in React
5. **Key prop** - Required for list items in React
6. **Memory leaks** - Clean up timers and subscriptions
7. **XSS** - Sanitize user input before rendering
