# 2026 Job Search - Frontend Engineer Prep

Complete preparation system for landing a frontend engineering role, featuring structured schedules, implementation challenges, and company-specific prep materials.

---

## 📁 Project Structure

```
2026JobSearch/
│
├── 📅 schedules/                    # All prep schedules
│   ├── 50_Day_Adjusted_Schedule_v2.md       ⭐ CURRENT SCHEDULE (USE THIS)
│   ├── 50_Day_Adjusted_Schedule.md          (Original version)
│   ├── 50_Day_Frontend_Prep_FINAL_SCHEDULE.md
│   ├── 50_Day_Weekend_Rest_Schedule.md
│   ├── SCHEDULE_ADJUSTMENT_PLAN.md
│   └── Schedule_Index.md
│
├── 📝 daily-logs/                   # Daily progress tracking
│   ├── Day 1.md
│   ├── Day 2.md
│   ├── Day_3.md
│   └── Day_Template.md              (Template for new days)
│
├── 🏢 company-prep/                 # Company-specific prep schedules
│   └── FriendliAI_Prep_Schedule.md  ⭐ 3-week targeted prep for FriendliAI
│
├── 📚 docs/                         # Documentation and guides
│   └── SCHEDULE_UPDATE_SUMMARY.md   (How schedules were updated)
│
├── 💻 frontend-interview-practice/  ⭐ 15 IMPLEMENTATION CHALLENGES
│   ├── README.md                    (Overview of all challenges)
│   ├── GETTING_STARTED.md           (How to use the challenges)
│   ├── QUICK_REFERENCE.md           (Code patterns & snippets)
│   ├── INTERVIEW_TIPS.md            (Interview strategies)
│   ├── PRACTICE_TRACKER.md          (Track your progress)
│   │
│   ├── 01-todo-list/               (30min - Basic)
│   ├── 02-counter-with-history/    (30min - Basic)
│   ├── 03-tabs-component/          (30min - Basic)
│   ├── 04-accordion/               (30min - Basic)
│   ├── 05-modal-dialog/            (45min - Basic)
│   │
│   ├── 06-autocomplete/            (45min - Intermediate)
│   ├── 07-infinite-scroll/         (45min - Intermediate)
│   ├── 08-image-carousel/          (50min - Intermediate)
│   ├── 09-form-validation/         (60min - Intermediate)
│   ├── 10-drag-and-drop/           (60min - Intermediate)
│   │
│   ├── 11-data-table/              (90min - Advanced)
│   ├── 12-kanban-board/            (90min - Advanced)
│   ├── 13-markdown-editor/         (75min - Advanced)
│   ├── 14-chat-interface/          (75min - Advanced)
│   └── 15-dashboard/               (90min - Advanced)
│
└── README.md                        ⭐ THIS FILE (Start here!)
```

---

## 🚀 Quick Start

### For General Prep (50-day schedule):

1. **Read the current schedule**:
   ```bash
   open schedules/50_Day_Adjusted_Schedule_v2.md
   ```

2. **Review the implementation challenges**:
   ```bash
   cd frontend-interview-practice
   open README.md
   open GETTING_STARTED.md
   ```

3. **Start Day 1**:
   - Follow the schedule in `50_Day_Adjusted_Schedule_v2.md`
   - Track progress in `daily-logs/` (use Day_Template.md)

4. **Start your first challenge (Day 3)**:
   ```bash
   cd frontend-interview-practice/01-todo-list
   open README.md              # Read requirements
   npm install                 # Install dependencies
   npm run dev                 # Start dev server
   # Open http://localhost:5173 and start coding!
   ```

---

### For Company-Specific Prep (FriendliAI):

1. **Read the targeted prep schedule**:
   ```bash
   open company-prep/FriendliAI_Prep_Schedule.md
   ```

2. **Focus on priority challenges**:
   - Challenge 15 (Dashboard) - MOST CRITICAL
   - Challenge 11 (Data Table)
   - Challenge 06 (Autocomplete)
   - Challenge 09 (Form Validation)
   - Challenge 05 (Modal Dialog)

3. **Build in TypeScript**:
   - All challenges support TypeScript
   - Emphasize accessibility (a11y)
   - Focus on performance optimization

---

## 📊 What's Inside

### 🎯 Implementation Challenges (15 Total)

**Basic Challenges (30-45 min)** - React Fundamentals
- Todo List, Counter with History, Tabs, Accordion, Modal Dialog

**Intermediate Challenges (45-60 min)** - API Integration & State
- Autocomplete, Infinite Scroll, Image Carousel, Form Validation, Drag-and-Drop

**Advanced Challenges (60-90 min)** - Complex Applications
- Data Table, Kanban Board, Markdown Editor, Chat Interface, Dashboard

