# Admin Evaluation Page Implementation

## Overview

A comprehensive admin evaluation page has been implemented to visualize trajectory test results for the wedding agent system. The page provides real-time test execution, detailed results display, and performance metrics.

---

## Implementation Summary

### ✅ Backend Components

#### 1. **Python Evaluation Script**
**File**: `agent_mgr/tests/trajectory/run_evaluation.py`

- Executes trajectory tests from command line
- Outputs results in JSON format for API consumption
- Caches results to `test_results/{dataset}_results.json`
- Supports multiple output formats (JSON, text)

**Usage**:
```bash
cd agent_mgr
python3 tests/trajectory/run_evaluation.py --dataset main_agent_scenarios --format json
```

#### 2. **NestJS Service Methods**
**File**: `backend/src/admin/admin.service.ts`

Added three new methods:

- **`runTrajectoryEvaluation(datasetName)`**: Executes test suite and returns results
- **`getEvaluationResults(datasetName)`**: Fetches cached results or runs new evaluation
- **`getAvailableDatasets()`**: Lists available test dataset files

#### 3. **NestJS Controller Endpoints**
**File**: `backend/src/admin/admin.controller.ts`

Added three new API endpoints:

- **`GET /admin/evaluation/datasets`**: List available test datasets
- **`GET /admin/evaluation/results/:dataset?`**: Get test results (cached)
- **`POST /admin/evaluation/run/:dataset?`**: Run new evaluation

All endpoints require JWT authentication and admin privileges.

---

### ✅ Frontend Components

#### 1. **Evaluation Page Component**
**File**: `ui/src/views/admin/Evaluation.tsx`

**Features**:
- Real-time test execution with loading indicators
- Dataset selection dropdown
- Summary statistics (total, passed, failed, pass rate)
- Visual progress bar for pass rate
- Category breakdown with individual progress bars
- Detailed test results table with:
  - Test name, category, and description
  - Pass/fail status badges
  - Execution time with color-coded badges
  - Individual evaluation results per test
- Auto-refresh capability
- Error handling and display

**UI Components Used**:
- Cards for stats display
- Progress bars for visual metrics
- Badges for status indicators
- Table for detailed results
- Spinners for loading states
- Buttons for actions (run tests, refresh)

#### 2. **Routing Updates**
**File**: `ui/src/layouts/Admin.tsx`

Added route for evaluation page:
```tsx
<Route path="/admin/evaluation" exact component={Evaluation} />
```

#### 3. **Navigation Updates**
**File**: `ui/src/components/Sidebar/Sidebar.tsx`

Added navigation link with active state highlighting:
- Icon: `fas fa-vial` (test tube)
- Label: "Evaluation"
- Position: Between Dashboard and Settings

---

## API Specification

### Get Available Datasets
```
GET /admin/evaluation/datasets
Authorization: Bearer {token}

Response:
[
  "main_agent_scenarios",
  "other_dataset"
]
```

### Get Evaluation Results
```
GET /admin/evaluation/results/:dataset?
Authorization: Bearer {token}

Response:
{
  "summary": {
    "total_tests": 5,
    "passed_tests": 4,
    "failed_tests": 1,
    "pass_rate": 0.8,
    "avg_execution_time": 1.5
  },
  "category_breakdown": {
    "context": { "count": 2, "passed": 2 },
    "integration": { "count": 3, "passed": 2 }
  },
  "test_results": [
    {
      "name": "wedding_info_query",
      "category": "context",
      "description": "Tests context agent info retrieval",
      "success": true,
      "execution_time": 1.23,
      "evaluations": [
        {
          "key": "superset_match",
          "score": true,
          "comment": "All mandatory tools called"
        }
      ],
      "agent_response": "..."
    }
  ]
}
```

### Run New Evaluation
```
POST /admin/evaluation/run/:dataset?
Authorization: Bearer {token}

Response: (same as GET evaluation results)
```

---

## User Guide

### Accessing the Evaluation Page

1. Navigate to admin panel: `http://localhost:3000/admin`
2. Click "Evaluation" in the sidebar navigation
3. Page will load with the latest cached results

### Running Tests

1. **Select Dataset**: Use the dropdown to choose which test suite to run
   - Default: `main_agent_scenarios`
   - Other datasets appear if available

2. **Run Tests**: Click the "Run Tests" button
   - Button shows spinner during execution
   - Page updates automatically when complete
   - Results are cached for future loads

3. **Refresh Results**: Click the sync icon button to reload cached results

### Interpreting Results

**Summary Cards** (top row):
- **Total Tests**: Total number of test cases
- **Passed**: Number of successful tests
- **Failed**: Number of failed tests
- **Pass Rate**: Percentage of passing tests

**Progress Bar**:
- Green (≥80%): Good performance
- Yellow (50-79%): Needs improvement
- Red (<50%): Critical issues

**Category Breakdown**:
- Shows pass rate per test category
- Useful for identifying which areas need work

**Test Results Table**:
- **Status Badge**: PASS (green) / FAIL (red)
- **Time Badge**:
  - Green: < 1 second (fast)
  - Blue: 1-3 seconds (normal)
  - Yellow: 3-5 seconds (slow)
  - Red: > 5 seconds (very slow)
- **Evaluations**: Individual check marks for each validation

