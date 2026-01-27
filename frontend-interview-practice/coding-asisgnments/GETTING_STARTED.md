# Getting Started

Quick guide to begin your frontend interview practice.

## Your Practice Setup

```
frontend-interview-practice/
├── README.md                    # Overview of all challenges
├── GETTING_STARTED.md          # This file
├── PRACTICE_TRACKER.md         # Track your progress
├── QUICK_REFERENCE.md          # Common code patterns
├── INTERVIEW_TIPS.md           # Interview strategy guide
│
├── 01-todo-list/               # Start here!
├── 02-counter-with-history/
├── 03-tabs-component/
├── 04-accordion/
├── 05-modal-dialog/
├── 06-autocomplete/
├── 07-infinite-scroll/
├── 08-image-carousel/
├── 09-form-validation/
├── 10-drag-and-drop/
├── 11-data-table/
├── 12-kanban-board/
├── 13-markdown-editor/
├── 14-chat-interface/
└── 15-dashboard/
```

## Quick Start

### Week 1: React Fundamentals

Start with challenges 1-5 to build strong React fundamentals.

**Day 1-2:** Todo List (01)
```bash
cd 01-todo-list
npm install
npm run dev
# Start coding!
```

**Day 3-4:** Counter with History (02)
- Tests your understanding of React state management
- Undo/redo pattern is very common

**Day 5-6:** Tabs & Accordion (03, 04)
- Common UI patterns
- Practice event handling and component composition

**Day 7:** Modal Dialog (05)
- Accessibility focus
- Focus management and keyboard traps

### Week 2: API Integration & Advanced State

Challenges 6-10 introduce API calls and complex state.

**Setup for each challenge:**
```bash
cd [challenge-name]
npm install
npm run dev
```

**Focus Areas:**
- Async operations and loading states
- Debouncing and performance
- Keyboard navigation
- Error handling

### Week 3: Advanced Applications

Challenges 11-15 are complex, multi-component applications.

**These test:**
- Architecture decisions
- Complex state management
- Performance with large datasets
- Component composition

## Practice Schedule

### Option A: Intensive (3 weeks)
- **Week 1:** 1-2 challenges per day (Mon-Fri)
- **Week 2:** 1 challenge per day
- **Week 3:** 1 challenge every other day
- **Weekends:** Review and redo challenging ones

### Option B: Steady (6 weeks)
- **3 challenges per week**
- More time to internalize patterns
- Better for working professionals

### Option C: Rapid (1 week)
- **2-3 challenges per day**
- For imminent interviews
- Focus on breadth over depth

## Your First Challenge: Todo List

### Time Budget: 30 minutes

1. **Read requirements** (2 min)
   - Open `01-todo-list/README.md`
   - Note must-have features

2. **Plan approach** (3 min)
   - Sketch the component structure
   - Think about state management
   - Plan localStorage strategy

3. **Build core features** (20 min)
   - Add todos (useState for state)
   - Toggle complete
   - Delete todos
   - Basic rendering

4. **Polish** (5 min)
   - LocalStorage persistence (useEffect)
   - Prevent empty todos
   - Basic styling

### After Completion

1. **Test thoroughly**
   - Add multiple todos
   - Refresh page
   - Test edge cases

2. **Self-review**
   - Is code readable?
   - Any obvious bugs?
   - What could be better?

3. **Track progress**
   - Update PRACTICE_TRACKER.md
   - Note what you learned
   - Note what was difficult

4. **Review solution patterns**
   - Check QUICK_REFERENCE.md
   - Compare your approach
   - Learn alternative methods

## Using the Reference Guides

### Before Each Challenge
- Review relevant patterns in QUICK_REFERENCE.md
- Example: Before autocomplete, review debouncing

### During the Challenge
- Keep QUICK_REFERENCE.md open
- Copy patterns but understand them
- Don't just memorize, understand why

### After Each Challenge
- Read INTERVIEW_TIPS.md
- Think about how you'd explain your code
- Practice talking through your approach

## Progress Tracking

Use PRACTICE_TRACKER.md to:
- Mark completed challenges
- Track time taken vs target
- Note difficulties
- Identify patterns to practice more

Example:
```markdown
- [x] 01-todo-list | Target: 30min | Actual: 42min | Date: 2024-01-15
  - Notes: Struggled with localStorage, need to practice more
```

## When You Get Stuck

1. **Read the error message** - Most errors tell you what's wrong
2. **Console.log everything** - Debug step by step
3. **Check QUICK_REFERENCE.md** - See if there's a pattern
4. **Google specific errors** - You can do this in real interviews too
5. **Take a break** - Come back with fresh eyes
6. **Look at the solution** - But only after trying for 15+ min

## Setting Up Your Environment

### All Challenges (React + Vite)
One-time setup per challenge:
```bash
cd [challenge-name]
npm install
npm run dev
# Open http://localhost:5173
```

Edit files in your favorite editor. Changes will hot-reload automatically!

### Online Editors (Alternative)
If you prefer not to install locally:
- CodeSandbox.io
- StackBlitz.com
- CodePen.io (with React preset)

## Simulating Interview Conditions

### Practice Run
1. Set a timer for the target time
2. Close all reference materials
3. Don't look at solutions
4. Think out loud (record yourself)
5. Stop when timer ends
6. Review what you completed

### Real Interview Simulation
1. Use unfamiliar challenge (one you haven't seen)
2. Have a friend "interview" you
3. Share screen and explain as you code
4. Get feedback on communication
5. Practice responding to hints/questions

## Common First-Timer Mistakes

### 1. Overthinking
- Start simple, add complexity later
- You don't need perfect architecture for a 30-min challenge

### 2. Styling Too Early
- Get it working first
- Add styles in last 5 minutes

### 3. Not Testing
- Test as you build
- Don't wait until the end

### 4. Silent Coding
- Practice explaining your thinking
- Interviewers can't read your mind

### 5. Giving Up Too Soon
- Stuck for 2 minutes? That's normal
- Stuck for 10 minutes? Ask for help

## Next Steps

1. **Start now**: Go to `01-todo-list/`
2. **Read the README**: Understand requirements fully
3. **Set a timer**: 30 minutes
4. **Start coding**: Make it work first
5. **Track progress**: Update PRACTICE_TRACKER.md
6. **Repeat**: Do one challenge today

## Resources

Inside this repo:
- `QUICK_REFERENCE.md` - Code snippets and patterns
- `INTERVIEW_TIPS.md` - Strategy and communication
- `PRACTICE_TRACKER.md` - Progress tracking

External:
- MDN Web Docs - Reference for web APIs
- React Docs - Official React documentation
- Can I Use - Browser compatibility
- Frontend Mentor - More practice projects

## Questions?

As you practice, keep notes:
- What patterns keep coming up?
- What do you struggle with?
- What do you need to research more?

Focus your learning on your weak areas.

## Ready?

**Start with challenge 01 right now!**

```bash
cd 01-todo-list
open README.md
# Read requirements
npm install
npm run dev
# Start coding in src/App.jsx!
```

Set timer for 30 minutes and begin. Good luck!
