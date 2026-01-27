# Top 20 Strong Sample Answers — Frontend (React / Next.js)

These are "strong answer" versions you can practice almost verbatim, then adapt with your own examples.

1. **What triggers a React component to re-render?**  
A re-render happens when state updates, new props arrive from a parent render, a consumed context value changes, or an external store subscription fires. React 18 batches updates, but affected components still re-render. The key distinction is that re-rendering recomputes the virtual tree, while DOM changes only occur if the output actually differs.

2. **Re-rendering vs DOM updates — what’s the difference?**  
Re-rendering is the calculation phase: React runs component functions to produce the next virtual tree. DOM updates are the commit phase: React mutates the real DOM only where reconciliation found differences. This is why many renders are cheap if you keep output stable and identity consistent.

3. **Why are keys important, and why is index-as-key risky?**  
Keys are how React tracks identity across renders, especially in lists. If you use array index as the key, identity shifts when you insert, remove, or reorder items, and state can attach to the wrong row. I treat stable IDs as non-negotiable when list order can change.

4. **What problems do stale closures cause, and how do you fix them?**  
Stale closures happen when a callback or effect keeps old props/state and continues using them later, which creates subtle async and timer bugs. I fix them by correcting dependencies, using functional updates like `setX(prev => ...)`, or reading the latest value from a ref when appropriate. I also watch for this in event handlers that schedule work.

5. **When do you use functional state updates?**  
Whenever the next state depends on the previous state, I use functional updates because they’re safe under batching and concurrency. They also reduce dependency noise in callbacks and effects. It’s a small habit that prevents a lot of edge-case bugs.

6. **When should you NOT use useMemo?**  
I don’t use `useMemo` for cheap computations or as a default. It adds overhead and complexity, so I use it when I’ve measured a bottleneck or when referential stability is required for correctness or to prevent expensive child renders. Measure first, then optimize locally.

7. **When does useCallback actually help?**  
`useCallback` helps when function identity matters — usually when a memoized child would otherwise re-render, or when an effect truly depends on that callback. Outside those cases it’s often noise. I use it intentionally where it changes behavior or measurable performance.

8. **What causes infinite loops in useEffect?**  
The common loop is: an effect sets state, that state change alters a dependency, and the effect runs again. Another cause is unstable dependencies like inline objects and functions. The fix is to make dependencies accurate and stable, and to move non-essential work out of effects.

9. **useRef vs state — how do you explain it clearly?**  
State participates in rendering and triggers re-renders when it changes. A ref is a persistent, mutable box that does not trigger re-renders. I use refs for DOM nodes, instance-like values, or reading the latest value inside async callbacks without re-rendering.

10. **What problem does concurrent rendering solve?**  
It solves responsiveness under load. React can interrupt and prioritize rendering so urgent interactions like typing stay responsive even when the UI is expensive to compute. I describe it as a scheduling upgrade that reduces input lag.

11. **What is startTransition used for?**  
`startTransition` marks updates as non-urgent so React can prioritize urgent work. I use it for heavy updates like list filtering, route transitions, and large derived views. It’s a UX tool: protect input responsiveness first, let results catch up.

12. **What is Suspense for data fetching, in practical terms?**  
Suspense is a way to declare loading boundaries so parts of the UI can wait independently. It becomes especially powerful with server rendering and streaming, because you can send ready content earlier. I place boundaries around meaningful sections and design fallbacks intentionally.

13. **Server Components vs Client Components — what’s the best answer?**  
Server Components run on the server, can access databases and secrets, and don’t ship their component code to the browser. Client Components run in the browser and can use state, effects, and event handlers. My default is server-first and client-only where interactivity is required.

14. **When must a component be a Client Component?**  
It must be a Client Component if it uses `useState`, `useEffect`, browser APIs like `window`, or event handlers like `onClick`. Otherwise, I keep it on the server to reduce bundle size and improve performance. I also try to keep client boundaries as small as possible.

15. **What is hydration, and why do mismatches happen?**  
Hydration attaches React to server-rendered HTML to make it interactive. Mismatches happen when the server and client render different initial output, often due to time, randomness, locale differences, or browser-only conditionals. I fix them by making render deterministic and deferring client-only differences until after hydration.

16. **Server fetch vs client fetch — what’s your rule of thumb?**  
Server fetch is my default for initial data, security, caching leverage, and keeping JS off the client. I move to client fetch when the data is user-driven, rapidly changing, or needs live updates after initial render. A strong pattern is server-rendered initial data plus client-side refresh.

17. **CSR vs SSR vs SSG vs ISR — how do you answer quickly?**  
CSR is simple but can delay meaningful content. SSR improves initial render and SEO but can hurt TTFB if server work is slow or uncached. SSG is fastest at runtime but static, and ISR balances static speed with controlled freshness via revalidation.

18. **How do you reduce time-to-first-byte (TTFB)?**  
I focus on removing server waterfalls by starting independent requests early and awaiting late, parallelizing fetches, and caching aggressively. I also move non-critical work off the request path. In Next.js, server components plus deliberate caching usually give the biggest wins.

19. **How do you reduce JavaScript sent to the browser?**  
I keep as much rendering and data work on the server as possible, minimize `use client`, and split/lazy-load heavy features. I also import narrowly and defer non-critical third-party scripts. The goal is to shrink the critical path to interactivity.

20. **When does React Context become problematic, and what do you do instead?**  
Context becomes problematic when large or frequently changing values cause broad re-rendering. I keep context for relatively static cross-cutting concerns, and for frequently changing shared state I use selectors, dedicated stores, or server-state tools like TanStack Query. The key is to control the blast radius of updates.
