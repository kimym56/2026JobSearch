# Frontend Engineer (React / Next.js) Interview Answers — 2026 Edition

These are fuller, interview-ready answers. Add 1–2 concrete examples from your own projects when you practice.

## 1. React Core Mental Model
1. **What actually triggers a React component to re-render?**  
A component re-renders when its state changes, its parent renders with new props, a consumed context value changes, or an external store subscription reports an update. In React 18+, updates are batched by default, but they still trigger a new render pass for affected components. Re-rendering is about recomputing the UI, not necessarily updating the DOM.
2. **What is the difference between re-rendering and DOM updates?**  
Re-rendering means React runs your component function again to produce a new virtual tree. DOM updates happen later, during the commit phase, and only for the parts that actually changed after reconciliation. This is why many renders can be cheap if the output is stable.
3. **How does React’s reconciliation algorithm work at a high level?**  
React compares the previous and next virtual trees, matching elements by type and key. If the type or key changes, React treats it as a new subtree and may remount it. The goal is to reuse as much as possible to minimize DOM work and preserve state where identity is stable.
4. **Why are keys important in lists? What happens if you use index as key?**  
Keys give React a stable identity for each item across renders, which is how it decides what to reuse. Using the index as a key is risky when items can be inserted, removed, or reordered, because identity shifts and state can “move” to the wrong item. It can also cause unnecessary remounts and subtle UI bugs.
5. **What problems do stale closures cause?**  
Stale closures happen when a callback or effect captures old values of props or state and continues to use them later. This can produce “it worked yesterday” bugs, especially in timers, subscriptions, and async flows. The fixes are usually correct dependencies, functional updates, or reading the latest value from a ref.
6. **When do you use functional state updates?**  
Use functional updates when the next state depends on the previous state, like counters, queues, or toggles (`setX(prev => ...)`). They also help avoid stale closure issues because React passes the freshest state into the updater. This pattern pairs well with stable callbacks and concurrent rendering.
7. **Why shouldn’t state be derived from props directly?**  
It creates two sources of truth and is easy to get out of sync when props change. In most cases, it’s better to derive values during render or memoize them if they’re expensive. If you truly need a local copy, you should explicitly sync it and document the synchronization rule.
8. **What is the difference between controlled and uncontrolled components?**  
Controlled components store their value in React state and update it via events, which makes the UI predictable and easy to validate. Uncontrolled components keep the source of truth in the DOM and are read via refs, which can be simpler for quick forms or integrations. In large apps, controlled inputs are usually preferred for consistency and testability.
9. **What makes a component “pure”?**  
A pure component returns the same UI output for the same props, state, and context, and it avoids side effects during render. Purity makes behavior easier to reason about and enables optimizations like memoization. Side effects belong in event handlers, effects, or server actions—not in render.
10. **What problems can arise from deeply nested component trees?**  
You can end up with prop drilling, unclear state ownership, and many components re-rendering due to changes far away. It often signals mixed concerns and missing boundaries. Practical fixes include feature-based structure, selective context, server components for data, and extracting state closer to where it’s used.

