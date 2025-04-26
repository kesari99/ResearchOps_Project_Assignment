import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { useParams } from 'react-router-dom';
import { getProjectTasks, updateTaskStatus } from '@/services';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

const ProjectBoard = () => {
  const { projectId } = useParams();
  const { auth } = useContext(AuthContext);
  const [columns, setColumns] = useState({
    'To Do': {
      id: 'todo',
      title: 'To Do',
      taskIds: []
    },
    'In Progress': {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: []
    },
    'Review': {
      id: 'review',
      title: 'Review',
      taskIds: []
    },
    'Done': {
      id: 'done',
      title: 'Done',
      taskIds: []
    }
  });
  
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getProjectTasks(projectId);
      if (response.success) {
        const tasksMap = {};
        const columnsCopy = { ...columns };
        
        Object.keys(columnsCopy).forEach(key => {
          columnsCopy[key].taskIds = [];
        });
        
        response.data.forEach(task => {
          tasksMap[task._id] = task;
          const status = task.status || 'To Do';
          if (columnsCopy[status]) {
            columnsCopy[status].taskIds.push(task._id);
          } else {
            columnsCopy['To Do'].taskIds.push(task._id);
          }
        });
        
        setTasks(tasksMap);
        setColumns(columnsCopy);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = Object.values(columns).find(col => col.id === source.droppableId);
    const destColumn = Object.values(columns).find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;

    const sourceTaskIds = [...sourceColumn.taskIds];
    const destTaskIds = source.droppableId === destination.droppableId 
      ? sourceTaskIds 
      : [...destColumn.taskIds];

    sourceTaskIds.splice(source.index, 1);
    
    if (source.droppableId === destination.droppableId) {
      sourceTaskIds.splice(destination.index, 0, draggableId);
    } else {
      destTaskIds.splice(destination.index, 0, draggableId);
    }

    const newColumns = {
      ...columns,
      [sourceColumn.title]: {
        ...sourceColumn,
        taskIds: sourceTaskIds
      },
      [destColumn.title]: {
        ...destColumn,
        taskIds: destTaskIds
      }
    };

    setColumns(newColumns);

    try {
      const newStatus = destColumn.title;
      const taskId = draggableId;
      
      const historyEntry = {
        timestamp: new Date().toISOString(),
        user: auth.user._id,
        previousStatus: tasks[taskId].status,
        newStatus: newStatus,
        comment: `Moved from ${tasks[taskId].status || 'To Do'} to ${newStatus}`
      };
      
      setTasks({
        ...tasks,
        [taskId]: {
          ...tasks[taskId],
          status: newStatus,
          lastUpdated: new Date().toISOString(),
          history: [...(tasks[taskId].history || []), historyEntry]
        }
      });
      
      await updateTaskStatus(taskId, {
        status: newStatus,
        historyEntry
      });
      
    } catch (error) {
      console.error('Error updating task status:', error);
      setColumns({...columns});
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks({
      ...tasks,
      [updatedTask._id]: updatedTask
    });
    
    const currentColumn = Object.entries(columns).find(([_, column]) => 
      column.taskIds.includes(updatedTask._id)
    );
    
    if (currentColumn && currentColumn[0] !== updatedTask.status) {
      const newColumns = { ...columns };
      
      // Remove from current column
      newColumns[currentColumn[0]].taskIds = newColumns[currentColumn[0]].taskIds
        .filter(id => id !== updatedTask._id);
      
      // Add to new column
      if (!newColumns[updatedTask.status].taskIds.includes(updatedTask._id)) {
        newColumns[updatedTask.status].taskIds.push(updatedTask._id);
      }
      
      setColumns(newColumns);
    }
  };

  const handleTaskDeleted = (taskId) => {
    const columnKey = Object.keys(columns).find(key => 
      columns[key].taskIds.includes(taskId)
    );
    
    if (columnKey) {
      const newColumns = { ...columns };
      newColumns[columnKey].taskIds = newColumns[columnKey].taskIds
        .filter(id => id !== taskId);
      
      setColumns(newColumns);
      
      const newTasks = { ...tasks };
      delete newTasks[taskId];
      setTasks(newTasks);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Project Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <TaskColumn 
              key={column.id}
              column={column}
              tasks={column.taskIds.map(taskId => tasks[taskId]).filter(Boolean)}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ProjectBoard;