import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: "Learn React",
      status: 'in progress'
    },
    {
      id: '2',
      title: "Build a Todo App",
      status: 'completed'
    },
    {
      id: '3',
      title: "Deploy the App",
      status: 'verified'
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState('');

  const updateTodoStatus = (id: string, newStatus : string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status: newStatus } : todo
    ));
  };

  const addNewTodo = () => {
    const newTodoItem = {
        id: Date.now().toString(),
        title: newTodo,
        status: 'in progress'
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1>My Beautiful Todo List</h1>
        <p>Organize your tasks in style ✨</p>
      </div>
      
      <div className="add-todo-section">
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..." 
          className="todo-input"
          onKeyDown={(e) => e.key === 'Enter' ? addNewTodo() : null}
        />
        <button onClick={addNewTodo} className="add-btn">
          <span className="plus-icon">+</span> Add
        </button>
      </div>
      
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active all' : ''}`} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'in progress' ? 'active pending' : ''}`} 
          onClick={() => setFilter('in progress')}
        >
          In Progress
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active completed' : ''}`} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`filter-btn ${filter === 'verified' ? 'active verified' : ''}`} 
          onClick={() => setFilter('verified')}
        >
          Verified
        </button>
      </div>
      
      <div className="todos-container">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.status}`}>
              <div className="todo-content">
                <span className="todo-title">{todo.title}</span>
                <div className="todo-status">
                  Status: <span className={`status-text ${todo.status === 'in progress' ? 'in-progress' :  todo.status === 'completed' ? 'completed' : 'verified'} `}>{todo.status}</span>
                </div>
              </div>
              
              <div className="todo-actions">
                <button 
                  className={`status-btn pending ${todo.status === 'in progress' ? 'active' : ''}`} 
                  onClick={() => updateTodoStatus(todo.id, 'in progress')}
                  title="Mark as In Progress"
                >
                  ⏳
                </button>
                <button 
                  className={`status-btn completed ${todo.status === 'completed' ? 'active' : ''}`} 
                  onClick={() => updateTodoStatus(todo.id, 'completed')}
                  title="Mark as Completed"
                >
                  ✓
                </button>
                <button 
                  className={`status-btn verified ${todo.status === 'verified' ? 'active' : ''}`} 
                  onClick={() => updateTodoStatus(todo.id, 'verified')}
                  title="Mark as Verified"
                >
                  🌟
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTodo(todo.id)}
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;