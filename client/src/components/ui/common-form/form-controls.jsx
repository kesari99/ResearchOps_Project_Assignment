import React from 'react'
import { Label } from '../label'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const FormControls = ({
    formControls = [],
    formData,
    setFormData
}) => {

    console.log('formData', formData)

    const renderComponentByType = (getControlItem) => {

        let element = null  
        const currentControlItemValue = formData[getControlItem.name] || ''
        
        switch(getControlItem.componentType){

            case 'input':
                element = <Input
                    id = {getControlItem.name}
                    name = {getControlItem.name}
                    placeHolder = {getControlItem.placeholder}
                    value = {currentControlItemValue}
                    onChange = {(e) => setFormData({...formData, [getControlItem.name] : e.target.value})}
                
                />
                break;

            case 'date':
                element = (
                    <DatePicker
                        selected={currentControlItemValue ? new Date(currentControlItemValue) : null}
                        onChange={(date) => setFormData({...formData, [getControlItem.name]: date})}
                        placeholderText={getControlItem.placeholder}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        dropdownMode="select"
                    />
                )



                break;
            case 'select':
                element = <Select
                value = {currentControlItemValue}
                onValueChange={(value) => {setFormData({...formData, [getControlItem.name] : value})}}

                
                >
                   
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder={getControlItem.placeholher} />

                    </SelectTrigger>

                    <SelectContent>
                        {
                            getControlItem.options && getControlItem.options.length > 0 ? 
                            getControlItem.options.map((optionsItem) =>
                                 <SelectItem
                                    key={optionsItem.id}
                                    value={optionsItem.id}
                                 >
                                    {optionsItem.label}

                            </SelectItem>) : null
                        }
                    </SelectContent>


                
                    </Select>

                    break;
            case 'textarea':
                element = <Textarea
                    id = {getControlItem.name}
                    name = {getControlItem.name}
                    placeHolder = {getControlItem.placeholder}
                    value={currentControlItemValue}
                    onChange = {(e) => setFormData({...formData, [getControlItem.name] : e.target.value})}
                
                />
                break;
           
            default:
                element = <Input
                    id = {getControlItem.name}
                    name = {getControlItem.name}
                    placeHolder = {getControlItem.placeholder}
                    value = {currentControlItemValue}
                    onChange = {(e) => setFormData({...formData, [getControlItem.name] : e.target.value})}


                
                />

        }
        return element


    }



  return (

   

    <div className='flex flex-col gap-4'>
        {
            formControls.map(eachControl => (
                <div key={eachControl.name}>
                    <Label className="p-4">{eachControl.label}</Label>
                    {
                        renderComponentByType(eachControl)
                    }

                </div>
            ))
        }

     
    </div>
  )
}

export default FormControls