'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check, Plus, X, Loader2, AlertTriangle } from 'lucide-react';
import GlassCard from './glass-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Todo = () => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/banking/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new task
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/banking/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: newTodo.trim(),
          category: 'FINANCIAL' 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      const newTask = await response.json();
      setTodos([newTask, ...todos]);
      setNewTodo('');
      toast.success('Task added successfully');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle a task's completed status
  const toggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;
      
      // Optimistically update UI
      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      
      const response = await fetch(`/api/banking/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });
      
      if (!response.ok) {
        // Revert the change if the API call fails
        setTodos(
          todos.map(todo => 
            todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
          )
        );
        throw new Error('Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  // Delete a task
  const deleteTodo = async (id: string) => {
    try {
      // Optimistically update UI
      setTodos(todos.filter(todo => todo.id !== id));
      
      const response = await fetch(`/api/banking/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // If the API call fails, fetch all tasks again to ensure consistency
        fetchTasks();
        throw new Error('Failed to delete task');
      }
      
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      addTodo();
    }
  };

  if (isLoading) {
    return (
      <GlassCard intensity="medium" className="w-full max-w-md mx-auto p-6 border">
        <div className="flex justify-center items-center py-8">
          <Loader2 className={`h-6 w-6 animate-spin mr-2 ${isDark ? 'text-white/60' : 'text-slate-600'}`} />
          <span className={isDark ? 'text-white/80' : 'text-slate-700'}>Loading tasks...</span>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard intensity="medium" className="w-full max-w-md mx-auto p-6 border">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertTriangle className={`h-8 w-8 mb-2 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
          <p className={`mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            {error}
          </p>
          <button
            onClick={fetchTasks}
            className={`px-4 py-2 rounded-md ${
              isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Retry
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      intensity="medium"
      className="w-full max-w-md mx-auto p-6 border"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Financial Tasks</h2>
          <div className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {todos.filter(t => t.completed).length}/{todos.length} done
          </div>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new financial task..."
            className={cn(
              "flex-1 px-3 py-2 rounded-md outline-none",
              isDark 
                ? "bg-slate-800/50 text-white placeholder:text-white/50 border border-white/10 focus:border-blue-500/50" 
                : "bg-white/80 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500"
            )}
            disabled={isSubmitting}
          />
          <button
            onClick={addTodo}
            disabled={isSubmitting || !newTodo.trim()}
            className={`px-3 py-2 rounded-md ${
              isSubmitting || !newTodo.trim()
                ? (isDark ? 'bg-blue-800/50 cursor-not-allowed' : 'bg-blue-400 cursor-not-allowed')
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          </button>
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
          {todos.map(todo => (
            <div 
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md transition-all",
                isDark 
                  ? `${todo.completed ? 'bg-slate-800/30' : 'bg-slate-800/50'} border border-white/5` 
                  : `${todo.completed ? 'bg-slate-100/80' : 'bg-white/80'} border border-slate-200`
              )}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center border",
                  todo.completed 
                    ? (isDark ? "bg-blue-500 border-blue-500" : "bg-blue-600 border-blue-600") 
                    : (isDark ? "border-white/30" : "border-slate-300")
                )}
              >
                {todo.completed && <Check size={12} className="text-white" />}
              </button>
              
              <span 
                className={cn(
                  "flex-1",
                  todo.completed 
                    ? (isDark ? "text-white/50 line-through" : "text-slate-500 line-through") 
                    : (isDark ? "text-white" : "text-slate-800")
                )}
              >
                {todo.text}
              </span>
              
              <button
                onClick={() => deleteTodo(todo.id)}
                className={`rounded-full p-1 hover:bg-red-500/10 ${isDark ? 'text-white/50 hover:text-red-400' : 'text-slate-400 hover:text-red-500'}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        {todos.length === 0 && (
          <div className={`text-center py-6 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            No tasks yet. Add a new one above!
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default Todo; 