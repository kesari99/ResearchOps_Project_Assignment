import { Button } from "../button"
import FormControls from "./form-controls"

const CommonForm = ({
    formData,
    setFormData,
    formControls=[],
    buttonText,
    handleSubmit,
    isButtonDisabled


}) => {
  return (
    <form onSubmit={handleSubmit}>

        <FormControls formControls={formControls} formData={formData} setFormData={setFormData}  />



        <Button  disabled={isButtonDisabled} type='submit' className='mt-5 w-full' >{buttonText || 'Submit' } </Button>
    </form>
  )
}

export default CommonForm