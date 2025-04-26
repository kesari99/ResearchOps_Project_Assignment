
export const authRoles = [
    {id:"admin", label : "Admin"  },
    {id:"manager", label : "Manager"  },
    {id:"researcher", label : "Researcher"  }


]

export const signUpFormControls = [
  

    {
        label:'User Name',
        name:'userName',
        type:'text',
        componetType:'input',
        placeholder:'Enter user name',

    },
    {
        label:'User Email',
        name:'userEmail',
        type:'text',
        componetType:'input',
        placeholder:'Enter user email',

    },
    {
        label:'Password',
        name:'password',
        type:'text',
        componetType:'input',
        placeholder:'Enter user password',

    },

    {
        label:"Role",
        name:"role",
        type:'text',
        componentType:'select',
        placeholher:"choose your role",
        options:authRoles

    }
]




export const signInFormControls = [
  

   
    {
        label:'User Email',
        name:'userEmail',
        type:'text',
        componetType:'input',
        placeholder:'Enter user email',

    },
    {
        label:'Password',
        name:'password',
        type:'text',
        componetType:'input',
        placeholder:'Enter user password',

    },
]

export const initialSignInFormData = {
    userEmail:'',
    password:'',
}



export const initialSignUpFormData = {
    userName:'',
    userEmail:'',
    password:'',
    role: ''
}


export const assignProjectFormControls = [
    {
        label:'Title',
        name:'title',
        type:'text',
        componetType:'input',
        placeholder:'Enter project Title',

    },
    {
        label:'Description',
        name:'description',
        type:'text',
        componetType:'input',
        placeholder:'Enter Description',

    },
    {
        label:'Start Date',
        name:'startDate',
        type:'text',
        componentType:'date',
        placeholder:'Enter start date',

    }
]

export const  assignProjectFormData = {
    title : "",
    description: "",
    startDate:null

}

