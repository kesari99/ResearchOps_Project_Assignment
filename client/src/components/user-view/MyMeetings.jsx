import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { AuthContext } from '@/context/auth-context';
import { getUserMeetingNotes } from '@/services';
import { LuChevronDown, LuChevronRight, LuCalendar, LuUser, LuList } from 'react-icons/lu';

const MyMeetings = () => {
  const { auth } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMeetings, setExpandedMeetings] = useState({});

  const fetchMeetingNotes = async () => {
    setLoading(true);
    try {
      const response = await getUserMeetingNotes(auth?.user?._id);
      if (response.success) {
        // Sort by date descending
        const sortedMeetings = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMeetings(sortedMeetings);
      }
    } catch (error) {
      console.error('Error fetching meeting notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) {
      fetchMeetingNotes();
    }
  }, [auth?.user?._id]);

  const toggleMeetingExpanded = (meetingId) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [meetingId]: !prev[meetingId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading meeting notes...</div>;
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">My Meetings</h2>
        <p className="text-gray-600">You don't have any recorded meeting notes yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">My Meeting Notes</h2>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleMeetingExpanded(meeting._id)}
            >
              <div className="flex items-center">
                {expandedMeetings[meeting._id] ? 
                  <LuChevronDown className="mr-2 text-gray-500" /> : 
                  <LuChevronRight className="mr-2 text-gray-500" />
                }
                <div>
                  <h3 className="font-medium">
                    {meeting.projectId?.title ? 
                      `${meeting.projectId.title} - Daily Standup` : 
                      'Daily Standup Meeting'
                    }
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center">
                    <LuCalendar className="mr-1" size={14} />
                    {format(new Date(meeting.createdAt), 'EEEE, MMMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
            </div>

            {expandedMeetings[meeting._id] && (
              <div className="p-4 border-t border-gray-200">
                {meeting.generalNote && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <LuList className="mr-1" size={16} />
                      General Notes
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                      {meeting.generalNote}
                    </div>
                  </div>
                )}

                {meeting.taskUpdates && meeting.taskUpdates.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Task Updates</h4>
                    <div className="space-y-4">
                      {meeting.taskUpdates.map((update) => (
                        <div key={update._id} className="border border-gray-200 rounded-md p-4">
                          <h5 className="font-medium mb-2">{update.taskId?.title || 'Unknown Task'}</h5>
                          
                          {update.yesterday && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-500 mb-1">Yesterday:</div>
                              <div className="text-gray-700 pl-2 text-sm">{update.yesterday}</div>
                            </div>
                          )}
                          
                          {update.today && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-500 mb-1">Today:</div>
                              <div className="text-gray-700 pl-2 text-sm">{update.today}</div>
                            </div>
                          )}
                          
                          {update.blockers && (
                            <div>
                              <div className="text-sm font-medium text-red-500 mb-1">Blockers:</div>
                              <div className="text-gray-700 pl-2 text-sm">{update.blockers}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMeetings;