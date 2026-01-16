# Day Schedule Template — LLM Instructions

## Purpose
This template guides LLMs to generate detailed day-by-day schedules following the 50-Day Frontend Prep format. Each generated day should be actionable, time-bound, and include specific tasks with checkboxes.

---

## Template Structure

```markdown
# Day [NUMBER]: [DAY_OF_WEEK], [DATE] — [DESCRIPTIVE_TITLE]

**Theme:** [EMOJI] [1-3 word theme]
**Goal:** [One clear, measurable outcome for the day]

---

## [TIME_BLOCK_EMOJI] [TIME_BLOCK_NAME]: [SPECIFIC_FOCUS]

**Time:** [START] – [END]
_Focus: [What mental mode/objective for this block]_

- **[START] – [END]: [Activity Name]**

  - [ ] [Specific, actionable task]
  - [ ] [Another specific task]
  - _[Optional: Examples, context, or tips]_

- **[START] – [END]: [Next Activity]**
  - [ ] [Task with clear completion criteria]
```

---

## Required Elements

### 1. Header Section
- **Day number**: Sequential (1-50)
- **Date**: Full format (e.g., "Monday, Jan 13")
- **Title**: Descriptive and motivating (e.g., "React Hooks Deep Dive")
- **Theme**: Single emoji + 2-5 words capturing the day's essence
- **Goal**: One sentence, specific and measurable

### 2. Time Blocks
Use these emoji indicators:
- 🌅 Morning Block (9:00 AM start)
- 💼 Work Block (if applicable, Jan 9-21 only)
- 🌤️ Afternoon Block
- 🌆 Evening Block
- 🌙 Night Block (for extended schedules)

### 3. Time Block Components
Each block must include:
- **Time range** in 12-hour format
- **Focus statement** in italics describing the mental mode
- **Activities** broken into 30min-2hr segments
- **Tasks** with `- [ ]` checkboxes for tracking
- **Breaks** marked with 🚶 emoji (typically 30 min)
- **Meals** marked with 🍽️ emoji (lunch: 1hr, dinner: 1hr)

### 4. Task Formatting Rules
- Start with action verbs (Build, Review, Complete, Practice, etc.)
- Be specific (not "Study React" but "Complete React Router tutorial - nested routes section")
- Include quantities when relevant ("Solve 3 LeetCode problems: Two Sum, Valid Parentheses, Reverse String")
- Add context in italics when helpful
- Use **bold** for key actions or deadlines

### 5. Definition of Done
- Must have 2-4 concrete completion criteria
- Each should be verifiable (you can check it off)
- Align with the day's main goal

---

## Schedule Type Rules

### Schedule A: Full Study Days (Jan 22 onwards, weekdays only)
- Start: 9:00 AM
- End: 2:00 AM next day
- Total: ~12 hours focused work
- Include: Morning (2.25hr) + Deep Work (2hr) + Afternoon (4hr) + Evening (4hr) blocks
- Must include: 3-4 breaks (30min each), lunch (1hr), dinner (1hr)

### Schedule B: Part-Time Work Days (Jan 9-21, weekdays only)
- Start: 9:00 AM
- End: 2:00 AM next day
- Total: ~10 hours focused work (4 hours for part-time work)
- Work hours: 10:00-12:00 and 1:00-3:00
- Include: Morning (1hr) + Afternoon (2hr) + Evening (4hr) + Night (2.5hr) study blocks

### Weekends: REST DAYS
- Content: "**Complete rest and recovery. No study scheduled.**"
- Do not create detailed schedules for Saturdays or Sundays

---

## Content Guidelines by Phase

### Phase 1: Foundation & React (Week 1-2, Days 1-10)
- Focus: React fundamentals, setup, basic hooks
- LeetCode: 3 easy problems per day starting Day 2
- Include: React course segments (specified in source schedule)
- Portfolio prep: Resume, LinkedIn, job research

### Phase 2: Intermediate React & Algorithms (Week 3-4, Days 11-20)
- Focus: Advanced hooks, state management, routing
- LeetCode: 3-4 problems per day (mix easy/medium)
- Include: Component patterns, testing basics

### Phase 3: Focused Algorithm Patterns (Week 5, Days 21-29)
- Each day focuses on ONE pattern with 15+ problems
- Day 21: Two Pointers
- Day 22: Sliding Window
- Day 23: Binary Search
- Day 24: Trees/DFS/BFS
- Day 25: Dynamic Programming
- Day 26: Backtracking
- Day 27: Graphs
- Day 28: Heaps
- Day 29: Mixed review (19 problems)

