import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { format } from 'date-fns';
import { LuCalendar, LuClock, LuTag } from 'react-icons/lu';
import TaskCardDetail from '../Boards/TaskCardDetail';
import {  updateTask, deleteTask, getUserTasks } from '@/services';


const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Done':
      return 'bg-green-100 text-green-800';
    case 'Review':
      return 'bg-purple-100 text-purple-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'To Do':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyTasks = () => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'priority', 'project'

  const fetchUserTasks = async () => {
    setLoading(true);
    try {
      const response = await getUserTasks(auth?.user?._id);
      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) {
      fetchUserTasks();
    }
  }, [auth?.user?._id]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    setSelectedTask(null);
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
    setSelectedTask(null);
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...tasks];
    
    // Apply filters
    if (filter === 'active') {
      filteredTasks = filteredTasks.filter(task => task.status !== 'Done');
    } else if (filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.status === 'Done');
    }
    
    // Apply sorting
    filteredTasks.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityWeight[a.priority] - priorityWeight[b.priority];
      }
      if (sortBy === 'project') {
        return a.project?.title?.localeCompare(b.project?.title);
      }
      return 0;
    });
    
    return filteredTasks;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        <p className="text-gray-600">You don't have any tasks assigned to you yet.</p>
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        
        <div className="flex gap-4">
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-sm text-gray-600">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="project">Project</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr 
                  key={task._id} 
                  onClick={() => handleTaskClick(task)} 
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-800">{task.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link 
                      to={`/projects/${task.project?._id}`} 
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.project?.title || 'Unknown Project'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {task.deadline 
                      ? format(new Date(task.deadline), 'MMM d, yyyy')
                      : <span className="text-gray-400">No deadline</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <TaskCardDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
};

export default MyTasks;