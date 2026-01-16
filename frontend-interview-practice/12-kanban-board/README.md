# Challenge 12: Kanban Board

**Time Limit:** 90 minutes
**Difficulty:** Advanced
**Tech:** React + Vite

## Requirements

Build a Trello-like kanban board with drag-and-drop functionality.

### Must Have
1. **3 columns**: Todo, In Progress, Done
2. **Drag and drop** cards between columns
3. **Add new card** with title and description
4. **Edit card** inline
5. **Delete card** with confirmation
6. **Visual drag feedback** (ghost/placeholder)
7. **Persist state** to localStorage
8. **Card count** per column
9. **Responsive layout** (stacks on mobile)

### Bonus (if time permits)
- Add custom columns
- Reorder cards within column
- Card labels/tags with colors
- Due dates and priority
- Search/filter cards
- Card details modal
- Undo/redo for moves
- Multiple boards

## Data Structure

```javascript
const initialData = {
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      cardIds: ['card-1', 'card-2']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      cardIds: ['card-3']
    },
    'done': {
      id: 'done',
      title: 'Done',
      cardIds: []
    }
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Design homepage',
      description: 'Create mockups for the new homepage',
      createdAt: '2024-01-01'
    },
    'card-2': {
      id: 'card-2',
      title: 'Setup API',
      description: 'Initialize Express server'
    },
    'card-3': {
      id: 'card-3',
      title: 'Write tests',
      description: 'Add unit tests for auth'
    }
  },
  columnOrder: ['todo', 'in-progress', 'done']
};
```

## Drag and Drop Implementation

Choose one approach:

**Option 1: HTML5 Drag and Drop API**
```javascript
onDragStart={(e) => e.dataTransfer.setData('cardId', card.id)}
onDrop={(e) => handleDrop(e, columnId)}
```

**Option 2: React DnD library**
```javascript
import { DndProvider, useDrag, useDrop } from 'react-dnd';
```

**Option 3: Mouse events (more complex but more control)**
```javascript
onMouseDown + onMouseMove + onMouseUp
```

## Evaluation Criteria

- ✅ Drag and drop works smoothly
- ✅ Cards stay in new position after drop
- ✅ State persists after refresh
- ✅ Adding/editing/deleting works
- ✅ Visual feedback during drag
- ✅ Performance good (no lag with many cards)
- ✅ Clean code architecture
- ✅ Mobile responsive

## Key Concepts

- Complex state management
- Immutable state updates
- Drag and drop API
- Component composition
- LocalStorage persistence
- Event handling

## Test Cases

1. Drag card from Todo to In Progress → should move
2. Drop card → should stay in new position
3. Refresh page → cards should be in same positions
4. Add new card to Todo → should appear immediately
5. Edit card title → should update inline
6. Delete card → should show confirmation, then remove
7. Drag card and drop outside columns → should return to original position
8. Add 50 cards → should still perform well
9. Test on mobile → columns should stack, drag should work

## Architecture Tips

```javascript
// State structure for efficient updates
const [columns, setColumns] = useState(initialData);

// Move card between columns
const moveCard = (cardId, fromColumn, toColumn, newIndex) => {
  // 1. Remove from source column
  // 2. Add to destination column
  // 3. Update state immutably
  // 4. Save to localStorage
};

// Component hierarchy
<Board>
  <Column>
    <Card />
    <Card />
  </Column>
  <Column>
    <Card />
  </Column>
</Board>
```

## Common Pitfalls

- Mutating state directly
- Not handling edge cases (drop outside, invalid positions)
- Performance issues with many cards (use React.memo)
- Not preventing default drag behavior
- Forgetting to persist to localStorage
- Poor mobile experience