**Each Challenge Includes**:
- ✅ Clear requirements and time limits
- ✅ React + Vite starter code
- ✅ Evaluation criteria
- ✅ Test cases
- ✅ README with detailed instructions

---

### 📅 Study Schedules

**50-Day General Prep** (`schedules/50_Day_Adjusted_Schedule_v2.md`)
- React mastery (Days 2-9)
- Dual track: React + Algorithms (Days 10-20)
- Algorithm intensive (Days 21-29)
- Portfolio projects (Days 30-41)
- Interview prep (Days 42-50)
- Weekends OFF for rest

**FriendliAI 3-Week Targeted Prep** (`company-prep/FriendliAI_Prep_Schedule.md`)
- TypeScript + Core challenges (Week 1)
- Advanced components + Real-time (Week 2)
- Performance + SEO + Interview prep (Week 3)
- Focus: Dashboard, Data Table, Forms, Real-time APIs
- AI/LLM context learning

---

## 🎯 Learning Path

### Phase 1: Foundation (Days 1-9)
- React fundamentals
- 5 Basic challenges
- HTML/CSS/JavaScript core concepts

### Phase 2: Dual Track (Days 10-20)
- 5 Intermediate challenges
- Algorithm practice begins
- TypeScript, APIs, real-time data

### Phase 3: Algorithm Focus (Days 21-29)
- Algorithm intensive
- Review past challenges
- Reach Silver 3 / Level 2-3

### Phase 4: Advanced Projects (Days 30-41)
- 5 Advanced challenges (split over multiple days)
- Complex applications
- Portfolio building

### Phase 5: Interview Prep (Days 42-50)
- Mock interviews using completed challenges
- Applications (3-5 per day)
- Behavioral prep
- Final polish

---

## 📝 Daily Workflow

### Each Day:

1. **Morning**: Follow schedule in `schedules/50_Day_Adjusted_Schedule_v2.md`

2. **Challenge Day**:
   ```bash
   cd frontend-interview-practice/[challenge-name]
   open README.md          # Read requirements (5 min)
   npm install && npm run dev
   # Set timer and BUILD!
   ```

3. **After Challenge**:
   - Test all features
   - Update `frontend-interview-practice/PRACTICE_TRACKER.md`
   - Note what was hard, what to improve

4. **End of Day**:
   - Copy `daily-logs/Day_Template.md` to `Day_[X].md`
   - Fill in what you learned, accomplished, questions
   - Plan tomorrow

---

## 🎓 Key Resources

### Inside This Repo:
- **Challenge Documentation**: `frontend-interview-practice/README.md`
- **Getting Started Guide**: `frontend-interview-practice/GETTING_STARTED.md`
- **Code Patterns**: `frontend-interview-practice/QUICK_REFERENCE.md`
- **Interview Strategy**: `frontend-interview-practice/INTERVIEW_TIPS.md`
- **Progress Tracker**: `frontend-interview-practice/PRACTICE_TRACKER.md`

### External Resources:
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **MDN Web Docs**: https://developer.mozilla.org
- **LeetCode**: https://leetcode.com (for algorithms)
- **Baekjoon**: https://www.acmicpc.net (Korean)
- **Programmers**: https://programmers.co.kr (Korean)

---

## 📊 Progress Tracking

### Daily Tracking:
Use `daily-logs/Day_Template.md` to create daily logs:
```bash
cp daily-logs/Day_Template.md "daily-logs/Day 4.md"
# Fill in your progress, learnings, questions
```

### Challenge Tracking:
Use `frontend-interview-practice/PRACTICE_TRACKER.md`:
```markdown
- [x] 01 - Todo List | Target: 30min | Actual: 42min | Date: Jan 13
  - Notes: Struggled with localStorage, took extra time

- [ ] 02 - Counter | Target: 30min | Actual: ___ | Date: ___
  - Notes: ___
```

### Weekly Reviews:
Every Sunday (rest day), review:
1. Which challenges took longest?
2. What patterns keep appearing?
3. What needs more practice?
4. What questions do I have?

---

## 🎯 Success Metrics

### After 50 Days:

**Portfolio**:
- ✅ 15 deployed React projects
- ✅ All challenges complete
- ✅ Professional READMEs
- ✅ Live demos

**Skills**:
- ✅ React expert
- ✅ Algorithm proficiency (Silver 3 / Level 2-3)
- ✅ TypeScript comfortable
- ✅ Interview confident

**Applications**:
- ✅ 50-75 companies applied
- ✅ Multiple interviews scheduled
- ✅ Behavioral prep complete
- ✅ Technical confidence high

---

## 🏢 Company-Specific Prep

When you apply to a specific company:

1. **Create new file**:
   ```bash
   touch company-prep/[CompanyName]_Prep_Schedule.md
   ```

2. **Analyze job description**:
   - Required tech stack
   - Specific responsibilities
   - Emphasized skills

