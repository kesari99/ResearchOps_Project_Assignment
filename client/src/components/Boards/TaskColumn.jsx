import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ column, tasks }) => {
  return (
    <div className="bg-gray-100 rounded-md w-64 flex-shrink-0">
      <h3 className="p-3 font-medium text-gray-700 border-b bg-gray-200 rounded-t-md">
        {column.title} <span className="text-gray-500 text-sm">({tasks.length})</span>
      </h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[500px] p-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;