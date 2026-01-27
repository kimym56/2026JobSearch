# Frontend Engineer (React / Next.js) Interview Questions — 2026 Edition

## 1. React Core Mental Model
1. What actually triggers a React component to re-render?
2. What is the difference between re-rendering and DOM updates?
3. How does React’s reconciliation algorithm work at a high level?
4. Why are keys important in lists? What happens if you use index as key?
5. What problems do stale closures cause?
6. When do you use functional state updates?
7. Why shouldn’t state be derived from props directly?
8. What is the difference between controlled and uncontrolled components?
9. What makes a component “pure”?
10. What problems can arise from deeply nested component trees?

## 2. Hooks Deep Understanding
1. When should you NOT use useMemo?
2. When does useCallback actually help?
3. How can misuse of hooks hurt performance?
4. What causes infinite render loops in useEffect?
5. How do dependency arrays really work?
6. How do you cancel async work inside useEffect?
7. What is the difference between useRef and state?
8. When would you use useLayoutEffect instead of useEffect?
9. How do custom hooks improve architecture?
10. How do you debug a hook that behaves inconsistently?

## 3. React 18+ & Concurrent Features
1. What problem does concurrent rendering solve?
2. What is startTransition used for?
3. What is Suspense for data fetching?
4. What is streaming rendering?
5. What is selective hydration?
6. What kind of UI benefits from transitions?
7. What happens if you overuse Suspense boundaries?
8. What is the difference between urgent and non-urgent updates?
9. How does React avoid blocking the main thread?
10. What UI problems are solved better with concurrency?

## 4. Next.js (2026 Reality)
1. What is the difference between Server Components and Client Components?
2. When must a component be a Client Component?
3. What is hydration, and why do mismatches happen?
4. What is the App Router vs Pages Router difference?
5. What are Server Actions?
6. When should you fetch data on the server vs the client?
7. What are common causes of hydration errors?
8. What is the edge runtime vs the node runtime?
9. How does Next.js handle image optimization?
10. What happens when you use `use client` unnecessarily?

## 5. Rendering Strategies
1. CSR vs SSR vs SSG vs ISR — what are the trade-offs?
2. When does SSR hurt performance?
3. What pages should never be statically generated?
4. How does caching work in Next.js data fetching?
5. What is revalidation?
6. What is stale-while-revalidate?
7. When is client-side fetching better?
8. What is streaming SSR?
9. How do you reduce time-to-first-byte?
10. What causes layout shift?

## 6. Performance Engineering
1. How do you find unnecessary re-renders?
2. What tools do you use to measure performance?
3. What affects bundle size most?
4. How do you reduce JavaScript sent to the browser?
5. What is code splitting?
6. What is tree shaking?
7. What causes memory leaks in frontend apps?
8. How do you optimize large lists?
9. What is virtualization?
10. What frontend issues cause slow interaction latency?

## 7. State Management
1. When does React Context become problematic?
2. What is the difference between server state and client state?
3. When would you choose React Query / TanStack Query?
4. When would global state be unnecessary?
5. How do you avoid prop drilling?
6. What is state normalization?
7. How do you structure state in a large feature?
8. How do you reset state on route change?
9. What causes state to become hard to maintain?
10. What patterns help with complex UI flows?

## 8. API, Async & Data Flow
1. How do you handle loading, error, and empty states?
2. How do you avoid race conditions in API calls?
3. How do you debounce a search request?
4. What is optimistic UI?
5. How do you cancel old requests?
6. How do you retry failed requests?
7. How do you handle slow APIs gracefully?
8. How do you prevent duplicate submissions?
9. What causes inconsistent data in the UI?
10. How do you design error boundaries?

## 9. Debugging & Engineering Maturity
1. Describe a difficult bug you fixed.
2. How do you debug a production-only issue?
3. What steps do you take when something “randomly breaks”?
4. How do you isolate a rendering bug?
5. How do you debug performance regressions?
6. What browser tools do you use most?
7. How do you avoid introducing new bugs?
8. How do you test edge cases?
9. What logs should never reach production?
10. How do you review your own PR?

## 10. Architecture, UX & Product Thinking
1. How do you structure components in a large feature?
2. What makes frontend code hard to maintain?
3. How do you design reusable components?
4. What UX states do juniors often forget?
5. How do you balance speed vs code quality?
6. How do you communicate technical constraints to PMs?
7. How do you handle accessibility basics?
8. What makes a UI feel “fast”?
9. How do you prevent over-engineering?
10. How do you keep learning frontend in the AI-assisted era?