### Phase 4: Portfolio Projects (Week 6-7, Days 30-39)
- Focus: Building 3 complete projects
- LeetCode: 3 problems per day (maintenance)
- Include: Planning, coding, testing, deployment steps

### Phase 5: Job Applications (Week 8+, Days 40-50)
- Focus: Applications, networking, interview prep
- LeetCode: 4-5 problems per day
- Include: Application targets (10-15 per day), company research, mock interviews

---

## Example Output Format

```markdown
# Day 5: Thursday, Jan 16 — React Hooks Mastery

**Theme:** ⚛️ Hooks Deep Dive
**Goal:** Master useState, useEffect, and useRef with practical examples

---

## 🌅 Morning Block: Pre-Work Learning

**Time:** 9:00 AM – 10:00 AM
_Focus: Absorb new concepts before work begins_

- **9:00 – 10:00: React Course - Hooks Section**
  - [ ] Watch "Understanding useEffect" (30 min)
  - [ ] Build cleanup function example
  - [ ] Take notes on dependency array rules
  - _Resource: React docs on useEffect_

---

## 💼 Work Block

**Time:** 10:00 AM – 3:00 PM
_Focus: Part-time work obligation_

- **10:00 – 12:00:** 💼 Part-time Work
- **12:00 – 1:00:** 🍽️ **Lunch** (Step away from screens)
- **1:00 – 3:00:** 💼 Part-time Work

---

## 🌤️ Afternoon Block: Practice & Build

**Time:** 3:00 PM – 8:00 PM
_Focus: Hands-on coding with hooks_

- **3:00 – 3:30:** 🚶 Break/Transition

- **3:30 – 5:30: Hooks Practice Project**
  - [ ] Build a custom useLocalStorage hook
  - [ ] Create a form with controlled inputs using useState
  - [ ] Add form validation with useEffect

- **5:30 – 6:00:** 🚶 Break

- **6:00 – 8:00: React Course Continuation**
  - [ ] Complete useRef section
  - [ ] Build a focus management example
  - [ ] Compare useRef vs useState for DOM access

---

## 🌆 Evening Block: Algorithms & Review

**Time:** 8:00 PM – 2:00 AM
_Focus: LeetCode practice and consolidation_

- **8:00 – 9:00:** 🍽️ Dinner

- **9:00 – 11:00: LeetCode Session**
  - [ ] Solve: Find All Numbers Disappeared in Array
  - [ ] Solve: Single Number
  - [ ] Solve: Intersection of Two Arrays
  - _Pattern: Hash Sets and Array Manipulation_

- **11:00 – 11:30:** 🚶 Break

- **11:30 – 1:30: Day Review & Reinforcement**
  - [ ] Create a cheat sheet: useState vs useEffect vs useRef
  - [ ] Review today's React code - add comments
  - [ ] Push code to GitHub with clear commit messages

- **1:30 – 2:00: Planning & Wind Down**
  - [ ] Review tomorrow's schedule
  - [ ] Set up workspace for tomorrow
  - [ ] Brief reflection: What clicked today?

---

### ✅ Definition of Done (Day 5)

By 2:00 AM tonight, you should have:

1. [ ] Completed React Course hooks section with working examples
2. [ ] Built a custom hook (useLocalStorage) 
3. [ ] Solved 3 LeetCode problems with documented solutions
4. [ ] Created a hooks reference cheat sheet
```

---

## Key Principles for LLM Generation

1. **Be specific**: "Complete React Router tutorial sections 1-3" not "Learn routing"
2. **Include resources**: MDN, React docs, specific LeetCode problems by name
3. **Balance intensity**: Don't schedule deep learning back-to-back; alternate with practice
4. **Realistic timing**: 2 hours for deep learning, 30 min for breaks, 1 hour for meals
5. **Progressive difficulty**: Early days have more guidance, later days more autonomy
6. **Consistency**: Same time blocks, same emoji system throughout
7. **Completable**: Each day should feel achievable but challenging
8. **Connected**: Reference previous days' learnings when building on concepts

---

## Validation Checklist

Before finalizing a generated day, verify:
- [ ] All time blocks add up correctly (no gaps or overlaps)
- [ ] Breaks are included every 2-2.5 hours of work
- [ ] Tasks have checkboxes and action verbs
- [ ] LeetCode problems are named specifically (if applicable)
- [ ] Definition of Done aligns with the day's goal
- [ ] Time format is consistent (12-hour with AM/PM)
- [ ] Emojis are used appropriately
- [ ] Schedule type matches the date (work days vs full days vs weekends)
