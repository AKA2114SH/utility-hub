'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Check } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        setTodos(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load todos:', error)
      }
    }
  }, [])

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    setTodos([newTodo, ...todos])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={addTodo}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === 'all' ? stats.total :
              f === 'active' ? stats.active :
              stats.completed
            })
          </button>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Tasks</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-500">{stats.active}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {filter === 'completed' && todos.length > 0
              ? 'No completed tasks yet'
              : filter === 'active' && todos.length > 0
              ? 'All tasks completed! Great job'
              : 'No tasks yet. Add one to get started!'}
          </p>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-border hover:border-primary'
                }`}
              >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              <span
                className={`flex-1 ${
                  todo.completed
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && stats.completed > 0 && (
        <button
          onClick={clearCompleted}
          className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Clear Completed Tasks
        </button>
      )}
    </div>
  )
}
