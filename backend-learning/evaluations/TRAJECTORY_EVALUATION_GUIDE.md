# Trajectory Evaluation Guide

This document describes the current trajectory evaluation implementation in this
branch.

## Scope

This guide covers:
- Running trajectory evaluations from CLI
- Dataset YAML format used by the runner
- Evaluator behavior and pass/fail rules
- Output payloads and cache locations

Core files:
- `agent_mgr/tests/trajectory/run_evaluation.py`
- `agent_mgr/tests/trajectory/trajectory_test_runner.py`
- `agent_mgr/tests/trajectory/trajectory_evaluators.py`
- `agent_mgr/tests/trajectory/wedding_evaluators.py`
- `agent_mgr/tests/trajectory/test_main_agent.py`
- `agent_mgr/tests/trajectory/message_converter.py`

## Quick Start (CLI)

Run from `agent_mgr/`:

```bash
cd /Users/yongminkim/Development/Portfolio/mocheong/agent_mgr
python tests/trajectory/run_evaluation.py
```

Supported CLI arguments in `run_evaluation.py`:
- `--dataset` (default: `main_agent_scenarios`)
- `--format` (`json` or `text`, default: `json`)

Examples:

```bash
# Run a specific dataset
python tests/trajectory/run_evaluation.py --dataset wedding_classic_scenarios

# Human-readable output (does not write cache file)
python tests/trajectory/run_evaluation.py --format text
```

Notes:
- `--test`, `--output`, and `--verbose` are not implemented.
- CLI always runs with `collect_trajectory=True`.
- CLI cache is written only when `--format json`.

## Single Test Execution (Programmatic)

```python
from tests.trajectory.trajectory_test_runner import run_single_trajectory_test

result = run_single_trajectory_test("wedding_info_query", "main_agent_scenarios")
if result is None:
    print("Test case not found")
else:
    print(result.test_case.id, result.success, result.execution_time)
    for ev in result.evaluations:
        print(ev.key, ev.score, ev.comment)
```

## Dataset Format

Datasets are loaded from:
- `agent_mgr/tests/trajectory/{dataset}.yaml`

Top-level YAML key:
- `test_cases`

Example:

```yaml
test_cases:
  - id: "my_test"
    query: "User message"
    category: "basic_response_test"
    description: "What this test verifies"
    context_mode: "local_fixture"  # optional
    fixture_id: "wedding_classic"  # optional
    requirements:
      mandatory_tools: ["call_output_agent"]  # optional
      forbidden_tools: ["call_map_agent"]  # optional
      trajectory_mode: "strict"  # strict|unordered|subset|superset
      require_match: false  # optional, default false
    reference_trajectory:  # optional
      - type: "human"
        content: "User message"
      - type: "ai"
        tool_calls:
          - name: "call_output_agent"
            args: { "query": "User message" }
      - type: "tool"
        tool_call_id: "call_1"
        content: "Tool output"
      - type: "ai"
        content: "Final answer"
    context:
      session_id: "test_session_001"  # optional, default test_session
      wedding_id: "wedding_test_001"  # optional
      chat_history: []  # optional
```

## Reference Message Format

Supported records in `reference_trajectory`:

```yaml
- type: "human"
  content: "..."

- type: "ai"
  content: "..."  # optional
  tool_calls:  # optional
    - id: "call_1"  # optional (auto-filled if omitted)
      name: "tool_name"
      args: {}

- type: "tool"
  content: "..."
  tool_call_id: "call_1"
```

Conversion is handled by `YAMLToMessageConverter`.

## Runtime Flow

`TrajectoryTestRunner.run_test_suite(...)`:
1. Loads `{dataset}.yaml`.
2. Runs each case through `run_single_test(...)`.
3. Builds summary and category breakdown.

`TrajectoryTestRunner.run_single_test(...)`:
1. Ensures known trajectory env vars exist.
2. Applies per-test env overrides in an isolated context.
3. Creates `TrajectoryMainAgent(collect_trajectory=True)`.
4. Calls `process_message(...)`.
5. Collects trajectory and runs `_run_evaluations(...)`.
6. Computes pass/fail and returns `TestExecutionResult`.

## Evaluation Behavior

`_run_evaluations(...)` performs:
1. Convert `reference_trajectory` to LangChain messages (if present).
2. Normalize both actual and reference trajectories for comparison:
- Keep first human message.
- Keep AI tool-call messages only.
- Split multi-tool AI messages into one call per message.
- Optionally filter to `mandatory_tools`.
- Canonicalize tool args to `{}` and call IDs to `call_1..N`.
- Canonicalize tool outputs to `TOOL_RESULT`.
3. Match evaluation when reference exists, using `requirements.trajectory_mode`.
4. LLM-judge evaluation when available.
5. Wedding-specific checks:
- `mandatory_tools_check`
- `forbidden_tools_check`

