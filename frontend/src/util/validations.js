
export function validateExpense(formData) 
{
    const errors = {};

    
    if (!formData.title.trim())
    {
        errors.title = "Expense description is required.";
    }

   
    if (!formData.amount) 
    {
        errors.amount = "Expense amount is required.";
    } else if (Number(formData.amount) <= 0)
    {
        errors.amount = "Amount must be greater than zero.";
    }

    
    if (!formData.date) 
    {
        errors.date = "Expense date is required.";
    }

   
    if (!formData.payerId) 
    {
        errors.payerId = "Please select who paid.";
    }

   
    if (!formData.splitMembers || formData.splitMembers.length === 0) 
    {
        errors.splitMembers = "Please select at least one participant.";
    }

    
    if (formData.payerId && formData.splitMembers?.length > 0 && !formData.splitMembers.some((member) => member.id === formData.payerId))
    {
        errors.splitMembers = "The payer must be included in participants.";
    }

  
    if (formData.splitType === "PERCENTAGE") 
    {
        const totalPercentage = formData.splitMembers?.reduce( (total, member) => total + Number(member.percentage || 0), 0) || 0;

        if (totalPercentage !== 100)
        {
            errors.percentage = "Total percentage must equal 100%.";
        }
    }

    return errors;
}


export function validateRegisterForm(formData)
{

     const validEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const  validPhone  = /^[6-9]\d{9}$/;
    const errors = {};

     
    if (!formData.name.trim()) 
    {
        errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) 
    {
        errors.name = "Name must contain at least 3 characters.";
    }


   
    if (!formData.email.trim()) 
    {
        errors.email = "Email is required.";

    } else if ( !validEmail.test(formData.email))
    {
        errors.email = "Please enter a valid email address.";
    }


    
   
    if (!formData.phone.trim()) 
    {
        errors.phone = "Phone number is required.";
    } else if (!validPhone.test(formData.phone))
    {
        errors.phone = "Please enter a valid 10-digit phone number.";
    }


   
    if (!formData.password)
    {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must contain at least 8 characters.";
    }

    
    if (!formData.confirmPassword)
    {
        errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }


    return errors;


}