## 2. Hooks Deep Understanding
1. **When should you NOT use useMemo?**  
Avoid `useMemo` for cheap calculations or as a reflexive “optimization.” It adds cognitive overhead and can even slow things down if the memoized value is quick to compute. Use it when you have a measurable bottleneck or when referential stability is required for correctness or performance.
2. **When does useCallback actually help?**  
`useCallback` helps when a stable function identity prevents unnecessary child renders, especially when the child uses `memo`. It also helps keep effect dependencies stable when the effect truly depends on the callback. Outside those cases, it usually adds noise without benefit.
3. **How can misuse of hooks hurt performance?**  
Common issues include over-memoization, effects that trigger extra renders, and dependency arrays that change every render due to unstable references. Another pitfall is putting expensive work inside components that re-render frequently. The best approach is to measure first, then make targeted changes.
4. **What causes infinite render loops in useEffect?**  
The classic loop is: an effect runs, sets state, and that state change causes a dependency to change, which re-runs the effect. Another cause is depending on objects or functions created inline without stabilizing them. Solutions include correcting dependencies, using functional updates, and moving unstable values out of dependencies when appropriate.
5. **How do dependency arrays really work?**  
React shallow-compares each dependency by reference after a render. If any dependency is different from the previous render, the effect or memoized value re-runs. This is why stable references and primitive dependencies often lead to more predictable behavior.
6. **How do you cancel async work inside useEffect?**  
Use `AbortController` for `fetch`, or maintain a `cancelled` flag in the cleanup function and ignore late responses. The key is to prevent setting state after unmount or after a newer request supersedes the old one. Libraries like TanStack Query handle this well for server state.
7. **What is the difference between useRef and state?**  
State is part of the render output and triggers re-renders when it changes. A ref stores a mutable value that persists across renders but does not cause a re-render when updated. Refs are ideal for DOM nodes, instance-like values, or reading the latest value in callbacks.
8. **When would you use useLayoutEffect instead of useEffect?**  
Use `useLayoutEffect` when you must read layout or synchronously mutate the DOM before the browser paints, such as measuring or positioning to avoid flicker. It runs earlier than `useEffect` and can block paint, so it should be used sparingly. Most side effects should remain in `useEffect`.
9. **How do custom hooks improve architecture?**  
Custom hooks encapsulate stateful logic and effects behind a focused API, reducing duplication and improving readability. They also make it easier to test behavior in isolation and keep components mostly about rendering. A good custom hook expresses intent clearly, like `useDebouncedValue` or `useUserProfile`.
10. **How do you debug a hook that behaves inconsistently?**  
Start by checking dependencies, stale closures, and cleanup behavior. React Strict Mode in development intentionally double-invokes some lifecycles, which can reveal hidden side effects. I usually isolate the hook in a small repro, add scoped logs, and verify identity assumptions around keys, refs, and dependencies.

## 3. React 18+ & Concurrent Features
1. **What problem does concurrent rendering solve?**  
Concurrent rendering makes React’s work interruptible and prioritizable so urgent interactions stay responsive even when the UI is expensive to compute. It doesn’t make everything parallel, but it gives React more control over scheduling. The result is fewer “frozen UI while rendering” moments.
2. **What is startTransition used for?**  
`startTransition` marks updates as non-urgent so React can prioritize urgent updates like typing and clicks. It’s especially useful for route transitions, large list filtering, and any state change that triggers heavy rendering. Conceptually, it tells React “this can wait a bit if needed.”
3. **What is Suspense for data fetching?**  
Suspense lets you declare loading boundaries and show fallbacks while parts of the tree wait on data. It shines with server rendering and streaming because it allows the server to send ready content sooner. Good Suspense boundaries are placed around meaningful UI chunks rather than everything.
4. **What is streaming rendering?**  
Streaming rendering sends HTML to the client in chunks as data becomes ready instead of waiting for the whole page. This reduces time-to-first-byte and improves perceived performance because users see content earlier. Suspense boundaries define the chunks that can stream independently.
5. **What is selective hydration?**  
Selective hydration allows React to hydrate the most important or interactive parts first rather than blocking on the entire page. This improves responsiveness on slower devices and large pages. It’s another scheduling win enabled by the concurrent model.
6. **What kind of UI benefits from transitions?**  
Transitions help when the user’s immediate input should stay snappy even if results are expensive, like search-as-you-type, filters, route changes, and tab switches. They’re about prioritizing responsiveness over immediate completion of non-urgent work. In interviews, I’d emphasize keeping input latency low.
7. **What happens if you overuse Suspense boundaries?**  
Too many boundaries can create fragmented loading experiences and visual pop-in that feels unstable. It can also add complexity to error and loading state management. I usually place boundaries around logical sections and ensure each fallback is intentional and user-friendly.
8. **What is the difference between urgent and non-urgent updates?**  
Urgent updates are tied to direct interactions and must complete quickly, such as typing, clicking, and focus changes. Non-urgent updates are results or derived views that can be deferred briefly without harming UX. Transitions are the tool to express that distinction.
9. **How does React avoid blocking the main thread?**  
React can split rendering work into smaller chunks and yield control back to the browser between chunks. That lets the browser process input, paint, and stay responsive. It’s a scheduling improvement rather than a change to how you write most components.
10. **What UI problems are solved better with concurrency?**  
Concurrency helps avoid input lag during heavy renders, smooths route and tab transitions, and allows better coordination of loading states. It is particularly helpful when large subtrees update frequently. The guiding goal is responsiveness under load.

