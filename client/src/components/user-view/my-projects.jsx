import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { UserContext } from '@/context/user-context';
import { getUserProjects } from '@/services';

const MyProjects = () => {
  const { userProjects, setUserProjects } = useContext(UserContext);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  async function fetchUserProjects() {
    setLoading(true);
    try {
      const response = await getUserProjects(auth?.user?._id);
      if (response.success) {
        setUserProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      fetchUserProjects();
    }
  }, [auth?.user?._id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading projects...</div>;
  }

  if (!userProjects || userProjects.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        <p className="text-gray-600">You don't have any projects assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">My Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProjects.map((project) => (
          <Link
            to={`/projects/${project._id}`}
            key={project._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {project.owner?.userName?.charAt(0) || 'U'}
                  </div>
                  <span className="ml-2">{project.owner?.userName}</span>
                </div>
                
                <div>
                  {project.startDate && (
                    <span>
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-indigo-600 font-medium text-sm">
                View Board →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;