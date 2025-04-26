import React, { useState, useContext } from 'react';
import { format } from 'date-fns';
import { updateTask, deleteTask } from '@/services';
import { AuthContext } from '@/context/auth-context';
import { 
  LuX, 
  LuTrash2, 
  LuPencil, 
  LuSave, 
  LuCalendar, 
  LuUser, 
  LuClock, 
  LuTag,
} from 'react-icons/lu';
import { Button } from '../ui/button';

const TaskCardDetail = ({ task, onClose, onTaskUpdated, onTaskDeleted }) => {
  const { auth } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  const handleTagsChange = (e) => {
    const tagsValue = e.target.value;
    setEditedTask({
      ...editedTask,
      tags: tagsValue.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateTask(task._id, editedTask);
      if (response.success) {
        onTaskUpdated(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTask(task._id);
      if (response.success) {
        onTaskDeleted(task._id);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
     
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="text-2xl font-bold w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <h2 className="text-2xl font-bold">{task.title}</h2>
            )}
            
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <LuPencil size={20} />
                </button>
              )}
              
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="text-gray-500 hover:text-green-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <LuSave size={20} />
                </button>
              )}
              
              <button
                onClick={() => isEditing ? setIsEditing(false) : setIsDeleting(!isDeleting)}
                className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
              >
                {isDeleting ? <LuTrash2 size={20} /> : <LuX size={20} />}
              </button>
            </div>
          </div>
          
          {isDeleting ? (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>

               
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <LuUser className="mr-2" />
                  <span>Assigned to: </span>
                  <span className="font-semibold ml-1">
                    {task.assignedUser ? task.assignedUser.userName : 'Unassigned'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <LuClock className="mr-2" />
                    <span>Last updated: </span>
                    <span className="font-semibold ml-1">
                      {task.lastUpdated ? format(new Date(task.lastUpdated), 'MMM d, yyyy h:mm a') : 'Never'}
                    </span>
                  </div>
                  
                  {task.deadline && (
                    <div className="flex items-center text-sm text-gray-500">
                      <LuCalendar className="mr-2" />
                      <span>Deadline: </span>
                      <span className="font-semibold ml-1">
                        {format(new Date(task.deadline), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority} Priority
                  </div>
                  
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'Review' ? 'bg-purple-100 text-purple-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedTask.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                    {task.description || 'No description provided.'}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Research Topic</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="researchTopic"
                    value={editedTask.researchTopic || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <LuTag className="mr-2 text-gray-500" />
                    <span>{task.researchTopic || 'None'}</span>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Priority</label>
                    <select
                      name="priority"
                      value={editedTask.priority}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={editedTask.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={editedTask.deadline ? new Date(editedTask.deadline).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Tags</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={(editedTask.tags || []).join(', ')}
                    onChange={handleTagsChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="feature, ui, bug"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {task.tags && task.tags.length > 0 ? (
                      task.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No tags</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          
          {task.history && task.history.length > 0 && !isDeleting && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Task History</h3>
              <div className="space-y-3">
                {task.history.slice().reverse().map((entry, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4 py-1">
                    <div className="text-sm">
                      <span className="font-medium">
                        {entry.timestamp ? format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a') : 'Unknown date'}
                      </span>
                      <span className="text-gray-500 ml-2">{entry.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

    <Button
    onClick={onClose}
    className="absolute top-6 right-24 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-blue-100"
    title="Close"
    variant="secondary"
  >
    close
  </Button>
      </div>
    </div>
  );
};

export default TaskCardDetail;