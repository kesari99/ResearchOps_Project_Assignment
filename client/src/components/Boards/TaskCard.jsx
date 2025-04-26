// components/Board/TaskCard.js
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { LuCalendar, LuClock, LuTag } from 'react-icons/lu';
import TaskCardDetail from './TaskCardDetail';

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

const TaskCard = ({ task, index, onTaskUpdated, onTaskDeleted }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleTaskClick = () => {
    setIsDetailOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleTaskClick}
            className={`p-3 mb-2 bg-white rounded-md shadow ${
              snapshot.isDragging ? 'shadow-lg' : ''
            } cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            
            {task.researchTopic && (
              <div className="mb-2 flex items-center text-xs text-gray-500">
                <LuTag className="mr-1" />
                Research: {task.researchTopic}
              </div>
            )}
            
            {task.assignedUser && (
              <div className="mb-2">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {task.assignedUser.userName?.charAt(0) || 'U'}
                  </div>
                  <span className="ml-2 text-xs text-gray-600">{task.assignedUser.userName}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {task.deadline && (
                <div className="flex items-center">
                  <LuCalendar className="mr-1" />
                  {format(new Date(task.deadline), 'MMM d')}
                </div>
              )}
              
              {task.lastUpdated && (
                <div className="flex items-center">
                  <LuClock className="mr-1" />
                  {format(new Date(task.lastUpdated), 'MMM d, h:mm a')}
                </div>
              )}
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Draggable>
      
      {isDetailOpen && (
        <TaskCardDetail
          task={task}
          onClose={() => setIsDetailOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      )}
    </>
  );
};

export default TaskCard;