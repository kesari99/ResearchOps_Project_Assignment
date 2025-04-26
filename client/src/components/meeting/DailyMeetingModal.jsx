import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { AuthContext } from '@/context/auth-context';
import { getUserTasks, saveMeetingNotes } from '@/services';
import { LuX, LuSave, LuLoader, LuCheck } from 'react-icons/lu';

const DailyMeetingModal = ({ isOpen, onClose, projectId = null }) => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generalNote, setGeneralNote] = useState('');
  const [success, setSuccess] = useState(false);
  const [taskUpdates, setTaskUpdates] = useState({});

  useEffect(() => {
    if (isOpen && auth?.user?._id) {
      fetchUserTasks();
    }
  }, [isOpen, auth?.user?._id]);

  const fetchUserTasks = async () => {
    setLoading(true);
    try {
      const response = await getUserTasks(auth?.user?._id);
      if (response.success) {
        const filteredTasks = projectId 
          ? response.data.filter(task => task.project?._id === projectId)
          : response.data;
        
        const activeTasks = filteredTasks.filter(task => task.status !== 'Done');
        
        setTasks(activeTasks);
        
        const updates = {};
        activeTasks.forEach(task => {
          updates[task._id] = {
            yesterday: '',
            today: '',
            blockers: ''
          };
        });
        setTaskUpdates(updates);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (taskId, field, value) => {
    setTaskUpdates(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const taskUpdatesArray = Object.entries(taskUpdates).map(([taskId, updates]) => ({
        taskId,
        yesterday: updates.yesterday,
        today: updates.today,
        blockers: updates.blockers
      }));

      const meetingData = {
        userId: auth?.user?._id,
        projectId: projectId,
        taskUpdates: taskUpdatesArray,
        generalNote
      };

      const response = await saveMeetingNotes(meetingData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving meeting notes:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Daily Standup Meeting - {format(new Date(), 'EEEE, MMMM d')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            disabled={saving}
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LuLoader className="animate-spin mr-2" size={24} />
              <span>Loading your tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">You don't have any active tasks to update.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  General Notes / Other Updates
                </label>
                <textarea
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Any other updates you want to share with the team..."
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Task Updates</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Task</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Yesterday</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Today</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Blockers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task._id}>
                          <td className="px-4 py-4 align-top">
                            <div className="font-medium text-gray-800">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.project?.title}</div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <textarea
                              value={taskUpdates[task._id]?.yesterday || ''}
                              onChange={(e) => handleInputChange(task._id, 'yesterday', e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 h-24 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="What did you work on yesterday?"
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <textarea
                              value={taskUpdates[task._id]?.today || ''}
                              onChange={(e) => handleInputChange(task._id, 'today', e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 h-24 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="What will you work on today?"
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <textarea
                              value={taskUpdates[task._id]?.blockers || ''}
                              onChange={(e) => handleInputChange(task._id, 'blockers', e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2 h-24 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Any blockers or challenges?"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={saving || success}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    success
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {saving ? (
                    <>
                      <LuLoader className="animate-spin mr-2" size={18} />
                      <span>Saving...</span>
                    </>
                  ) : success ? (
                    <>
                      <LuCheck className="mr-2" size={18} />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <LuSave className="mr-2" size={18} />
                      <span>Submit Daily Update</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyMeetingModal;