import { useState, useEffect, useRef } from 'react'
import './App.css'

// Mock API function
const fetchItems = async (page, pageSize = 20) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const start = (page - 1) * pageSize
  const items = Array.from({ length: pageSize }, (_, i) => ({
    id: start + i + 1,
    title: `Item ${start + i + 1}`,
    description: `This is the description for item ${start + i + 1}`
  }))

  return {
    data: items,
    hasMore: page < 10, // Total 200 items (10 pages)
    total: 200
  }
}

function App() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef(null)

  // TODO: Implement intersection observer
  // Watch observerTarget element
  // When it comes into view and hasMore is true, load more

  const loadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await fetchItems(page + 1)
      setItems(prev => [...prev, ...result.data])
      setPage(prev => prev + 1)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load initial items
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true)
      const result = await fetchItems(1)
      setItems(result.data)
      setHasMore(result.hasMore)
      setLoading(false)
    }
    loadInitial()
  }, [])

  return (
    <div className="app">
      <div className="container">
        <h1>Infinite Scroll</h1>
        <p className="subtitle">Scroll down to load more items</p>

        <div className="items-list">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Observer target - put this at the end of the list */}
        <div ref={observerTarget} className="observer-target" />

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading more items...</p>
          </div>
        )}

        {!hasMore && (
          <div className="end-message">
            <p>You've reached the end! Total: {items.length} items</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
