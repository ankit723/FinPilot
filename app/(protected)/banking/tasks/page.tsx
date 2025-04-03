'use client';

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import Todo from "@/app/components/ui/Todo";
import GlassCard from "@/app/components/ui/glass-card";
import { CheckCircle, Clock, Target, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TaskCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
  slug: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: string;
  urgent?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskProgress {
  name: string;
  progress: number;
}

export default function TasksPage() {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [deadlines, setDeadlines] = useState<Task[]>([]);
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchTaskData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch tasks
      const response = await fetch('/api/banking/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const tasks = await response.json();
      
      // Calculate categories and counts
      const categoryMap = new Map<string, number>();
      tasks.forEach((task: Task) => {
        const category = task.category || "GENERAL";
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      // Generate categories with icons
      const categoriesData: TaskCategory[] = [
        { 
          name: 'Account Setup', 
          icon: <CheckCircle size={18} />, 
          count: categoryMap.get('ACCOUNT_SETUP') || 0,
          slug: 'ACCOUNT_SETUP' 
        },
        { 
          name: 'Financial Tasks', 
          icon: <Clock size={18} />, 
          count: categoryMap.get('FINANCIAL') || 0,
          slug: 'FINANCIAL' 
        },
        { 
          name: 'Financial Goals', 
          icon: <Target size={18} />, 
          count: categoryMap.get('GOAL') || 0,
          slug: 'GOAL' 
        },
      ];
      
      setCategories(categoriesData);
      
      // Set upcoming deadlines - in a real app, you'd have due dates
      // Here we're just picking some tasks to display as deadlines
      const sampleDeadlines = tasks
        .filter((task: Task) => !task.completed)
        .slice(0, 3)
        .map((task: Task, index: number) => ({
          ...task,
          dueDate: getRandomFutureDate(),
          urgent: index === 0 // Make the first one urgent as an example
        }));
      
      setDeadlines(sampleDeadlines);
      
      // Calculate progress by category
      const progressData: TaskProgress[] = [];
      for (const category of categoriesData) {
        if (category.count > 0) {
          const tasksInCategory = tasks.filter((t: Task) => (t.category || "GENERAL") === category.slug);
          const completedCount = tasksInCategory.filter((t: Task) => t.completed).length;
          const progressPercent = Math.round((completedCount / tasksInCategory.length) * 100);
          
          progressData.push({
            name: category.name,
            progress: progressPercent
          });
        }
      }
      
      setProgress(progressData);
      
    } catch (err) {
      console.error('Error fetching task data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading task data');
      toast.error('Failed to load task data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskData();
  }, [fetchTaskData]);

  // Helper to generate random future dates for demo purposes
  const getRandomFutureDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1); // Random 1-14 days ahead
    return futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // LoadingState component
  const LoadingState = () => (
    <div className="flex justify-center items-center py-32">
      <Loader2 className={`h-8 w-8 animate-spin mr-2 ${isDark ? 'text-white/60' : 'text-slate-600'}`} />
      <span className={isDark ? 'text-white/80' : 'text-slate-700'}>Loading task data...</span>
    </div>
  );

  // ErrorState component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <AlertTriangle className={`h-12 w-12 mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Unable to Load Tasks</h3>
      <p className={`mb-4 max-w-md ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
        {error || 'An error occurred while loading your tasks.'}
      </p>
      <button
        onClick={fetchTaskData}
        className={`px-4 py-2 rounded-md ${
          isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        Retry
      </button>
    </div>
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Task Management
        </h1>
        <p className={`mb-8 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
          Keep track of your financial tasks and goals
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Task Categories */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard 
              intensity="light" 
              className={`p-4 ${isDark ? 'border border-white/10' : 'border border-slate-200'}`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Task Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.slug ? null : category.slug
                    )}
                    className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                      selectedCategory === category.slug
                        ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-800')
                        : (isDark 
                            ? 'hover:bg-white/5 text-white' 
                            : 'hover:bg-slate-100 text-slate-800')
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {category.icon}
                      </span>
                      <span>{category.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isDark 
                        ? 'bg-slate-800 text-white/70' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard 
              intensity="light" 
              className={`p-4 ${isDark ? 'border border-white/10' : 'border border-slate-200'}`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Upcoming Deadlines
              </h2>
              <div className="space-y-3">
                {deadlines.length > 0 ? (
                  deadlines.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-md ${
                        isDark 
                          ? `${item.urgent ? 'bg-red-500/20 border border-red-500/20' : 'bg-slate-800/50 border border-white/5'}`
                          : `${item.urgent ? 'bg-red-100 border border-red-200' : 'bg-white border border-slate-200'}`
                      }`}
                    >
                      <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {item.text}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                          Due: {item.dueDate}
                        </span>
                        {item.urgent && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-red-500/30 text-red-300' : 'bg-red-200 text-red-700'
                          }`}>
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-6 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Main Task List */}
          <div className="lg:col-span-2">
            <Todo />
            
            <div className="mt-8">
              <GlassCard 
                intensity="light" 
                className={`p-4 ${isDark ? 'border border-white/10' : 'border border-slate-200'}`}
              >
                <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Task Completion
                </h2>
                <p className={`text-sm mb-4 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  Your progress on financial management tasks this month
                </p>
                
                <div className="space-y-4">
                  {progress.length > 0 ? (
                    progress.map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                            {item.name}
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {item.progress}%
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                          isDark ? 'bg-slate-800' : 'bg-slate-200'
                        }`}>
                          <div 
                            className="h-full rounded-full bg-blue-600" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-center py-6 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      Complete tasks to see your progress
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 