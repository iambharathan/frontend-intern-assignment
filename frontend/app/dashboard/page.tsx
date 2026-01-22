'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task, TaskFormData } from '@/types';
import { taskSchema } from '@/lib/validations';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '@/lib/services/taskService';
import { getCurrentUser } from '@/lib/services/authService';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCheck,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; taskId: string; taskTitle: string }>({
    show: false,
    taskId: '',
    taskTitle: ''
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'pending',
      priority: 'medium',
    },
  });

  // Fetch user info and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user from localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('User from localStorage:', user);
          setUserName(user.name || 'User');
        }
        
        // Try to fetch fresh user data from API
        try {
          console.log('Fetching user data from API...');
          const user = await getCurrentUser();
          console.log('User data from API:', user);
          if (user && user.name) {
            setUserName(user.name);
          }
        } catch (userErr) {
          console.log('Could not fetch user from API, using stored data');
        }
        
        console.log('Fetching tasks...');
        await loadTasks();
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setTasks([]); // Ensure tasks is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load tasks with filters
  const loadTasks = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await getTasks(params);
      console.log('Tasks loaded:', data);
      // Ensure data is an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
      setError(err.response?.data?.message || 'Failed to load tasks');
      setTasks([]); // Set empty array on error
    }
  };

  // Reload tasks when filters change
  useEffect(() => {
    if (!loading) {
      loadTasks();
    }
  }, [searchQuery, statusFilter, priorityFilter]);

  // Handle create or update task
  const onSubmit = async (data: TaskFormData) => {
    try {
      setError('');
      setSuccess('');
      if (editingTask) {
        await updateTask(editingTask._id, data);
        setSuccess('Task updated successfully! ✅');
        setEditingTask(null);
      } else {
        await createTask(data);
        setSuccess('Task created successfully! 🎉');
        setShowAddForm(false);
      }
      reset();
      await loadTasks();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  // Handle edit task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('status', task.status);
    setValue('priority', task.priority);
    setShowAddForm(true);
  };

  // Handle delete task
  const handleDelete = (taskId: string, taskTitle: string) => {
    setDeleteConfirmation({ show: true, taskId, taskTitle });
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setError('');
      setSuccess('');
      await deleteTask(deleteConfirmation.taskId);
      setSuccess('Task deleted successfully! 🗑️');
      setDeleteConfirmation({ show: false, taskId: '', taskTitle: '' });
      await loadTasks();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setDeleteConfirmation({ show: false, taskId: '', taskTitle: '' });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, taskId: '', taskTitle: '' });
  };

  // Quick status toggle
  const handleStatusToggle = async (task: Task) => {
    try {
      setError('');
      const newStatus =
        task.status === 'completed'
          ? 'pending'
          : task.status === 'pending'
          ? 'in-progress'
          : 'completed';

      await updateTask(task._id, { status: newStatus });
      await loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingTask(null);
    setShowAddForm(false);
    reset();
  };

  // Get status badge variant and icon
  const getStatusVariant = (status: string): "pending" | "progress" | "completed" => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'progress';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'in-progress':
        return <Clock className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string): "low" | "medium" | "high" => {
    switch (priority) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      default:
        return 'low';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="text-gray-400 text-sm">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="max-w-md w-full mx-4 border-red-900/50 shadow-2xl shadow-red-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-gray-100 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                Delete Task?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-gray-100">"{deleteConfirmation.taskTitle}"</span>? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Welcome Section */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20 shadow-purple-500/10 border border-purple-900/30">
        <CardHeader>
          <CardTitle className="text-3xl text-gray-100">
            {userName}'s Dashboard
          </CardTitle>
          <CardDescription className="text-base text-gray-300">
            {tasks.length === 0 
              ? "Your task list is clear. Ready to add your first task?"
              : tasks.length === 1
              ? "You have 1 task to conquer today."
              : `You're managing ${tasks.length} tasks. Stay organized!`
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-900/50 bg-red-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-300">Error</p>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Display */}
      {success && (
        <Card className="border-green-900/50 bg-green-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCheck className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-sm font-medium text-green-300">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-100">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Tasks
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-800 bg-black text-gray-100 px-4 py-2 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:border-purple-600"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-800 bg-black text-gray-100 px-4 py-2 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:border-purple-600"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          size="lg"
          className="w-full"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </Button>
      )}

      {/* Add/Edit Task Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-100">
              <span>{editingTask ? 'Edit Task' : 'Add New Task'}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  {...register('title')}
                  type="text"
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-800 bg-black text-gray-100 px-4 py-2 text-sm transition-all placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                  placeholder="Enter task description (optional)"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      {...register('status')}
                      className="flex h-10 w-full rounded-lg border border-gray-800 bg-black text-gray-100 px-4 py-2 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:border-purple-600"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority *
                  </label>
                  <div className="relative">
                    <select
                      {...register('priority')}
                      className="flex h-10 w-full rounded-lg border border-gray-800 bg-black text-gray-100 px-4 py-2 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:border-purple-600"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239333ea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.priority.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="default"
                  size="lg"
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingTask ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      Update Task
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Task
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <ListTodo className="w-6 h-6" />
            Your Tasks
            <Badge variant="outline" className="ml-2">
              {tasks.length}
            </Badge>
          </h2>
          {tasks.length > 0 && (
            <p className="text-xs text-gray-400 italic flex items-center gap-1">
              <Circle className="w-3 h-3" />
              Click status badge to toggle
            </p>
          )}
        </div>

        {tasks.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-950 p-6 mb-4 border border-gray-900">
                <ListTodo className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">No tasks yet</h3>
              <p className="text-sm text-gray-400 mb-6 text-center">
                Add a task to get started.
              </p>
              <Button onClick={() => setShowAddForm(true)} size="lg">
                <Plus className="w-5 h-5" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {task.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant={getStatusVariant(task.status)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleStatusToggle(task)}
                      title="Click to change status"
                    >
                      {getStatusIcon(task.status)}
                      {task.status === 'in-progress' ? 'In Progress' : task.status}
                    </Badge>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority} priority
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(task)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(task._id, task.title)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