3. **Map to challenges**:
   - Which of the 15 challenges match their needs?
   - What additional topics to study?
   - What projects to highlight?

4. **Create timeline**:
   - When is the interview?
   - How much prep time?
   - What's the priority order?

**Example**: See `company-prep/FriendliAI_Prep_Schedule.md`

---

## 💡 Tips for Success

### Do's:
- ✅ Follow the schedule consistently
- ✅ Take weekends OFF (recovery is essential)
- ✅ Track progress daily
- ✅ Test your code thoroughly
- ✅ Ask for help when stuck
- ✅ Review past challenges regularly
- ✅ Update tracker after each challenge

### Don'ts:
- ❌ Skip weekends (burnout is real)
- ❌ Batch challenges (do them properly)
- ❌ Skip time limits (simulate pressure)
- ❌ Ignore accessibility
- ❌ Rush through without testing
- ❌ Compare to others (your own pace)
- ❌ Study without building (hands-on!)

---

## 🆘 When You Get Stuck

### On a Challenge:
1. Read `frontend-interview-practice/QUICK_REFERENCE.md` for patterns
2. Check `frontend-interview-practice/INTERVIEW_TIPS.md` for strategies
3. Google the specific error/concept
4. Take a 15-minute break
5. Try explaining the problem out loud
6. If still stuck after 30 min, look for hints (not full solutions)

### On Algorithms:
1. Draw it out on paper
2. Start with brute force, then optimize
3. Check time/space complexity
4. Look for patterns (two pointers, sliding window, etc.)
5. Review similar problems

### On Schedule:
1. Adjust as needed (life happens)
2. Don't skip weekends
3. If behind, focus on quality over quantity
4. Prioritize challenges over algorithms for frontend roles

---

## 📞 Next Steps

### Today (Day 0 - Setup):
1. ✅ Read this README fully
2. ✅ Open `schedules/50_Day_Adjusted_Schedule_v2.md`
3. ✅ Explore `frontend-interview-practice/` directory
4. ✅ Read all challenge READMEs to understand scope
5. ✅ Set up progress tracker

### Tomorrow (Day 1):
1. Follow Day 1 in the schedule
2. Self-assessment & setup
3. Explore challenges
4. Set up tracking system
5. Prepare resume/LinkedIn

### Day 3 (First Challenge):
1. `cd frontend-interview-practice/01-todo-list`
2. Read README carefully
3. Set timer for 30 minutes
4. BUILD!
5. Test, polish, deploy
6. Update tracker

---

## 🎉 Milestones

- **Day 1**: Setup complete, ready to start
- **Day 3**: First challenge complete (Todo List)
- **Day 8**: 5 Basic challenges done
- **Day 10**: Dual track starts (React + Algorithms)
- **Day 15**: 10 challenges complete
- **Day 29**: Algorithm foundation solid
- **Day 41**: ALL 15 CHALLENGES COMPLETE! 🎊
- **Day 50**: Interview ready, applications sent

---

## 📄 File Conventions

### Daily Logs:
```
daily-logs/Day [X].md
```

### Challenge Work:
```
frontend-interview-practice/[challenge-name]/
```

### Company Prep:
```
company-prep/[CompanyName]_Prep_Schedule.md
```

### Documents:
```
docs/[DocumentName].md
```

---

## 🔄 Keeping Updated

This repo structure allows you to:
- Track progress easily
- Find files quickly
- Add new company preps
- Organize daily logs
- Keep schedules separate from implementation

**Everything is organized, everything is tracked, everything is ready.**

---

## 🚀 Let's Go!

You have:
- ✅ 50-day structured plan
- ✅ 15 implementation challenges with starter code
- ✅ Company-specific prep (FriendliAI)
- ✅ Progress tracking system
- ✅ Interview strategies
- ✅ Code reference patterns
- ✅ Organized file structure

**Start Date**: Friday, January 9, 2026
**First Challenge**: Tuesday, January 13, 2026
**All Challenges Complete**: Tuesday, March 4, 2026
**Interview Ready**: Saturday, March 7, 2026

**You've got this! Let's build something amazing! 🚀**

---

## 📧 Quick Links

- **Current Schedule**: `schedules/50_Day_Adjusted_Schedule_v2.md`
- **Challenge Overview**: `frontend-interview-practice/README.md`
- **Getting Started**: `frontend-interview-practice/GETTING_STARTED.md`
- **FriendliAI Prep**: `company-prep/FriendliAI_Prep_Schedule.md`
- **Progress Tracker**: `frontend-interview-practice/PRACTICE_TRACKER.md`
- **Quick Reference**: `frontend-interview-practice/QUICK_REFERENCE.md`
- **Interview Tips**: `frontend-interview-practice/INTERVIEW_TIPS.md`

---

**Last Updated**: January 13, 2026
**Version**: 2.0 (Organized Structure)
