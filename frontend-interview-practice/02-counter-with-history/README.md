# Challenge 2: Counter with History

**Time Limit:** 30 minutes
**Difficulty:** Basic
**Tech:** React + Vite

## Requirements

Build a counter application with undo/redo functionality.

### Must Have
1. Display current count (starts at 0)
2. Increment button (+1)
3. Decrement button (-1)
4. Reset button (back to 0)
5. Undo button (revert last action)
6. Redo button (reapply undone action)
7. Display history of all operations
8. Disable undo when no history
9. Disable redo when nothing to redo

### Bonus (if time permits)
- Custom increment/decrement value
- Keyboard shortcuts (arrow keys, ctrl+z, ctrl+y)
- Clear history button
- Show timestamps for each action

## Evaluation Criteria

- ✅ Counter works correctly
- ✅ Undo/redo stack implemented properly
- ✅ Buttons disabled at appropriate times
- ✅ History displays correctly
- ✅ Edge cases handled (multiple undos, etc.)

## Key Concepts

- Command pattern
- Stack data structure
- State management

## Test Cases

1. Increment 3 times → count should be 3
2. Undo once → count should be 2
3. Undo twice more → count should be 0
4. Redo once → count should be 1
5. Increment → redo should be disabled
6. Reset → count should be 0, history should show reset
