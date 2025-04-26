import {  Library, LogOut, Projector, SearchSlash, User, Calendar } from "lucide-react"
import MyProjects from "../../components/user-view/my-projects"
import { Button } from "@/components/ui/button"
import {Tabs, TabsContent} from "@/components/ui/tabs"
import { AuthContext } from "@/context/auth-context"
import { useContext, useState } from "react"
import AllUsers from "../../components/admin-view/all-users"
import MyTasks from "../../components/user-view/my-tasks"
import MyMeetings from "@/components/user-view/MyMeetings"

const Listings = () => {

  const {auth}  = useContext(AuthContext)
  const role = auth.user.role


  const {resetCredentials} = useContext(AuthContext)

  const [activeTab, setActiveTab] = useState('')

  const menuItems = [
    {
      icon:Projector,
      label:'My Projects',
      value:'my-projects',
      visible:['manager','researcher'],
      component: <MyProjects />


    },
   
    {
      icon:Library,
      label:'My Tasks',
      value:'my-tasks',
      visible:['manager','researcher'],
      component: <MyTasks />


    },
    {
      icon:Calendar, 
      label:"Meeting",
      value:"meeting",
      visible:['manager','researcher'],
      component: <MyMeetings />


    },
    {
      icon:User,
      label:"All Users",
      value:'all-users',
      visible:['admin'],

      component: <AllUsers />
    },
   
    {
      icon:LogOut,
      label:'Logout',
      value:'logout',
      visible:['admin', 'manager','researcher'],

      component:null
  }
    
  ]

  const handleLogout = () => {
    resetCredentials()
    sessionStorage.clear();

  }


  return (
    <div className='flex  h-full min-h-screen bg-gray-50'>
      <aside className="w-64 p-5  bg-white">
        <h2 className="font-extrabold text-xl mb-5">{role} Dash Board</h2>
        <nav>
          {
            menuItems.map(eachItem => {

              if (eachItem.visible.includes(role)){
                return <Button
               key={eachItem.value}
               className='w-full mb-2 justify-start'  
               variant={activeTab === eachItem.value ? "secondary" : "ghost"}

               onClick = {
                eachItem.value === 'logout' ? handleLogout : () => setActiveTab(eachItem.value)
                }
              
              >
                <eachItem.icon />
                <span>{eachItem.label}</span>
              </Button>
              }
              
})
          }

        </nav>

      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        
        <Tabs
        value = {activeTab} onValueChange={setActiveTab}
        >
          {
            menuItems.map((menuItem) => 
              <TabsContent key={menuItem.value} value = {menuItem.value}>
                {
                  menuItem.component !== null ? menuItem.component : null 
                }

          </TabsContent>
            )
            
          }
          

        </Tabs>

      </main>

      
    </div>
  )
}

export default Listings