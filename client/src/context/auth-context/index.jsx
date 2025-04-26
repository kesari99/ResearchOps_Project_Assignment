import { initialSignInFormData, initialSignUpFormData } from "@/config"
import { checkAuthService, loginService, registerService } from "@/services"
import { createContext, useEffect, useState } from "react"


export const AuthContext = createContext()


const AuthProvider = ({children}) => {

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData)
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData)
    const [auth, setAuth] = useState({
        authenticate:false,
        user:null
    })


    const [loading, setLoading] = useState(true)   

    async function handleRegisterUser(event){
        event.preventDefault()

        const data = await registerService(signUpFormData)

        console.log(data)

    }

    async function handleLoginUser(event){
        event.preventDefault()

        const data = await loginService(signInFormData)

        if(data.success){

            console.log(data.user)
            
            sessionStorage.setItem('accessToken', JSON.stringify(data.data))
            setAuth({
                authenticate:true,
                user:data.user 
            })
            
        }
        else{
            setAuth({
                authenticate:false,
                user:null
            })

        }


    }

    async function checkAuthUser(){

        try{
            const data = await checkAuthService()
    

        if(data.success){
            
            setAuth({
                authenticate:true,
                user:data.data
            })
            setLoading(false)

        }
        else{
            setAuth({
                authenticate:false,
                user:null
            })
            setLoading(false)

        }

        // console.log(data.data)

        }catch(error){
            if(error?.response?.data?.success){
                setAuth({
                    authenticate:false,
                    user:null
                })
                setLoading(false)
            }

        }

       

        



    }

    function resetCredentials() {
        setAuth({
        authenticate: false,
          user: null,
        });
      }




    useEffect(() => {
        checkAuthUser()
        

    },[])

    console.log('auth', auth)


    

  return  <AuthContext.Provider value={{
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    auth,
    resetCredentials
  }}>
    {children}
  </AuthContext.Provider>
    
}

export default AuthProvider