## 4. Next.js (2026 Reality)
1. **What is the difference between Server Components and Client Components?**  
Server Components run on the server, can access databases and secrets directly, and do not ship their component code to the browser. Client Components run in the browser, can use state/effects/event handlers, and do ship their code. A common best practice is to keep as much as possible on the server and move only interactivity to the client.
2. **When must a component be a Client Component?**  
A component must be a Client Component if it uses client-only hooks like `useState`/`useEffect`, browser APIs like `window`, or event handlers like `onClick`. Any component that needs interactivity in the browser belongs on the client. Otherwise, prefer server components to reduce bundle size.
3. **What is hydration, and why do mismatches happen?**  
Hydration is the process of attaching React to server-rendered HTML so it becomes interactive. Mismatches occur when the server and client render different output, often due to time-based values, randomness, browser-only conditionals, or data differences. The fix is to make render output deterministic or defer client-only differences until after hydration.
4. **What is the App Router vs Pages Router difference?**  
The App Router is built around nested layouts, server components, and streaming/Suspense by default. The Pages Router is the earlier model centered on client components and data fetching methods like `getServerSideProps`. In modern Next.js, the App Router is usually the better default for performance and architecture.
5. **What are Server Actions?**  
Server Actions are server-side functions you can call directly from forms or components to perform mutations. They reduce the need for separate API routes for many use cases and keep mutation logic near the component that triggers it. You still need to validate inputs and handle errors carefully on the server.
6. **When should you fetch data on the server vs the client?**  
Fetch on the server for initial page data, security, better caching, and to avoid shipping fetch logic and large dependencies to the client. Fetch on the client when data is highly interactive, user-triggered, or needs frequent live updates after initial render. A good default is server-first, client when needed.
7. **What are common causes of hydration errors?**  
Non-deterministic render output is the biggest cause: `Date.now()`, `Math.random()`, locale/timezone differences, and reading browser-only values during render. Another cause is different conditional branches on the server vs client. In practice, keeping render deterministic and isolating client-only logic fixes most hydration issues.
8. **What is the edge runtime vs the node runtime?**  
The edge runtime runs closer to users for lower latency but has stricter API and library limitations. The Node runtime has broader compatibility and is easier when you need mature libraries or Node APIs. I choose edge for latency-sensitive, simple logic and Node for complex server work.
9. **How does Next.js handle image optimization?**  
The `next/image` component handles responsive sizing, lazy loading, and optimized formats. It helps prevent layout shift by requiring dimensions or a layout strategy. I treat it as the default unless there’s a specific reason not to.
10. **What happens when you use `use client` unnecessarily?**  
It forces that module and its transitive imports into the client bundle, which increases JavaScript shipped and can slow down hydration. It also prevents you from using server-only capabilities in that subtree. A good habit is to add `use client` at the smallest interactive leaf possible.

## 5. Rendering Strategies
1. **CSR vs SSR vs SSG vs ISR — what are the trade-offs?**  
CSR is simple but delays meaningful content until JavaScript loads and runs. SSR improves first paint and SEO but can increase server cost and TTFB if not cached well. SSG is fastest at runtime but static, while ISR blends static speed with controlled freshness through revalidation.
2. **When does SSR hurt performance?**  
SSR can hurt when server work is slow, sequential (waterfalls), or uncached, which increases TTFB. If the page still requires lots of client JavaScript, SSR might not improve the overall experience. I focus on caching, parallel fetches, and reducing client work to make SSR pay off.
3. **What pages should never be statically generated?**  
Pages that depend on the specific user, the current request, or sensitive data are poor fits for static generation. Examples include authenticated dashboards, per-request personalization, and anything requiring request headers or session data. Those usually need SSR or server components with request-time data.
4. **How does caching work in Next.js data fetching?**  
In the App Router, server `fetch` can be cached by default and configured with `cache`, `revalidate`, or tags for on-demand invalidation. This allows you to tune freshness vs speed deliberately. I treat caching as a first-class design choice, not an afterthought.
5. **What is revalidation?**  
Revalidation is the process of refreshing cached content after a time window or on-demand trigger. It lets you keep the speed benefits of cached or static content while controlling staleness. ISR is a specific pattern that uses revalidation for static pages.
6. **What is stale-while-revalidate?**  
It means you serve cached content immediately and refresh it in the background. The user gets a fast response, and the cache updates shortly after. It’s a great default when slight staleness is acceptable.
7. **When is client-side fetching better?**  
Client fetching is better for user-driven updates, live data, and situations where you want to refresh frequently without full navigations. It’s also useful for post-hydration interactions that don’t need to block initial render. Even then, I like starting with server-rendered initial data when possible.
8. **What is streaming SSR?**  
Streaming SSR sends HTML in chunks based on what’s ready, typically shaped by Suspense boundaries. It improves perceived performance because users see content sooner. It also reduces the pressure to block the entire page on the slowest data source.
9. **How do you reduce time-to-first-byte?**  
Reduce server waterfalls by starting independent requests early and awaiting them later, parallelize fetches, and cache aggressively. Move non-critical work off the request path and avoid heavy computation during render. In Next.js, server components plus thoughtful caching often give the biggest wins.
10. **What causes layout shift?**  
Layout shift happens when elements change size or position after initial render. Common causes are images without reserved space, late-loading fonts, and content that appears above existing content. Fixes include reserving space, using `next/image`, and reducing late DOM changes.

