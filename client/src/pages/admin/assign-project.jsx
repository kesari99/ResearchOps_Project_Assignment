import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CommonForm from '@/components/ui/common-form'
import { assignProjectFormControls, assignProjectFormData } from '@/config'
import { AdminContext } from '@/context/admin-context'
import { AuthContext } from '@/context/auth-context'
import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const AssignProjectPage
 = () => {

    const {  
        projectData,
        setProjectData,
        handleSubmitProject
    } = useContext(AdminContext)

    const {auth} = useContext(AuthContext)

    const {userId} = useParams()

    useEffect(() => {
        setProjectData( prevData =>  ({
            ...projectData,
            assignedUserIds:[userId],
            ownerId:auth?.user?._id

        }))

    },[userId])


    


    const checkProjectFormValidity = () => {
        return projectData && 
                projectData.title  !== "" && 
                projectData.description !== "" && 
                projectData.startDate
    }

    console.log(projectData)

    


  return (
    <div className='container mx-auto p-4 w-full'>
        <div 
            className='flex justify-between items-center'
        >
            <h1
             className='font-3xl font-medium text-blue-400'
             > Assign New Project </h1>

             <Button
                className="text-blue-400"
                variant="secondary"
             >
                Assign

             </Button>

        </div>

        <Card className="py-7 mt-4 space-y-4" >

            <CardContent>
                <CommonForm  

                    formControls={assignProjectFormControls}
                    formData={projectData}
                    setFormData={setProjectData}
                    buttonText="Assign" 
                    isButtonDisabled={!checkProjectFormValidity}
                    handleSubmit={handleSubmitProject}


                />
            </CardContent>
        </Card>


    </div>
  )
}

export default AssignProjectPage
