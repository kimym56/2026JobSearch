# Challenge 15: Analytics Dashboard

**Time Limit:** 90 minutes
**Difficulty:** Advanced
**Tech:** React + Vite

## Requirements

Build a multi-widget analytics dashboard.

### Must Have
1. **At least 4 different widgets:**
   - Stats cards (total users, revenue, etc.)
   - Line/bar chart
   - Recent activity list
   - User table with sorting
2. Responsive grid layout
3. Fetch data from mock API
4. Loading states for each widget
5. Error handling
6. Refresh data button
7. Date range filter (last 7/30/90 days)
8. Clean, professional design

### Bonus (if time permits)
- Draggable/resizable widgets
- Export data (CSV/JSON)
- Real-time updates (polling)
- Dark mode toggle
- Custom date range picker
- More chart types
- Search/filter functionality
- Widget customization (show/hide)
- Pagination for tables

## Mock Data Structure

```javascript
const dashboardData = {
  stats: {
    totalUsers: 1234,
    revenue: 45678,
    activeUsers: 456,
    conversion: 12.5
  },
  chartData: [
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 150 },
    // ...
  ],
  recentActivity: [
    { id: 1, user: 'John', action: 'Signed up', time: '2 min ago' },
    { id: 2, user: 'Jane', action: 'Made purchase', time: '5 min ago' },
    // ...
  ],
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active', joined: '2024-01-01' },
    // ...
  ]
}
```

## Mock API

```javascript
const fetchDashboardData = async (dateRange = '30d') => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    stats: { /* ... */ },
    chartData: generateChartData(dateRange),
    recentActivity: generateActivity(),
    users: generateUsers()
  }
}
```

Or use real API:
```
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/posts
```

## Evaluation Criteria

- ✅ All widgets display correctly
- ✅ Data loads and renders
- ✅ Loading states shown
- ✅ Filters work
- ✅ Responsive layout
- ✅ Professional appearance
- ✅ Clean code architecture

## Chart Options

**Option 1: Use a library (recommended)**
```bash
npm install recharts
# or
npm install chart.js react-chartjs-2
```

**Option 2: Simple DIV-based chart**
```javascript
<div className="bar-chart">
  {data.map(item => (
    <div
      key={item.date}
      className="bar"
      style={{ height: `${item.value}%` }}
    />
  ))}
</div>
```

## Component Architecture

```
App
├── Header (title, filters, refresh)
├── StatsGrid
│   ├── StatCard (users)
│   ├── StatCard (revenue)
│   ├── StatCard (active)
│   └── StatCard (conversion)
├── ChartsRow
│   ├── LineChart
│   └── BarChart
├── ActivityWidget
│   └── ActivityList
└── UsersWidget
    └── UsersTable
```

## Responsive Grid

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.widget {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
}
```

## State Management

```javascript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [dateRange, setDateRange] = useState('30d')

useEffect(() => {
  loadData()
}, [dateRange])

const loadData = async () => {
  setLoading(true)
  setError(null)
  try {
    const result = await fetchDashboardData(dateRange)
    setData(result)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

## Test Cases

1. Load page → all widgets show loading states
2. Data loads → widgets populate with data
3. Change date filter → data updates
4. Click refresh → reloads data
5. Simulate error → shows error message
6. Sort user table → sorts correctly
7. Resize window → layout adapts
8. Stat cards show correct formatting (numbers, percentages)
9. Chart displays data accurately
10. Recent activity shows relative times

## Design Tips

- Use card-based layout
- Consistent spacing and shadows
- Color code stats (green for positive, red for negative)
- Use icons for visual interest
- Clean typography
- Professional color scheme
- Loading skeletons better than spinners
