import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {Table,TableBody,TableCell,TableHead,TableHeader, TableRow} from '@/components/ui/table'
import { AdminContext } from '@/context/admin-context'
import { getAllUsers } from '@/services'
import React, { useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import { SquarePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {

    const {allUsersData, setAllUsersData} = useContext(AdminContext)
    const navigate   = useNavigate()

    async function fetchAllUsers(){
        const response = await getAllUsers()

        if(response?.success){
            setAllUsersData(response.data)

        }
    }

    useEffect(() => {
        fetchAllUsers()

    },[])

    console.log('allUsersData', allUsersData)


  return (

    <Card>
        <CardHeader>
            <CardTitle>All Users</CardTitle>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>UserName</TableHead>
                        <TableHead>Assigned Projects</TableHead>
                        <TableHead className="text-right">Actions</TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>
                    {
                        allUsersData.length > 0 ? allUsersData.map((user) => <TableRow>
                            <TableCell>{user.userName}</TableCell>
                            <TableCell>{user.assignedProjects.length}</TableCell>
                            <TableCell className="text-end">
                                <Button

                                variant="secondary"
                                onClick={() => navigate(`/project/add-project/${user._id}`)
                                }
                                >
                                    <SquarePlus />

                                </Button>
                            </TableCell>
                        </TableRow>) : null
                    }
                </TableBody>
            </Table>



        </CardHeader>

    </Card>
    
  )
}

export default AdminPage