## 6. Performance Engineering
1. **How do you find unnecessary re-renders?**  
I start with the React DevTools Profiler to identify which components render often and why. I also enable highlight updates and, if needed, add temporary render counters. Then I apply targeted fixes like memoization, better state placement, or more stable dependencies.
2. **What tools do you use to measure performance?**  
For page-level signals, I use Lighthouse and Web Vitals (LCP, INP, CLS). For component-level analysis, I use React DevTools Profiler and the browser Performance panel. In production, I rely on telemetry so improvements are based on real user data.
3. **What affects bundle size most?**  
Large dependencies, broad imports (including barrel files), and accidentally shipping server-only logic to the client are major drivers. Overuse of client components also increases the amount of JavaScript sent. My default strategy is server-first rendering and narrow, intentional imports.
4. **How do you reduce JavaScript sent to the browser?**  
Keep components on the server when possible, split code by route and feature, and lazy-load heavy or rarely used UI. I also import directly from modules, avoid bundling server utilities into client code, and defer non-critical third-party scripts. These changes usually help both load time and interactivity.
5. **What is code splitting?**  
Code splitting divides your app into smaller chunks that load only when needed, often by route or dynamic import. It reduces the initial bundle and speeds up first load. The trade-off is additional requests, so I split based on user flows and weight.
6. **What is tree shaking?**  
Tree shaking removes unused exports during bundling so dead code doesn’t ship. It works best with ESM modules and clean import patterns. It’s not a silver bullet—large libraries can still be large even when shaken.
7. **What causes memory leaks in frontend apps?**  
Leaks often come from subscriptions, timers, and event listeners that aren’t cleaned up, or from async responses updating state after unmount. Another source is retaining large objects in long-lived caches or refs. I treat effect cleanup as mandatory and validate with profiling when needed.
8. **How do you optimize large lists?**  
I virtualize or window the list so only visible items render, ensure stable keys, and memoize row components when appropriate. I also keep expensive computations out of the render path and avoid passing unstable props. The biggest win is usually virtualization.
9. **What is virtualization?**  
Virtualization renders only the visible slice of a large list and reuses DOM nodes as you scroll. This reduces render time, DOM size, and memory usage. It’s one of the most reliable fixes for large-list performance.
10. **What frontend issues cause slow interaction latency?**  
Heavy synchronous work on the main thread, large re-render cascades, layout thrashing, and too much client JavaScript all hurt interaction latency. I look for long tasks in the Performance panel and slow commits in the React Profiler. The fixes are usually to reduce work, defer it, or move it to the server.

