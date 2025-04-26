import axiosInstance from '@/api/axiosInstance.js';


export async function registerService(signUpFormData){
    const {data} = await axiosInstance.post('/auth/register', {
        ...signUpFormData,
    
    })

    return data
}


export async function loginService(formData){
    const {data} = await axiosInstance.post('/auth/login', {
        ...formData,
        
    })

    return data
}


export async function checkAuthService(){
    try {
        const { data } = await axiosInstance.get("/auth/check-auth");
        return data;
      } catch (err) {
        
        return { success: false, message: "Authentication failed" };
      }
}


export async function getAllUsers(){
    try{

        const {data} = await axiosInstance.get('/admin/getallusers');
        return data

    } catch(err){
        return { success: false, message: "Authentication failed" };


    }
}

export async function assignProjectToUser(formData){
    try{

        const {data} = await axiosInstance.post('/admin/createproject', formData);
        return data

    } catch(err){
        return { success: false, message: "Authentication failed" };


    }
}


export async function getUserProjects(userId){
    try{

        const {data} = await axiosInstance.get(`/user/getProject/${userId}`);
        return data

    } catch(err){
        return { success: false, message: "Authentication failed" };


    }
}

export async function getProjectTasks(projectId) {
    try {
      const { data } = await axiosInstance.get(`/tasks/project/${projectId}`);
      return data;
    } catch (err) {
      console.error('Error fetching project tasks:', err);
      return { success: false, message: "Failed to fetch tasks" };
    }
  }
  
  export async function createTask(taskData) {
    try {
      const { data } = await axiosInstance.post('/tasks', taskData);
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      return { success: false, message: "Failed to create task" };
    }
  }
  
  export async function updateTaskStatus(taskId, statusData) {
    try {
      const { data } = await axiosInstance.patch(`/tasks/${taskId}/status`, statusData);
      return data;
    } catch (err) {
      console.error('Error updating task status:', err);
      return { success: false, message: "Failed to update task status" };
    }
  }
  
  export async function updateTask(taskId, taskData) {
    try {
      const { data } = await axiosInstance.put(`/tasks/${taskId}`, taskData);
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      return { success: false, message: "Failed to update task" };
    }
  }
  
  export async function deleteTask(taskId) {
    try {
      const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
      return data;
    } catch (err) {
      console.error('Error deleting task:', err);
      return { success: false, message: "Failed to delete task" };
    }
  }


  export async function getProjectById(projectId) {
  try {
    const { data } = await axiosInstance.get(`/projects/${projectId}`);
    return {
      success: true,
      data: data.data
    };
  } catch (err) {
    console.error('Error fetching project:', err);
    return {
      success: false,
      message: "Failed to fetch project details",
      error: err.response?.data?.message || err.message
    };
  }
}


export const getUserTasks = async (userId) => {
  try {
    const {data} = await axiosInstance.get(`/tasks/user/${userId}`);

    return data
    
    return data;
  } catch (error) {
    console.error('Error in getUserTasks service:', error);
    return { success: false, message: error.message };
  }
};


export const saveMeetingNotes = async (meetingData) => {
  try {
    const { data } = await axiosInstance.post('/meeting-notes', meetingData);
    return data;
  } catch (error) {
    console.error('Error in saveMeetingNotes service:', error);
    return { success: false, message: error.message };
  }
};

export const getUserMeetingNotes = async (userId) => {
  try {
    const { data } = await axiosInstance.get(`/meeting-notes/user/${userId}`);
    return data;
  } catch (error) {
    console.error('Error in getUserMeetingNotes service:', error);
    return { success: false, message: error.message };
  }
};

export const getProjectMeetingNotes = async (projectId) => {
  try {
    const { data } = await axiosInstance.get(`/meeting-notes/project/${projectId}`);
    return data;
  } catch (error) {
    console.error('Error in getProjectMeetingNotes service:', error);
    return { success: false, message: error.message };
  }
};

