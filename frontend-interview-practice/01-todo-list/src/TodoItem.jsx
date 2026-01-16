const TodoItem = ({value, toggleTodo, deleteTodo}) => {
  return (
    <li>
        <div>{value.value}</div>
        <input
          type="checkbox"
          checked={value.completed}
          onChange={() => toggleTodo(value.id)}
          aria-label={`Mark ${value.value} as ${value.completed ? "incomplete" : "complete"}`}
        />
        <button onClick={() => deleteTodo(value.id)}>Delete</button>
    </li>
  )
}

export default TodoItem
