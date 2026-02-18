# Admin Evaluation Run Tests Flow

This document describes the current "Run Tests" flow across UI, backend, and
agent manager.

## High-Level Flow

1. Admin opens the Evaluation page.
2. Frontend fetches dataset list and then fetches results.
3. Admin clicks `Run Tests`.
4. Frontend sends `POST /api/admin/evaluation/run?dataset={dataset}`.
5. Backend forwards to agent manager `POST /evaluation/run?dataset={dataset}`.
6. Agent manager runs or joins an evaluation task, caches JSON results.
7. Frontend renders summary/cards/table from returned results.
8. If evaluation is still running, frontend polls every 3 seconds.

## Step 0: Page Initialization (Frontend)

File: `ui/src/views/admin/Evaluation.tsx`

On mount:
- `fetchDatasets()` calls `GET /api/admin/evaluation/datasets`
- After datasets are loaded, `fetchResults()` calls
  `GET /api/admin/evaluation/results?dataset={...}`

Running state:
- `runningTest`: local button request state
- `isRunning`: server-side evaluation in progress

Polling:
- While `isRunning === true`, frontend calls `fetchResults()` every 3 seconds.

Current implementation note:
- `fetchResults` is defined with `useCallback(..., [API_BASE])`, so its internal
  `selectedDataset` reference is captured from when the callback was created.
  Dataset changes do not recreate `fetchResults`.

## Step 1: Run Tests Click (Frontend)

File: `ui/src/views/admin/Evaluation.tsx`

`runNewEvaluation()`:
- Sets `runningTest=true`, `isRunning=true`, clears `error`.
- Reads JWT from `localStorage`.
- Sends `POST ${API_BASE}/api/admin/evaluation/run?dataset=${selectedDataset}`
  with `Authorization: Bearer <token>`.
- If response JSON is `{ status: "running", ... }`, keeps polling.
- Otherwise stores full results with `setResults(data)` and shows success banner.
- On failure sets error text and clears `isRunning`.
- Always sets `runningTest=false`.

## Step 2: Backend Admin Route

File: `backend/src/admin/admin.controller.ts`

Route wiring:
- Controller: `@Controller('admin')`
- Global prefix: `api` (`backend/src/main.ts`)
- Method: `@Post('evaluation/run')`
- Effective endpoint: `POST /api/admin/evaluation/run`

Security:
- `@UseGuards(JwtAuthGuard, AdminGuard)` on controller class.

Behavior:
- Reads `dataset` query param (default `main_agent_scenarios`).
- Calls `adminService.runTrajectoryEvaluation(dataset)`.

## Step 3: Backend Proxy to Agent Manager

File: `backend/src/admin/admin.service.ts`

`runTrajectoryEvaluation(datasetName)`:
- Agent base URL: `process.env.AGENT_MGR_URL || 'http://agent-server:8000'`
- Axios call:
  - `POST {AGENT_MGR_URL}/evaluation/run`
  - `params: { dataset: datasetName }`
- Returns `response.data` as-is.

Related proxy methods:
- `getEvaluationResults(datasetName)` -> `GET /evaluation/results`
- `getAvailableDatasets()` -> `GET /evaluation/datasets`

Error handling:
- Axios failures are wrapped and rethrown as `Error(...)`.

## Step 4: Agent Manager Run Endpoint

File: `agent_mgr/main.py`

Route:
- `POST /evaluation/run?dataset={dataset}`

Behavior:
1. Validates dataset name (`[a-zA-Z0-9_-]+`) and blocks traversal patterns.
2. Calls `start_or_join_evaluation(dataset)`.
3. `start_or_join_evaluation` uses single-flight state:
   - If same dataset is already running: join existing task.
   - If different dataset is running: return HTTP `409`.
   - If idle: start new async task.
4. Execution task (`execute_and_cache_evaluation`) runs:
   - `TrajectoryTestRunner().run_test_suite(dataset, True)` in thread pool.
   - Converts dataclass results to frontend JSON shape.
   - Writes cache file:
     `agent_mgr/test_results/{dataset}_results.json`.
5. Returns final JSON result.

## Step 5: Agent Manager Results Endpoint

File: `agent_mgr/main.py`

Route:
- `GET /evaluation/results?dataset={dataset}`

Behavior:
1. Validate dataset name.
2. Return cached file if present.
3. If same dataset evaluation is currently running, return HTTP `202` with:
   - `{ "status": "running", "dataset": "...", "message": "..." }`
4. If no cache and no active same-dataset run, trigger evaluation and return
   final JSON (backward-compatible behavior).

## Step 6: Test Runner Internals

File: `agent_mgr/tests/trajectory/trajectory_test_runner.py`

`run_test_suite(dataset_file, collect_trajectory=True)`:
- Loads `agent_mgr/tests/trajectory/{dataset}.yaml`
- Runs all test cases via `run_single_test(...)`
- Builds suite summary and category breakdown

`run_single_test(...)`:
- Applies isolated env vars:
  - `TRAJECTORY_CONTEXT_MODE`
  - `TRAJECTORY_FIXTURE_ID`
  - `TRAJECTORY_MANDATORY_TOOLS`
  - `TRAJECTORY_FORBIDDEN_TOOLS`
- Runs `TrajectoryMainAgent(collect_trajectory=True)`
- Evaluates trajectory and computes pass/fail
- Restores env vars after each test

Pass/fail rule:
- Tool checks are primary gate when present.
- Match checks are required additionally only when `require_match=true`.

## Step 7: Frontend Rendering

File: `ui/src/views/admin/Evaluation.tsx`

UI renders:
- Summary cards: total, passed, failed, pass rate
- Category breakdown progress cards
- Expandable test table:
  - test metadata
  - pass/fail badges
  - execution time
  - evaluation details
  - agent response text

Running UX:
- Shows running alert when `isRunning=true`.
- Disables Run/Refresh controls while running.

## Dataset Discovery

File: `agent_mgr/main.py`

`GET /evaluation/datasets`:
- Scans `agent_mgr/tests/trajectory/*_scenarios.yaml`
- Returns file stems (example: `main_agent_scenarios`)
- Falls back to `["main_agent_scenarios"]` on error or empty directory

## Current Main Dataset

File: `agent_mgr/tests/trajectory/main_agent_scenarios.yaml`

Current test IDs:
- `wedding_info_query`
- `wedding_venue_location`
- `wedding_directions`
- `simple_greeting`

## Environment

Backend-to-agent-manager URL:

```env
AGENT_MGR_URL=http://agent-server:8000
```

Referenced in:
- `backend/src/admin/admin.service.ts`

Frontend API base:
- `VITE_API_URL` if set
- fallback: `http://localhost:3001`

## Troubleshooting

`Run Tests` returns error:
- Verify backend can reach `AGENT_MGR_URL`.
- Check backend logs for Axios upstream failures.
- If another dataset run is active, agent manager can return `409`.

Page stays in running state:
- `GET /evaluation/results` can return `202` while task is active.
- Wait for polling cycle or click refresh after run completes.

Dataset missing in dropdown:
- File must be in `agent_mgr/tests/trajectory/`.
- Filename must match `*_scenarios.yaml`.

No cached results:
- Cache path: `agent_mgr/test_results/{dataset}_results.json`.
- Missing cache triggers a new run from `/evaluation/results` when idle.
