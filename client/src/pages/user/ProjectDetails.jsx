import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, createTask } from '@/services';
import { AuthContext } from '@/context/auth-context';
import { IoAdd } from 'react-icons/io5';
import ProjectBoard from '@/components/Boards/ProjectBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { auth } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    tags: '',
    deadline: '',
    researchTopic: '',
    status: 'To Do'
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectById(projectId);
        if (response.success) {
          setProject(response.data);
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...newTask,
        projectId,
        assignedUserId: auth.user._id,
        tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      const response = await createTask(taskData);
      
      if (response.success) {
        const updatedProject = await getProjectById(projectId);
        if (updatedProject.success) {
          setProject(updatedProject.data);
        }
        
        setNewTask({
          title: '',
          description: '',
          priority: 'Medium',
          tags: '',
          deadline: '',
          researchTopic: '',
          status: 'To Do'
        });
        setIsAddTaskModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center py-10">Project not found</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        
        <Button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-1"
        >
          <IoAdd className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProjectBoard/>
      </div>
      
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                  Priority
                </label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <Input
                    type="text"
                    id="tags"
                    name="tags"
                    value={newTask.tags}
                    onChange={handleInputChange}
                    placeholder="feature, ui, bug"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="researchTopic">
                    Research Topic
                  </label>
                  <Input
                    type="text"
                    id="researchTopic"
                    name="researchTopic"
                    value={newTask.researchTopic}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                  Deadline
                </label>
                <Input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <Select 
                  value={newTask.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddTaskModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;