
const TodoInput = ({inputValue, onInputChange, onTodoSubmit}) => {
  return (
    <div>
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Add a todo"
          aria-label="Todo"
        />
        <button onClick={onTodoSubmit}>Save</button>
    </div>
  )
}

export default TodoInput
