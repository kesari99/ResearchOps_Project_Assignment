import { createContext, useEffect, useState } from "react"

export const UserContext = createContext()

const UserProvider = ({children}) => {

    const [userProjects, setUserProjects] = useState([])




    return <UserContext.Provider value={{
        userProjects, 
        setUserProjects
    }}
    
    >
        {children}

    </UserContext.Provider>
} 

export default UserProvider 