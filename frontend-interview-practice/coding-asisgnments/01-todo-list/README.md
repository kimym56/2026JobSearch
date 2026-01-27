# Challenge 1: Todo List

**Time Limit:** 30 minutes
**Difficulty:** Basic
**Tech:** React + Vite

## Requirements

Build a todo list application with the following features:

### Must Have
1. Add new todos via input field + button
2. Mark todos as complete (toggle)
3. Delete individual todos
4. Display total count and completed count
5. Clear all completed todos button
6. Persist data in localStorage

### Bonus (if time permits)
- Edit existing todos
- Filter: All / Active / Completed
- Prevent empty todos from being added
- Basic styling (no framework needed)

## Evaluation Criteria

- ✅ All core features work correctly
- ✅ Code is clean and organized
- ✅ Data persists after page refresh
- ✅ No console errors
- ✅ Handles edge cases (empty input, etc.)

## Data Structure

```javascript
// Suggested state structure
const [todos, setTodos] = useState([]);

// Individual todo object
{
  id: Date.now() or crypto.randomUUID(),
  text: string,
  completed: boolean,
  createdAt: timestamp
}
```

## Getting Started

```bash
npm install
npm run dev
# Open http://localhost:5173
# Edit src/App.jsx and start coding!
```

## Test Cases

- Add multiple todos
- Mark some as complete
- Delete a todo
- Refresh page (should persist)
- Clear completed todos
- Try to add empty todo (should prevent)