## Pass/Fail Policy

Pass/fail is computed in `run_single_test(...)`:
- If tool checks exist:
  - Pass only when all tool checks pass.
  - If `require_match: true`, all match checks must also pass.
- Else if match checks exist:
  - Pass when all match checks pass.
- Else:
  - Pass by default.

`trajectory_match_skipped` has `score=None`, so it is informational and not part
of match gating.

## Dependency Notes (`agentevals`)

Current behavior:
- `TrajectoryLLMJudgeEvaluator` setup is wrapped in `try/except ImportError`.
  - If `agentevals` is missing, LLM judge is skipped.
- Match evaluator creation is not wrapped.
  - If `reference_trajectory` exists and `agentevals` is missing, match evaluator
    creation raises and the test case fails with exception.

Compatibility fallback:
- If trajectory matching hits
  `tool_call() got an unexpected keyword argument 'function'`, the runner adds
  a `trajectory_match_skipped` evaluation instead of crashing the suite.

## Environment Variables Used Per Test

Runner-managed variables:
- `TRAJECTORY_CONTEXT_MODE`
- `TRAJECTORY_FIXTURE_ID`
- `TRAJECTORY_MANDATORY_TOOLS`
- `TRAJECTORY_FORBIDDEN_TOOLS`

Agent-side flag:
- `COLLECT_TRAJECTORY=true|false` (used only when constructor arg is omitted)

The runner restores environment state after each test case.

## Output Shape

`run_evaluation.py` and `agent_mgr/main.py` return this JSON shape:

```json
{
  "summary": {
    "total_tests": 4,
    "passed_tests": 3,
    "failed_tests": 1,
    "pass_rate": 0.75,
    "avg_execution_time": 1.23
  },
  "category_breakdown": {
    "basic_response_test": {
      "count": 1,
      "passed": 1,
      "pass_rate": 1.0
    }
  },
  "test_results": [
    {
      "name": "simple_greeting",
      "category": "basic_response_test",
      "description": "...",
      "success": true,
      "execution_time": 0.42,
      "evaluations": [
        {
          "key": "mandatory_tools_check",
          "score": true,
          "comment": "All mandatory tools called",
          "details": {}
        }
      ],
      "agent_response": "{...}"
    }
  ]
}
```

## Cache Locations

There are two cache paths:
- API endpoint (`agent_mgr/main.py`):
  - `agent_mgr/test_results/{dataset}_results.json`
- CLI (`tests/trajectory/run_evaluation.py`):
  - `agent_mgr/tests/test_results/{dataset}_results.json`
  - Written only in JSON mode.

## Adding New Test Cases

1. Add a case under `test_cases` in:
- `agent_mgr/tests/trajectory/main_agent_scenarios.yaml`
- Or another `*_scenarios.yaml`.
2. Define `requirements`:
- `mandatory_tools`
- `forbidden_tools`
- `trajectory_mode`
- `require_match` (optional)
3. Add `reference_trajectory` when trajectory matching is needed.
4. Run:

```bash
python tests/trajectory/run_evaluation.py --dataset main_agent_scenarios --format json
```

## Collecting a Reference Trajectory

```python
from tests.trajectory.test_main_agent import TrajectoryMainAgent

agent = TrajectoryMainAgent(collect_trajectory=True)
result = agent.process_message(
    user_message="Test input",
    session_id="test_session",
    wedding_id="test_wedding",
)

for msg in result["trajectory"]:
    print(msg)
```

## Troubleshooting

### `ModuleNotFoundError: No module named 'yaml'`

```bash
pip install -r requirements.txt
```

### Dataset not found

`--dataset` must map to:
- `agent_mgr/tests/trajectory/{dataset}.yaml`

### `trajectory_match_skipped` appears

This indicates a LangChain/`agentevals` compatibility issue in trajectory match
execution. Tool checks still run.

### LLM judge missing

If `agentevals` is unavailable, only LLM judge setup is skipped automatically.
Reference-based match evaluation still requires `agentevals`.

## References

- `agent_mgr/tests/trajectory/trajectory_test_runner.py`
- `agent_mgr/tests/trajectory/run_evaluation.py`
- `agent_mgr/tests/trajectory/trajectory_evaluators.py`
- `agent_mgr/tests/trajectory/wedding_evaluators.py`
- `agent_mgr/tests/trajectory/message_converter.py`