## 7. State Management
1. **When does React Context become problematic?**  
Context becomes problematic when large values or frequently changing values cause many consumers to re-render. It’s great for relatively static cross-cutting concerns like theming or auth metadata. For frequently changing shared state, I prefer stores with selectors or server-state tools.
2. **What is the difference between server state and client state?**  
Server state lives on external systems and needs fetching, caching, invalidation, and synchronization. Client state is local UI state like form inputs, modals, and filters that you can update synchronously. I model them differently because the failure modes are different.
3. **When would you choose React Query / TanStack Query?**  
I choose it when the problem is clearly server state: caching, deduping, background refresh, retries, and invalidation rules. It standardizes data flow and removes a lot of custom effect code. In Next.js, I often combine server-rendered initial data with client-side query updates.
4. **When would global state be unnecessary?**  
If state is only needed within a small subtree, lifting it to the nearest common parent is simpler and more maintainable. Global state adds coordination overhead and can make re-render patterns harder to reason about. I introduce it only when multiple distant consumers truly need the same live data.
5. **How do you avoid prop drilling?**  
I start by colocating state closer to where it’s used and composing components so data flows naturally. If multiple distant components need the same value, I introduce context carefully or use a store with selectors. I also try to pass renderable children rather than many data props when it keeps boundaries clean.
6. **What is state normalization?**  
Normalization means storing entities by ID and referencing them, similar to a database. It prevents duplication and makes updates predictable and efficient. It’s especially helpful when multiple parts of the UI reference the same entities.
7. **How do you structure state in a large feature?**  
I separate server state from UI state, keep state ownership near the feature, and model state around user flows and explicit statuses. I also define clear boundaries between data fetching and presentation. This reduces coupling and makes changes safer.
8. **How do you reset state on route change?**  
A simple pattern is to key the component by route parameters so it remounts when the route changes. Another option is to watch route changes and reset specific state in an effect. I choose the approach that makes the reset rule obvious.
9. **What causes state to become hard to maintain?**  
Multiple sources of truth, implicit coupling between components, and state shapes that don’t match the domain all create fragility. Effects that “keep things in sync” are often a smell. Clear ownership and explicit state transitions make maintenance much easier.
10. **What patterns help with complex UI flows?**  
Reducers and state machines help make transitions explicit and testable. I also use status enums like `idle | loading | success | error` to simplify branching. Separating data concerns from view state keeps complexity contained.

## 8. API, Async & Data Flow
1. **How do you handle loading, error, and empty states?**  
I model them explicitly and design the UI for each state from the start. This prevents “happy-path only” UIs and makes behavior predictable. It also helps me communicate scope and UX trade-offs early.
2. **How do you avoid race conditions in API calls?**  
I cancel outdated requests, track a request ID or sequence, and ignore stale responses. The key is to ensure only the latest relevant response can update the UI. Libraries like TanStack Query reduce this risk by design.
3. **How do you debounce a search request?**  
I debounce either the input value or the request trigger with a timer, and I clear the timer in cleanup. I also cancel in-flight requests when the query changes. In interviews, I mention both UX benefits and API load reduction.
4. **What is optimistic UI?**  
Optimistic UI updates the interface immediately as if the mutation succeeded, then reconciles with the server response. It improves perceived performance but requires a rollback plan on failure. I use it when the success rate is high and the action is reversible or well-scoped.
5. **How do you cancel old requests?**  
For `fetch`, I use `AbortController` and call `abort()` in cleanup or when a newer request supersedes the old one. In libraries, I use their cancellation primitives. Cancellation is both a correctness and performance tool.
6. **How do you retry failed requests?**  
I use bounded retries with exponential backoff and only retry safe/idempotent operations. I also surface useful errors and avoid infinite retry loops. Server-state libraries provide sensible defaults that I tune per endpoint.
7. **How do you handle slow APIs gracefully?**  
I keep input responsive, show skeletons or meaningful fallbacks, and stream or progressively reveal results where possible. I also consider timeouts and partial rendering so the whole page doesn’t wait on the slowest call. The goal is to reduce perceived waiting, not just raw time.
8. **How do you prevent duplicate submissions?**  
On the client, I disable or guard the submit action while a request is pending. On the server, I enforce idempotency or deduplicate requests where it matters. Relying only on the client is not enough for critical actions.
9. **What causes inconsistent data in the UI?**  
Out-of-order responses, missing invalidation, and multiple caches that aren’t coordinated are common causes. Local UI state can also drift from server truth after mutations. Clear invalidation rules and single sources of truth reduce these problems.
10. **How do you design error boundaries?**  
I place error boundaries around risky subtrees so a failure doesn’t take down the entire page. The fallback should be helpful, log the error, and offer a recovery path like retry or navigation. In Next.js, I also use route-level error boundaries where appropriate.