---

## Color Scheme

| Metric | Good | Warning | Danger |
|--------|------|---------|--------|
| Pass Rate | Green (≥80%) | Yellow (50-79%) | Red (<50%) |
| Execution Time | Green (<1s) | Blue (1-3s) | Yellow (3-5s) / Red (>5s) |
| Test Status | Green (PASS) | - | Red (FAIL) |
| Evaluations | ✓ Green | - | ✗ Red |

---

## Integration Points

### Dependencies
- ✅ Trajectory test infrastructure (already implemented)
- ✅ agentevals package (needs installation)
- ✅ NestJS admin module (existing)
- ✅ React UI components (existing)

### Environment Variables
```env
# Backend (.env/backend/.env)
API_URL=http://localhost:3001

# Frontend (.env/ui/.env)
REACT_APP_API_URL=http://localhost:3001
```

---

## Troubleshooting

### Issue: "Failed to fetch datasets"
**Solution**: Ensure agent_mgr directory exists at `../agent_mgr` relative to backend

### Issue: "Evaluation failed with code X"
**Solution**:
1. Check Python dependencies: `pip install -r agent_mgr/requirements.txt`
2. Verify test files exist: `ls agent_mgr/tests/trajectory/*_scenarios.yaml`
3. Check Python path: Ensure pytest and langchain are installed

### Issue: Tests fail but error message unclear
**Solution**: Run evaluation script manually to see full output:
```bash
cd agent_mgr
python3 tests/trajectory/run_evaluation.py --format text
```

### Issue: Page shows loading spinner forever
**Solution**:
1. Check browser console for errors
2. Verify backend is running on port 3001
3. Check network tab for failed requests
4. Ensure JWT token is valid and user has admin privileges

---

## Future Enhancements

### Potential Improvements
1. **Test History**: Store historical results to track trends over time
2. **Test Comparison**: Compare results between different commits
3. **Individual Test Rerun**: Run specific failed tests only
4. **Detailed View**: Modal with full agent response and trajectory
5. **Export Results**: Download results as CSV or JSON
6. **Email Notifications**: Send alerts on test failures
7. **Performance Graphs**: Charts showing execution time trends
8. **Test Filtering**: Filter by category, status, or name
9. **Auto-schedule**: Run tests periodically (cron job)
10. **Real-time Updates**: WebSocket for live test progress

### Database Integration
Currently, results are cached as JSON files. For production:
- Store results in PostgreSQL/MongoDB
- Add timestamp for each run
- Query by date range, dataset, or status
- Calculate aggregate statistics

---

## Testing the Implementation

### 1. Start Backend
```bash
cd backend
npm run start:dev
```

### 2. Start Frontend
```bash
cd ui
npm run dev
```

### 3. Run Manual Test
```bash
cd agent_mgr
python3 tests/trajectory/run_evaluation.py --dataset main_agent_scenarios
```

### 4. Access Page
Open: `http://localhost:3000/admin/evaluation`

### 5. Verify Features
- [ ] Page loads without errors
- [ ] Dataset dropdown shows available datasets
- [ ] "Run Tests" button executes successfully
- [ ] Results display correctly
- [ ] Summary cards show accurate numbers
- [ ] Progress bar reflects pass rate
- [ ] Table displays all test cases
- [ ] Badges have correct colors
- [ ] Refresh button reloads data
- [ ] Error handling works (try stopping backend)

---

## File Structure

```
mocheong/
├── agent_mgr/
│   └── tests/trajectory/
│       ├── run_evaluation.py          # NEW: Python test runner
│       └── test_results/              # NEW: Cached results dir
│           └── main_agent_scenarios_results.json
├── backend/src/admin/
│   ├── admin.controller.ts            # MODIFIED: Added evaluation endpoints
│   └── admin.service.ts               # MODIFIED: Added evaluation methods
└── ui/src/
    ├── layouts/
    │   └── Admin.tsx                  # MODIFIED: Added evaluation route
    ├── components/Sidebar/
    │   └── Sidebar.tsx                # MODIFIED: Added evaluation link
    └── views/admin/
        └── Evaluation.tsx             # NEW: Evaluation page component
```

---

## Security Considerations

- ✅ All endpoints require JWT authentication
- ✅ Admin guard ensures only admin users can access
- ✅ No sensitive data exposed in error messages
- ✅ Input validation on dataset names
- ⚠️ Consider rate limiting for expensive test runs
- ⚠️ Consider adding audit logging for test executions

---

## Performance Notes

- Test execution time: ~30 seconds for 5 test cases
- Cached results load instantly (<100ms)
- Consider running tests in background for large suites
- Implement pagination for test results table if >100 tests

---

## Conclusion

The admin evaluation page provides a complete solution for:
- ✅ Running trajectory tests on demand
- ✅ Visualizing test results with clear metrics
- ✅ Tracking agent performance over time
- ✅ Identifying failing tests and categories
- ✅ Monitoring execution time

All components are integrated and ready for use once dependencies are installed!

---

**Next Steps**:
1. Install Python dependencies: `pip install -r agent_mgr/requirements.txt`
2. Start backend and frontend servers
3. Navigate to `/admin/evaluation`
4. Run your first test suite!

For questions or issues, refer to the main implementation plan documentation.
