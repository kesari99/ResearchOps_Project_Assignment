import { Card,CardContent,CardDescription,CardHeader, CardTitle } from '@/components/ui/card'
import CommonForm from '@/components/ui/common-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signInFormControls, signUpFormControls } from '@/config'
import { AuthContext } from '@/context/auth-context'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

const AuthPage = () => {

    const [activetab, setActiveTab] = useState('signin')
    const {
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
    
    } = useContext(AuthContext)

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const CheckIfIsSignInFormValid = () => {
        return signInFormData && signInFormData.userEmail !== '' && signInFormData.password !== ''

    }

    const CheckIfIsSignUpFormValid = () => {
        return (
            signUpFormData && signUpFormData.userName !== '' &&
            signUpFormData.UserEmail !== '' && 
            signUpFormData.password !== ''
        )
    }



    return (

        <div className='flex flex-col min-h-screen px-6 lg:px-14 h-14'>

            <header className='flex items-center border-bottom'>
                <Link to='/' className='flex items-center justify-center'>
                    <span className='font-extrabold text-xl '>MyListings</span>

                </Link>

            </header>


            <div className='flex items-center justify-center min-h-screen bg-background'>
                <Tabs
                    activeTab={activetab}
                    defaultValue='signin'
                    onValueChange={handleTabChange}
                    className='w-full max-w-md'

                >
                    <TabsList
                        className='grid w-full grid-cols-2'

                    >
                        <TabsTrigger value='signin'>Sign In</TabsTrigger>
                        <TabsTrigger value='signup'>Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value='signin'>
                        <Card className="p-6 space-y-6">
                            <CardHeader>
                                <CardTitle>Sign in to your account</CardTitle>
                                <CardDescription>Enter your email and password to access your account</CardDescription>

                            </CardHeader>
                            <CardContent>
                                <CommonForm
                                    formControls = {signInFormControls}
                                    buttonText='Sign In'
                                    formData={signInFormData}
                                    setFormData={setSignInFormData}
                                    isButtonDisabled={!CheckIfIsSignInFormValid()}

                                    handleSubmit={handleLoginUser}

                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value='signup'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Create new account</CardTitle>
                                <CardDescription>Enter your details to get started</CardDescription>
                                <CardContent>
                                <CommonForm
                                    formControls = {signUpFormControls}
                                    buttonText='Sign Up'
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    isButtonDisabled={!CheckIfIsSignUpFormValid()}

                                    handleSubmit={handleRegisterUser}

                                />
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </TabsContent>


                </Tabs>


            </div>
        </div>


    )
}

export default AuthPage