## 9. Debugging & Engineering Maturity
1. **Describe a difficult bug you fixed.**  
I use a concise STAR story: the symptom, how I formed hypotheses, the experiments I ran, the root cause, the fix, and the prevention step (tests, monitoring, or guardrails). Interviewers care about your process and risk management as much as the fix itself. I keep it structured and measurable.
2. **How do you debug a production-only issue?**  
I compare environments, add targeted logging or telemetry, and try to reproduce with production-like data and flags. I also check for timing, caching, and hydration differences that only appear in prod builds. If needed, I bisect recent changes and reduce the problem to a minimal repro.
3. **What steps do you take when something “randomly breaks”?**  
I first stabilize reproduction, then reduce scope until I find the smallest failing case. I inspect recent diffs, config changes, and environment differences, then test hypotheses one by one. Keeping a tight loop between measurement and change prevents thrashing.
4. **How do you isolate a rendering bug?**  
I create a minimal reproduction and freeze inputs to make the behavior deterministic. Then I check identity assumptions (keys), dependency arrays, and state ownership. React DevTools Profiler and component trees help pinpoint where the output diverges.
5. **How do you debug performance regressions?**  
I start by defining what got worse (LCP, INP, TTFB, or a specific interaction). Then I profile to find the hot path, apply the smallest fix that addresses the bottleneck, and re-measure. I treat performance work as an engineering loop, not guesswork.
6. **What browser tools do you use most?**  
Network for request timing and caching, Performance for long tasks and layout/paint costs, Elements for DOM/CSS issues, and React DevTools for render analysis. I also use Application storage tools to debug caching and session issues. The tool choice follows the symptom.
7. **How do you avoid introducing new bugs?**  
I keep PRs small, make invariants explicit in code, and write tests around the changed behavior. I also manually verify critical flows and edge states. Clear boundaries and types reduce the surface area for regressions.
8. **How do you test edge cases?**  
I think in states and transitions rather than only the happy path. That includes empty, loading, slow, partial, and error states, as well as out-of-order responses. I also test user behaviors like rapid input, double clicks, and navigation mid-request.
9. **What logs should never reach production?**  
Anything with PII, secrets, tokens, or sensitive internal details should never be logged. I also avoid noisy debug logs that drown out real signals. Production logging should be intentional, structured, and privacy-aware.
10. **How do you review your own PR?**  
I review it as if I’m a stranger: run the code, read for clarity, scan for risk, and verify tests match the intent. I look for accidental complexity, dead code, and leaky abstractions. I want the reviewer to be able to answer “what changed and why” quickly.

## 10. Architecture, UX & Product Thinking
1. **How do you structure components in a large feature?**  
I organize by feature, keep data fetching close to the boundary, and separate container/data concerns from presentation where it helps clarity. I also keep interactivity in small client components and push as much as possible to server components. Clear ownership makes scaling and refactoring safer.
2. **What makes frontend code hard to maintain?**  
Hidden coupling, unclear state ownership, mixed concerns, and inconsistent patterns are the biggest sources of pain. Overuse of effects to “sync things” is a frequent root cause. Maintainable code has explicit boundaries and predictable data flow.
3. **How do you design reusable components?**  
I design for composition first, keep the public API small, and avoid baking in too many assumptions. I extract reuse only after seeing a real second use case. Good reuse reduces duplication without creating a “god component.”
4. **What UX states do juniors often forget?**  
They often miss empty states, loading states, slow states, error states, disabled states, and keyboard/focus states. These are critical for perceived quality. I like to list states explicitly before building the UI.
5. **How do you balance speed vs code quality?**  
I timebox the solution, choose the simplest design that meets requirements, and leave clean seams for iteration. I’m explicit about trade-offs and follow up with refactors when the value is clear. Speed and quality aren’t opposites if you keep scope disciplined.
6. **How do you communicate technical constraints to PMs?**  
I translate constraints into user impact, offer options with trade-offs, and align on scope, risk, and timeline. I avoid jargon and focus on outcomes. This turns “no” into “here are the best options and their costs.”
7. **How do you handle accessibility basics?**  
I start with semantic HTML, proper labels, keyboard navigation, focus management, and sufficient contrast. Then I test with keyboard-only flows and run audits. Accessibility is easiest when it’s part of the default approach, not a late add-on.
8. **What makes a UI feel “fast”?**  
Fast feedback, stable layout, and responsive input matter more than absolute completion time. Skeletons, streaming, and optimistic updates can improve perceived speed. I optimize for the user’s sense of progress.
9. **How do you prevent over-engineering?**  
I anchor decisions to the user need, use the simplest solution that works, and only generalize after a second real use case. I also prefer boring, well-understood patterns unless there’s a clear payoff. This keeps complexity proportional to value.
10. **How do you keep learning frontend in the AI-assisted era?**  
I use AI to accelerate exploration, but I verify against docs and measurements. I focus on fundamentals like rendering, networking, performance, and debugging because those remain durable. Building and reflecting on real projects is still the fastest way to level up.
