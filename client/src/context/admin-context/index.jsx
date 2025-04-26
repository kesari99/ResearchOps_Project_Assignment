import { assignProjectFormData } from "@/config"
import { assignProjectToUser } from "@/services"
import { createContext, useEffect, useState } from "react"




export const AdminContext = createContext()



const AdminProvider = ({children}) => {


    const [allUsersData, setAllUsersData] = useState([])
    const [projectData, setProjectData] = useState(assignProjectFormData)

    const handleSubmitProject = async (event) => {
        event.preventDefault()



        const response = await assignProjectToUser(projectData)

        if (response.success){
            setProjectData(prevData => ({
                title : "",
                description: "",
                startDate:null
            })
               
            )
        }
        
    }



    return <AdminContext.Provider value = {{
        allUsersData,
        setAllUsersData,
        projectData,
        setProjectData,
        handleSubmitProject

    }}
      >
        {children}
    </AdminContext.Provider>

}

export default AdminProvider