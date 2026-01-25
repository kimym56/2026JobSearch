# Day 5: Thursday, Jan 15 — Tabs Component + JS Arrays

**Theme:** 🧭 Effects & Data
**Goal:** Complete Challenge 03 timed build and deepen JavaScript array method fluency.
**End Time:** 1:00 AM

---

## 🌅 Morning Block: useEffect Deep Dive

**Time:** 9:00 AM – 10:00 AM
_Focus: Understand dependency arrays, cleanup, and common patterns._

- **9:00 – 9:10: Setup**

  - [ ] Grab coffee/water.
  - [ ] Open React docs on `useEffect`.

- **9:10 – 9:40: Core Patterns**
  - [ ] Write 3 small examples: data fetch, event listener, timer.
  - [ ] Add cleanup logic and explain when it runs.
  - [ ] Compare empty deps vs specific deps vs no deps.
  - [ ] Identify which values belong in deps for each example.
  - [ ] Note how to avoid infinite loops in effects.

- **9:40 – 10:00: Pitfalls**
  - [ ] List 3 common `useEffect` mistakes you’ve made.
  - [ ] Note when to use `useMemo`/`useCallback` to stabilize deps.
  - [ ] Write one example where `useEffect` is not needed.

---

## 💼 Work Block

**Time:** 10:00 AM – 3:00 PM
_Focus: Part-time work obligation._

- **10:00 – 12:00:** 💼 Part-time Work.
- **12:00 – 1:00:** 🍽️ **Lunch** (step away from screens).
- **1:00 – 3:00:** 💼 Part-time Work.

---

## 🌤️ Afternoon Block: ES6+ Fundamentals

**Time:** 3:00 PM – 5:30 PM
_Focus: Strengthen modern JS syntax for clean React code._

- **3:00 – 3:30:** 🚶 Break/Transition (walk, reset).

- **3:30 – 4:30: ES6+ Essentials**
  - [ ] Rewrite 5 older snippets using `let/const`, arrow functions, and template literals.
  - [ ] Practice destructuring (objects + arrays) in function params.
  - [ ] Use spread/rest in at least 3 examples.
  - [ ] Rewrite one example using default params and optional chaining.

- **4:30 – 5:30: Array Methods Primer**
  - [ ] Implement `map`, `filter`, `find`, `some`, `every` on the same dataset.
  - [ ] Write one `reduce` example and explain the accumulator step-by-step.
  - [ ] Note when to prefer `forEach` vs `map`.
  - [ ] Compare mutating vs non-mutating methods (e.g., `splice` vs `slice`).

---

## 🌆 Evening Block: Arrays Deep Dive

**Time:** 5:30 PM – 8:30 PM
_Focus: Build real intuition for array transformations._

- **5:30 – 6:00:** 🚶 Break.

- **6:00 – 7:30: Array Methods Deep Dive**
  - [ ] Solve 6 mini tasks using `map/filter/reduce` (e.g., totals, grouping, flattening).
  - [ ] Write 2 chained examples and refactor for readability.
  - [ ] Add 1 case where `reduce` replaces `map + filter`.
  - [ ] Write one example using `sort` safely (copy first, then sort).
  - [ ] Write one example using `flatMap`.

- **7:30 – 8:30:** 🍽️ Dinner.

---

## 🌙 Night Block: Challenge 03 — Tabs Component

**Time:** 8:30 PM – 1:00 AM
_Focus: Timed implementation + enhancements._

- **8:30 – 9:00: ⏱️ Timed Challenge (30 min)**
  - [ ] Read `frontend-interview-practice/03-tabs-component/README.md`.
  - [ ] Build basic tabs (state + content switching).
  - [ ] Add keyboard navigation basics (left/right).
  - [ ] Confirm focus ring is visible on tab buttons.

- **9:00 – 10:00: Enhance + Polish**
  - [ ] Add URL hash sync or deep-linking.
  - [ ] Improve focus styles and accessibility labels.
  - [ ] Add transitions for active tab content.
  - [ ] Support `Home`/`End` key navigation.

- **10:00 – 10:30:** 🚶 Break.

- **10:30 – 11:30: Separate Practice**
  - [ ] Build a small form with validation (required + min length).
  - [ ] Note validation patterns you can reuse.
  - [ ] Add inline error messaging and aria-live for errors.

- **11:30 – 1:00: Data Fetching Practice + Review**
  - [ ] Build a fetch component with loading/error states.
  - [ ] Summarize what worked and what broke.
  - [ ] Update tracker with time spent + notes.
  - [ ] Add retry button or manual refresh.

---

### ✅ Definition of Done (Day 5)

By 1:00 AM tonight, you should have:

1. [ ] Completed the 30-minute timed build for Challenge 03.
2. [ ] Added at least 2 enhancements (hash navigation, a11y, transitions).
3. [ ] Completed array methods deep dive with written examples.
4. [ ] Updated your tracker with learnings and next steps.

---

## 📘 Concepts to Learn (Day 5)

- `useEffect` lifecycle: setup, cleanup, and dependency behavior
- Dependency arrays: stable references and avoiding infinite loops
- Array method selection: `map` vs `forEach`, `filter` vs `find`, `reduce` patterns
- Immutability in JS arrays and objects
- Tabs accessibility: roving tabIndex, aria roles, and keyboard support
- Deep-linking with URL hash and state sync

**🚫 No LeetCode** — focus on component composition and state.
**📍 Location:** `frontend-interview-practice/03-tabs-component/`
