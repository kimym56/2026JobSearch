# Challenge 10: Drag and Drop List

**Time Limit:** 60 minutes
**Difficulty:** Intermediate
**Tech:** React + Vite

## Requirements

Build a list where items can be reordered via drag and drop.

### Must Have
1. Display list of items (5-10 items)
2. Make items draggable
3. Reorder by dragging to new position
4. Visual feedback during drag (ghost/placeholder)
5. Drop target highlighting
6. Update list order on drop
7. Smooth animations
8. Works with mouse

### Bonus (if time permits)
- Touch/mobile support
- Drag between multiple lists
- Add/remove items
- Persist order to localStorage
- Undo/redo reordering
- Keyboard accessibility (alt to drag/drop)
- Custom drag preview
- Restrict drag zones

## Sample Data

```javascript
const initialItems = [
  { id: 1, title: 'Task 1', priority: 'High' },
  { id: 2, title: 'Task 2', priority: 'Medium' },
  { id: 3, title: 'Task 3', priority: 'Low' },
  { id: 4, title: 'Task 4', priority: 'High' },
  { id: 5, title: 'Task 5', priority: 'Medium' }
]
```

## Evaluation Criteria

- ✅ Drag and drop works smoothly
- ✅ Visual feedback is clear
- ✅ List updates correctly
- ✅ No visual glitches
- ✅ State management correct
- ✅ Edge cases handled

## Implementation Approaches

**Option 1: HTML5 Drag and Drop API**
```javascript
<div
  draggable
  onDragStart={(e) => handleDragStart(e, item.id)}
  onDragOver={(e) => handleDragOver(e, item.id)}
  onDrop={(e) => handleDrop(e, item.id)}
>
  {item.title}
</div>
```

**Option 2: Mouse Events**
```javascript
<div
  onMouseDown={(e) => handleMouseDown(e, item.id)}
  // Track mousemove and mouseup on document
>
  {item.title}
</div>
```

**Option 3: Library (if allowed)**
- react-beautiful-dnd
- dnd-kit
- react-dnd

## Key Concepts

- Drag and Drop API
- State immutability (array reordering)
- Event handling
- CSS transitions
- User feedback

## Reordering Logic

```javascript
const reorderItems = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}
```

## Test Cases

1. Drag item 1 to position 3 → list reorders
2. Drag to same position → no change
3. Drag first item to last → works
4. Drag last item to first → works
5. Visual feedback shows during drag
6. Drop target highlights when hovering
7. Release outside list → returns to original position
8. Quick successive drags → handles correctly
