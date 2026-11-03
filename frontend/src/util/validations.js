
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