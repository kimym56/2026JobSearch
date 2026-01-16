import { useEffect, useState } from 'react'
import AddTodoButton from './AddTodoButton'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'

  // TODO: Add your state management here
  // Hint: You'll need state for:
  // - List of todos
  // - Input value for new todo

  // TODO: Implement these functions:
  // - addTodo: Add a new todo to the list
  // - toggleTodo: Toggle completed status
  // - deleteTodo: Remove a todo
  // - clearCompleted: Remove all completed todos

  // TODO: Add localStorage persistence
  // - Load todos from localStorage on mount (useEffect)
  // - Save todos to localStorage on every change

const App = () => {
  const [todos, setTodos] = useState([]) 
  const [inputValue, setInputValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  
  useEffect(() => {
    // Load todos from localStorage on mount
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const toggleTodo = (id) => {
    setTodos((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
      localStorage.setItem('todos', JSON.stringify(next))
      return next
    })
}

  const handleAddTodoClick = () => {
    setIsAdding((value) => !value)
  }

  const handleDeleteTodo = (id) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id)
      localStorage.setItem('todos', JSON.stringify(next))
      return next
    })
  }

  const handleInputChange = (e) =>{
    setInputValue(e.target.value)
  }

  const handleTodoSave = () => {
    if (inputValue.trim() === "") return
    const newTodo = {
      id: Date.now(),
      value: inputValue,
      completed: false
    }
    const nextTodos = [...todos, newTodo]
    setTodos(nextTodos)
    localStorage.setItem('todos', JSON.stringify(nextTodos))
    setInputValue("")
    setIsAdding(false)
  }
  const completedCount = todos.filter((todo) => todo.completed).length

  const handleClearCompleted = () => {
    setTodos((prev) => {
      const next = prev.filter((todo) => !todo.completed)
      localStorage.setItem('todos', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="app">
      <div className="container" >
        <h1>Todo List</h1>
        <AddTodoButton onAddTodoClick={handleAddTodoClick}/>
        {isAdding && <TodoInput inputValue={inputValue} onInputChange={handleInputChange} onTodoSubmit={handleTodoSave} />}
        <ul>
          {todos.map((todo) => (
            <TodoItem  key={todo.id} value={todo} toggleTodo={toggleTodo} deleteTodo={handleDeleteTodo}/>
          ))}
        </ul>
        <div className="stats">
          <span>Total: {todos.length}</span>
          <span>Completed: {completedCount}</span>
        </div>
        <button onClick={handleClearCompleted} disabled={completedCount === 0}>
          Clear completed
        </button>

      </div>
    </div>
  )
}

export default App
